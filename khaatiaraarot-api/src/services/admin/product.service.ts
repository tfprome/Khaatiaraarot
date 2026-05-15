import { and, asc, count, desc, eq, ilike, inArray, or, sql } from 'drizzle-orm';
import { db } from '../../config/db';
import { categories, productImages, products } from '../../db/schema';
import { invalidateCache, invalidateCachePattern } from '../cache.service';
import { AppError } from '../../utils/errors';
import type {
  createProductSchema,
  updateProductSchema,
  listAdminProductsQuerySchema,
} from '../../schemas/admin.schema';
import type { z } from 'zod';

type CreateProductInput = z.infer<typeof createProductSchema>;
type UpdateProductInput = z.infer<typeof updateProductSchema>;
type ListQuery = z.infer<typeof listAdminProductsQuerySchema>;

async function invalidateAll(productId?: string) {
  const ops = [
    invalidateCachePattern('cache:products:list:*'),
    invalidateCache('cache:products:top-sellers'),
    invalidateCache('cache:categories:all'),
  ];
  if (productId) ops.push(invalidateCache(`cache:products:id:${productId}`));
  await Promise.all(ops);
}

export async function listProducts(query: ListQuery) {
  const { page, limit, q, categoryId, isActive } = query;
  const offset = (page - 1) * limit;

  const conditions = [];
  if (q) {
    const search = or(ilike(products.name, `%${q}%`), ilike(products.description, `%${q}%`));
    if (search) conditions.push(search);
  }
  if (categoryId !== undefined) conditions.push(eq(products.categoryId, categoryId));
  if (isActive !== undefined) conditions.push(eq(products.isActive, isActive));

  const where = conditions.length ? and(...conditions) : undefined;

  const [countResult, rows] = await Promise.all([
    db.select({ total: count() }).from(products).where(where),
    db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        unit: products.unit,
        price: products.price,
        originalPrice: products.originalPrice,
        stockQty: products.stockQty,
        lowStockThreshold: products.lowStockThreshold,
        isBestSelling: products.isBestSelling,
        isActive: products.isActive,
        categoryId: products.categoryId,
        createdAt: products.createdAt,
      })
      .from(products)
      .where(where)
      .orderBy(desc(products.createdAt))
      .limit(limit)
      .offset(offset),
  ]);

  const total = Number(countResult[0]?.total ?? 0);
  const ids = rows.map((r) => r.id);

  const images =
    ids.length > 0
      ? await db
          .select()
          .from(productImages)
          .where(and(inArray(productImages.productId, ids), eq(productImages.isPrimary, true)))
      : [];
  const imageMap = new Map(images.map((i) => [i.productId, i.url]));

  return {
    data: rows.map((p) => ({ ...p, image: imageMap.get(p.id) ?? null })),
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}

export async function createProduct(input: CreateProductInput) {
  const existing = await db.query.products.findFirst({
    where: eq(products.slug, input.slug),
    columns: { id: true },
  });
  if (existing) throw new AppError(409, 'SLUG_TAKEN', 'A product with this slug already exists');

  const [product] = await db
    .insert(products)
    .values({
      ...input,
      price: String(input.price),
      originalPrice: input.originalPrice ? String(input.originalPrice) : null,
    })
    .returning();

  await invalidateAll();
  return product;
}

export async function updateProduct(id: string, input: UpdateProductInput) {
  const product = await db.query.products.findFirst({ where: eq(products.id, id) });
  if (!product) throw new AppError(404, 'PRODUCT_NOT_FOUND', 'Product not found');

  if (input.slug && input.slug !== product.slug) {
    const clash = await db.query.products.findFirst({
      where: eq(products.slug, input.slug),
      columns: { id: true },
    });
    if (clash) throw new AppError(409, 'SLUG_TAKEN', 'A product with this slug already exists');
  }

  const values: Record<string, unknown> = { ...input, updatedAt: new Date() };
  if (input.price !== undefined) values.price = String(input.price);
  if (input.originalPrice !== undefined)
    values.originalPrice = input.originalPrice ? String(input.originalPrice) : null;

  const [updated] = await db
    .update(products)
    .set(values)
    .where(eq(products.id, id))
    .returning();

  await invalidateAll(id);
  return updated;
}

export async function deleteProduct(id: string) {
  const product = await db.query.products.findFirst({ where: eq(products.id, id) });
  if (!product) throw new AppError(404, 'PRODUCT_NOT_FOUND', 'Product not found');

  await db
    .update(products)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(products.id, id));

  await invalidateAll(id);
}

export async function adjustStock(id: string, stockQty: number) {
  const product = await db.query.products.findFirst({ where: eq(products.id, id) });
  if (!product) throw new AppError(404, 'PRODUCT_NOT_FOUND', 'Product not found');

  const [updated] = await db
    .update(products)
    .set({ stockQty, updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning({ id: products.id, stockQty: products.stockQty });

  await invalidateAll(id);
  return updated;
}
