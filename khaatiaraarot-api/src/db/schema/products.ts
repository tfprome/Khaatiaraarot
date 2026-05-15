import { pgTable, uuid, text, boolean, timestamp, integer, numeric, index } from 'drizzle-orm/pg-core';
import { categories } from './categories';

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  unit: text('unit').notNull(),
  sourceRegion: text('source_region'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  originalPrice: numeric('original_price', { precision: 10, scale: 2 }),
  stockQty: integer('stock_qty').notNull().default(0),
  lowStockThreshold: integer('low_stock_threshold').notNull().default(5),
  isBestSelling: boolean('is_best_selling').notNull().default(false),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  categoryIdx: index('idx_products_category').on(table.categoryId),
  slugIdx: index('idx_products_slug').on(table.slug),
  bestSellingIdx: index('idx_products_best_selling').on(table.isBestSelling),
  stockIdx: index('idx_products_stock').on(table.stockQty),
}));

export const productImages = pgTable('product_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  publicId: text('public_id').notNull(),
  isPrimary: boolean('is_primary').notNull().default(false),
  sortOrder: integer('sort_order').notNull().default(0),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type ProductImage = typeof productImages.$inferSelect;
export type NewProductImage = typeof productImages.$inferInsert;
