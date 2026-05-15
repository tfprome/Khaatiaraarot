import { Worker, Job } from 'bullmq';
import { and, eq, lte } from 'drizzle-orm';
import { db } from '../config/db';
import { invoices, orders, products, users } from '../db/schema';
import { createBullmqConnection } from '../config/bullmq';
import { generateInvoicePdf } from '../services/invoice.service';
import { uploadToCloudinary } from '../services/image.service';
import { sendInvoiceEmail, sendLowStockAlert } from '../services/email.service';
import { emailQueue } from './index';
import type { EmailJobData, InvoiceJobData, StockAlertJobData } from './index';

const workerOpts = { connection: createBullmqConnection() };

// ── Invoice worker ──────────────────────────────────────────────────────────
async function processInvoiceJob(job: Job<InvoiceJobData>) {
  const { orderId } = job.data;

  const order = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
    with: { items: true, invoice: true },
  });
  if (!order) throw new Error(`Order ${orderId} not found`);
  if (order.invoice) return; // already processed (idempotent)

  const invoiceNumber = `INV-${order.orderNumber.slice(3)}`; // KA-2026-00001 → INV-2026-00001
  const pdfBuffer = await generateInvoicePdf(order, invoiceNumber);

  const { url: pdfUrl, publicId } = await uploadToCloudinary(
    pdfBuffer,
    'khaatiaraarot/invoices',
    'raw',
  );

  const [invoice] = await db
    .insert(invoices)
    .values({ orderId, number: invoiceNumber, pdfUrl, publicId })
    .returning();

  // Fetch user email for the email job
  const user = order.userId
    ? await db.query.users.findFirst({
        where: eq(users.id, order.userId),
        columns: { email: true },
      })
    : null;

  if (user?.email) {
    await emailQueue.add('send-invoice', {
      to: user.email,
      orderNumber: order.orderNumber,
      invoiceNumber: invoice.number,
      pdfUrl: invoice.pdfUrl!,
    } satisfies EmailJobData);
  }
}

// ── Email worker ────────────────────────────────────────────────────────────
async function processEmailJob(job: Job<EmailJobData>) {
  const { to, orderNumber, invoiceNumber, pdfUrl } = job.data;
  await sendInvoiceEmail(to, orderNumber, invoiceNumber, pdfUrl);

  // Mark invoice as sent
  await db
    .update(invoices)
    .set({ sentAt: new Date() })
    .where(eq(invoices.number, invoiceNumber));
}

// ── Stock alert worker ──────────────────────────────────────────────────────
async function processStockAlertJob(job: Job<StockAlertJobData>) {
  const { productName, stockQty, threshold } = job.data;
  await sendLowStockAlert(productName, stockQty, threshold);
}

export function startWorkers() {
  const invoiceWorker = new Worker('invoice', processInvoiceJob, workerOpts);
  const emailWorker = new Worker('email', processEmailJob, workerOpts);
  const stockAlertWorker = new Worker('stock-alert', processStockAlertJob, workerOpts);

  for (const worker of [invoiceWorker, emailWorker, stockAlertWorker]) {
    worker.on('failed', (job, err) => {
      console.error(`[queue:${worker.name}] job ${job?.id} failed:`, err.message);
    });
  }

  console.log('Queue workers started: invoice, email, stock-alert');
  return { invoiceWorker, emailWorker, stockAlertWorker };
}
