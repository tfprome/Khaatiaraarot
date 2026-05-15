import { and, asc, count, desc, eq, ilike, inArray, or, sql } from 'drizzle-orm';
import { db } from '../config/db';
import { categories, productImages, products } from '../db/schema';
import { AppError } from '../utils/errors';
import { getCache, setCache } from './cache.service';
import type { ListProductsQuery } from '../schemas/product.schema';

const TTL = { list: 300, single: 600, topSellers: 600, categories: 1800 };

function escapeLike(s: string): string {
  return s.replace(/[%_\\]/g, '\\$&');
}

function listCacheKey(params: ListProductsQuery): string {
  return `cache:products:list:${Buffer.from(JSON.stringify(params)).toString('base64')}`;
}

function transformProduct(p: {
  price: string;
  originalPrice: string | null;
  [key: string]: unknown;
}) {
  return {
    ...p,
    price: parseFloat(p.price),
    originalPrice: p.originalPrice ? parseFloat(p.originalPrice) : null,
  };
}

export async function listProducts(params: ListProductsQuery) {
  const cacheKey = listCacheKey(params);
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const { q, category: categorySlug, page, limit, sort } = params;
  const offset = (page - 1) * limit;

  const orderBy = {
    newest: desc(products.createdAt),
    price_asc: asc(sql`${products.price}::numeric`),
    price_desc: desc(sql`${products.price}::numeric`),
    name_asc: asc(products.name),
  }[sort];

  const whereConditions = [eq(products.isActive, true)];

  if (q) {
    const term = escapeLike(q);
    const search = or(
      ilike(products.name, `%${term}%`),
      ilike(products.description, `%${term}%`),
      ilike(products.sourceRegion, `%${term}%`),
    );
    if (search) whereConditions.push(search);
  }

  if (categorySlug) {
    whereConditions.push(eq(categories.slug, categorySlug));
  }

  const where = and(...whereConditions);

  const [countResult, rows] = await Promise.all([
    db
      .select({ total: count() })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(where),
    db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        unit: products.unit,
        sourceRegion: products.sourceRegion,
        price: products.price,
        originalPrice: products.originalPrice,
        stockQty: products.stockQty,
        isBestSelling: products.isBestSelling,
        categoryId: products.categoryId,
        createdAt: products.createdAt,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(where)
      .orderBy(orderBy)
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

  const imageMap = new Map(images.map((img) => [img.productId, img.url]));

  const data = rows.map((p) => ({
    ...transformProduct(p),
    image: imageMap.get(p.id) ?? null,
  }));

  const result = {
    data,
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  };

  await setCache(cacheKey, result, TTL.list);
  return result;
}

export async function getProductById(id: string) {
  const cacheKey = `cache:products:id:${id}`;
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const product = await db.query.products.findFirst({
    where: and(eq(products.id, id), eq(products.isActive, true)),
    with: {
      images: { orderBy: [asc(productImages.sortOrder)] },
      category: { columns: { id: true, name: true, nameBn: true, slug: true } },
    },
  });

  if (!product) throw new AppError(404, 'PRODUCT_NOT_FOUND', 'Product not found');

  const result = {
    ...transformProduct(product),
    images: product.images,
    category: product.category,
  };

  await setCache(cacheKey, result, TTL.single);
  return result;
}

export async function getTopSellers() {
  const cacheKey = 'cache:products:top-sellers';
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      unit: products.unit,
      sourceRegion: products.sourceRegion,
      price: products.price,
      originalPrice: products.originalPrice,
      stockQty: products.stockQty,
      isBestSelling: products.isBestSelling,
    })
    .from(products)
    .where(and(eq(products.isBestSelling, true), eq(products.isActive, true)))
    .orderBy(asc(products.name))
    .limit(20);

  const ids = rows.map((r) => r.id);
  const images =
    ids.length > 0
      ? await db
          .select()
          .from(productImages)
          .where(and(inArray(productImages.productId, ids), eq(productImages.isPrimary, true)))
      : [];

  const imageMap = new Map(images.map((img) => [img.productId, img.url]));

  const result = rows.map((p) => ({
    ...transformProduct(p),
    image: imageMap.get(p.id) ?? null,
  }));

  await setCache(cacheKey, result, TTL.topSellers);
  return result;
}

export async function listCategories() {
  const cacheKey = 'cache:categories:all';
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const rows = await db
    .select({
      id: categories.id,
      name: categories.name,
      nameBn: categories.nameBn,
      slug: categories.slug,
      imageUrl: categories.imageUrl,
      sortOrder: categories.sortOrder,
      productCount: sql<number>`count(${products.id})::int`,
    })
    .from(categories)
    .leftJoin(
      products,
      and(eq(products.categoryId, categories.id), eq(products.isActive, true)),
    )
    .where(eq(categories.isActive, true))
    .groupBy(categories.id)
    .orderBy(asc(categories.sortOrder));

  await setCache(cacheKey, rows, TTL.categories);
  return rows;
}

export async function getCategoryBySlug(slug: string) {
  const cacheKey = `cache:categories:slug:${slug}`;
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const category = await db.query.categories.findFirst({
    where: and(eq(categories.slug, slug), eq(categories.isActive, true)),
    columns: { id: true, name: true, nameBn: true, slug: true, imageUrl: true },
  });

  if (!category) throw new AppError(404, 'CATEGORY_NOT_FOUND', 'Category not found');

  await setCache(cacheKey, category, TTL.categories);
  return category;
}
