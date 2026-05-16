import { redis } from '../config/redis';

export async function getCache<T>(key: string): Promise<T | null> {
  const val = await redis.get(key);
  if (!val) return null;
  return JSON.parse(val) as T;
}

export async function setCache(key: string, data: unknown, ttlSeconds: number): Promise<void> {
  await redis.set(key, JSON.stringify(data), 'EX', ttlSeconds);
}

export async function invalidateCache(...keys: string[]): Promise<void> {
  if (keys.length > 0) await redis.del(...keys);
}

export async function invalidateCachePattern(pattern: string): Promise<void> {
  let cursor = '0';
  const keysToDelete: string[] = [];
  do {
    const [nextCursor, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
    cursor = nextCursor;
    keysToDelete.push(...keys);
  } while (cursor !== '0');

  if (keysToDelete.length > 0) await redis.del(...keysToDelete);
}
