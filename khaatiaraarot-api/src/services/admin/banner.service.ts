import { eq } from 'drizzle-orm';
import { db } from '../../config/db';
import { banners } from '../../db/schema';
import { uploadImage, deleteImage } from '../image.service';
import { invalidateCachePattern } from '../cache.service';
import { AppError } from '../../utils/errors';
import type { createBannerSchema, updateBannerSchema } from '../../schemas/admin.schema';
import type { z } from 'zod';

type CreateInput = z.infer<typeof createBannerSchema>;
type UpdateInput = z.infer<typeof updateBannerSchema>;

async function invalidateAll() {
  await invalidateCachePattern('cache:banners:*');
}

export async function listBanners() {
  return db.select().from(banners).orderBy(banners.sortOrder);
}

export async function createBanner(input: CreateInput) {
  const [banner] = await db
    .insert(banners)
    .values({
      ...input,
      startsAt: input.startsAt ? new Date(input.startsAt) : null,
      endsAt: input.endsAt ? new Date(input.endsAt) : null,
    })
    .returning();
  await invalidateAll();
  return banner;
}

export async function updateBanner(id: string, input: UpdateInput) {
  const banner = await db.query.banners.findFirst({ where: eq(banners.id, id) });
  if (!banner) throw new AppError(404, 'BANNER_NOT_FOUND', 'Banner not found');

  const values: Record<string, unknown> = { ...input };
  if (input.startsAt) values.startsAt = new Date(input.startsAt);
  if (input.endsAt) values.endsAt = new Date(input.endsAt);

  const [updated] = await db
    .update(banners)
    .set(values)
    .where(eq(banners.id, id))
    .returning();

  await invalidateAll();
  return updated;
}

export async function deleteBanner(id: string) {
  const banner = await db.query.banners.findFirst({ where: eq(banners.id, id) });
  if (!banner) throw new AppError(404, 'BANNER_NOT_FOUND', 'Banner not found');

  if (banner.publicId) {
    await deleteImage(banner.publicId).catch(() => {});
  }

  await db.delete(banners).where(eq(banners.id, id));
  await invalidateAll();
}

export async function uploadBannerImage(id: string, buffer: Buffer) {
  const banner = await db.query.banners.findFirst({ where: eq(banners.id, id) });
  if (!banner) throw new AppError(404, 'BANNER_NOT_FOUND', 'Banner not found');

  if (banner.publicId) {
    await deleteImage(banner.publicId).catch(() => {});
  }

  const { url, publicId } = await uploadImage(buffer, 'khaatiaraarot/banners');

  const [updated] = await db
    .update(banners)
    .set({ imageUrl: url, publicId })
    .where(eq(banners.id, id))
    .returning();

  await invalidateAll();
  return updated;
}
