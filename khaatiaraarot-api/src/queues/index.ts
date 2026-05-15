import { Queue } from 'bullmq';
import { createBullmqConnection } from '../config/bullmq';

const connection = createBullmqConnection();

const defaultJobOptions = {
  attempts: 5,
  backoff: { type: 'exponential' as const, delay: 2000 },
  removeOnComplete: false,
  removeOnFail: false,
};

export const invoiceQueue = new Queue('invoice', { connection, defaultJobOptions });
export const emailQueue = new Queue('email', { connection, defaultJobOptions });
export const stockAlertQueue = new Queue('stock-alert', { connection, defaultJobOptions });

export interface InvoiceJobData {
  orderId: string;
}

export interface EmailJobData {
  to: string;
  orderNumber: string;
  invoiceNumber: string;
  pdfUrl: string;
}

export interface StockAlertJobData {
  productId: string;
  productName: string;
  stockQty: number;
  threshold: number;
}
