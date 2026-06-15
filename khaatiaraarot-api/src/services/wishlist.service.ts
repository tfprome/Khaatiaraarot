import { and, eq } from 'drizzle-orm';
import { db } from '../config/db';
import { wishlists, products, productImages } from '../db/schema';
import { AppError } from '../utils/errors';

export async function getWishlist(userId: string) {
  const rows = await db
    .select({
      id: wishlists.id,
      productId: products.id,
      name: products.name,
      slug: products.slug,
      unit: products.unit,
      price: products.price,
      originalPrice: products.originalPrice,
      stockQty: products.stockQty,
      sourceRegion: products.sourceRegion,
      image: productImages.url,
      createdAt: wishlists.createdAt,
    })
    .from(wishlists)
    .innerJoin(products, and(eq(wishlists.productId, products.id), eq(products.isActive, true)))
    .leftJoin(
      productImages,
      and(eq(productImages.productId, products.id), eq(productImages.isPrimary, true)),
    )
    .where(eq(wishlists.userId, userId));

  return rows.map((r) => ({
    id: r.id,
    createdAt: r.createdAt,
    product: {
      id: r.productId,
      name: r.name,
      slug: r.slug,
      unit: r.unit,
      price: parseFloat(r.price),
      originalPrice: r.originalPrice ? parseFloat(r.originalPrice) : null,
      stockQty: r.stockQty,
      sourceRegion: r.sourceRegion,
      image: r.image ?? null,
    },
  }));
}

export async function addItem(userId: string, productId: string) {
  const product = await db.query.products.findFirst({
    where: and(eq(products.id, productId), eq(products.isActive, true)),
    columns: { id: true },
  });
  if (!product) throw new AppError(404, 'PRODUCT_NOT_FOUND', 'Product not found');

  const existing = await db.query.wishlists.findFirst({
    where: and(eq(wishlists.userId, userId), eq(wishlists.productId, productId)),
  });
  if (existing) return getWishlist(userId);

  await db.insert(wishlists).values({ userId, productId });
  return getWishlist(userId);
}

export async function removeItem(userId: string, productId: string) {
  await db
    .delete(wishlists)
    .where(and(eq(wishlists.userId, userId), eq(wishlists.productId, productId)));
  return getWishlist(userId);
}
