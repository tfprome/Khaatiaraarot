import { pgTable, uuid, text, timestamp, numeric, integer, jsonb, index } from 'drizzle-orm/pg-core';
import { users } from './users';
import { products } from './products';

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  orderNumber: text('order_number').notNull().unique(),
  status: text('status', {
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
  }).notNull().default('pending'),
  paymentMethod: text('payment_method', {
    enum: ['cash', 'card', 'gcash', 'bkash', 'nagad', 'manual'],
  }).notNull(),
  paymentStatus: text('payment_status', {
    enum: ['unpaid', 'paid', 'refunded'],
  }).notNull().default('unpaid'),
  subtotal: numeric('subtotal', { precision: 10, scale: 2 }).notNull(),
  deliveryFee: numeric('delivery_fee', { precision: 10, scale: 2 }).notNull().default('0'),
  discount: numeric('discount', { precision: 10, scale: 2 }).notNull().default('0'),
  total: numeric('total', { precision: 10, scale: 2 }).notNull(),
  notes: text('notes'),
  source: text('source', {
    enum: ['web', 'facebook', 'phone', 'admin'],
  }).notNull().default('web'),
  shippingAddressSnapshot: jsonb('shipping_address_snapshot').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userIdx: index('idx_orders_user').on(table.userId),
  statusIdx: index('idx_orders_status').on(table.status),
  createdIdx: index('idx_orders_created').on(table.createdAt),
}));

export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'restrict' }),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'set null' }),
  productSnapshot: jsonb('product_snapshot').notNull(),
  quantity: integer('quantity').notNull(),
  unitPrice: numeric('unit_price', { precision: 10, scale: 2 }).notNull(),
  totalPrice: numeric('total_price', { precision: 10, scale: 2 }).notNull(),
}, (table) => ({
  orderIdx: index('idx_order_items_order').on(table.orderId),
}));

export const orderStatusHistory = pgTable('order_status_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'restrict' }),
  status: text('status').notNull(),
  note: text('note'),
  changedBy: uuid('changed_by').references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type OrderStatusHistory = typeof orderStatusHistory.$inferSelect;
