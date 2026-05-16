import nodemailer from 'nodemailer';
import { config } from '../config';

function createTransporter() {
  return nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpPort === 465,
    auth: { user: config.smtpUser, pass: config.smtpPass },
  });
}

export async function sendInvoiceEmail(
  to: string,
  orderNumber: string,
  invoiceNumber: string,
  pdfUrl: string,
): Promise<void> {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"Khaati Aarot" <${config.smtpFrom}>`,
    to,
    subject: `Order Confirmed — ${orderNumber}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#1a1a1a">Thank you for your order!</h2>
        <p>Your order <strong>${orderNumber}</strong> has been placed successfully.</p>
        <p>Invoice: <strong>${invoiceNumber}</strong></p>
        <p>
          <a href="${pdfUrl}"
             style="display:inline-block;padding:10px 20px;background:#2d6a4f;color:#fff;text-decoration:none;border-radius:4px">
            Download Invoice
          </a>
        </p>
        <p style="color:#666;font-size:13px">
          We will update you once your order is confirmed and shipped.
        </p>
        <hr style="border:none;border-top:1px solid #eee"/>
        <p style="color:#aaa;font-size:12px">Khaati Aarot — Authentic Bengali Groceries</p>
      </div>
    `,
  });
}

export async function sendLowStockAlert(
  productName: string,
  stockQty: number,
  threshold: number,
): Promise<void> {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"Khaati Aarot System" <${config.smtpFrom}>`,
    to: config.smtpFrom,
    subject: `Low Stock Alert: ${productName}`,
    html: `
      <div style="font-family:sans-serif">
        <h3>⚠️ Low Stock Alert</h3>
        <p><strong>${productName}</strong> is running low.</p>
        <p>Current stock: <strong>${stockQty}</strong> units (threshold: ${threshold})</p>
        <p>Please restock soon.</p>
      </div>
    `,
  });
}
