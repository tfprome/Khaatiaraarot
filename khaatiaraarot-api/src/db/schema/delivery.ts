import { pgTable, uuid, text, boolean, timestamp, numeric, index, unique } from 'drizzle-orm/pg-core';

export const ratePlans = pgTable('rate_plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const ratePlanDistricts = pgTable('rate_plan_districts', {
  id: uuid('id').primaryKey().defaultRandom(),
  planId: uuid('plan_id').notNull().references(() => ratePlans.id, { onDelete: 'cascade' }),
  district: text('district').notNull(),
  costPerUnit: numeric('cost_per_unit', { precision: 10, scale: 2 }).notNull(),
}, (table) => ({
  planDistrictUniq: unique('uq_rate_plan_district').on(table.planId, table.district),
  planIdx: index('idx_rate_plan_districts_plan').on(table.planId),
}));

export type RatePlan = typeof ratePlans.$inferSelect;
export type NewRatePlan = typeof ratePlans.$inferInsert;
export type RatePlanDistrict = typeof ratePlanDistricts.$inferSelect;
export type NewRatePlanDistrict = typeof ratePlanDistricts.$inferInsert;
