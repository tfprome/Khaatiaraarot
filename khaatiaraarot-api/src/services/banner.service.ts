import { and, asc, eq, or, isNull, lte, gte, sql } from 'drizzle-orm';
import { db } from '../config/db';
import { banners } from '../db/schema';
import { getCache, setCache } from './cache.service';

const TTL = 1800;

export async function listActiveBanners(type?: 'hero' | 'side' | 'promo') {
  const cacheKey = `cache:banners:active:${type ?? 'all'}`;
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const now = new Date();

  const conditions = [
    eq(banners.isActive, true),
    or(isNull(banners.startsAt), lte(banners.startsAt, now)),
    or(isNull(banners.endsAt), gte(banners.endsAt, now)),
  ];

  if (type) conditions.push(eq(banners.type, type));

  const rows = await db
    .select()
    .from(banners)
    .where(and(...conditions))
    .orderBy(asc(banners.sortOrder));

  await setCache(cacheKey, rows, TTL);
  return rows;
}
