import { pgTable, uuid, text, timestamp, numeric, integer, boolean, index } from 'drizzle-orm/pg-core';
import { users } from './users';
import { orders } from './orders';

export const coupons = pgTable('coupons', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: text('code').notNull().unique(),
  type: text('type', { enum: ['percentage', 'fixed'] }).notNull(),
  value: numeric('value', { precision: 10, scale: 2 }).notNull(),
  minOrderAmount: numeric('min_order_amount', { precision: 10, scale: 2 }),
  maxDiscount: numeric('max_discount', { precision: 10, scale: 2 }),
  usageLimit: integer('usage_limit'),
  usedCount: integer('used_count').notNull().default(0),
  perUserLimit: integer('per_user_limit').notNull().default(1),
  isActive: boolean('is_active').notNull().default(true),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const couponUsages = pgTable('coupon_usages', {
  id: uuid('id').primaryKey().defaultRandom(),
  couponId: uuid('coupon_id').notNull().references(() => coupons.id, { onDelete: 'restrict' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  orderId: uuid('order_id').notNull().unique().references(() => orders.id, { onDelete: 'restrict' }),
  discountApplied: numeric('discount_applied', { precision: 10, scale: 2 }).notNull(),
  usedAt: timestamp('used_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  couponUserIdx: index('idx_coupon_usages_coupon_user').on(table.couponId, table.userId),
}));

export type Coupon = typeof coupons.$inferSelect;
export type NewCoupon = typeof coupons.$inferInsert;
export type CouponUsage = typeof couponUsages.$inferSelect;
