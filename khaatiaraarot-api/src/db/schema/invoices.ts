import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { orders } from './orders';

export const invoices = pgTable('invoices', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').notNull().unique().references(() => orders.id),
  number: text('number').notNull().unique(),
  pdfUrl: text('pdf_url'),
  publicId: text('public_id'),
  sentAt: timestamp('sent_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;
