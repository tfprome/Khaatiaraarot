import { pgTable, uuid, text, boolean, timestamp, integer } from 'drizzle-orm/pg-core';

export const banners = pgTable('banners', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: text('type', { enum: ['hero', 'side', 'promo'] }).notNull(),
  title: text('title'),
  subtitle: text('subtitle'),
  tagText: text('tag_text'),
  ctaLabel: text('cta_label'),
  ctaHref: text('cta_href'),
  imageUrl: text('image_url'),
  publicId: text('public_id'),
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  startsAt: timestamp('starts_at', { withTimezone: true }),
  endsAt: timestamp('ends_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export type Banner = typeof banners.$inferSelect;
export type NewBanner = typeof banners.$inferInsert;
