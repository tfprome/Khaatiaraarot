import { eq } from 'drizzle-orm';
import { db } from '../../config/db';
import { categories } from '../../db/schema';
import { uploadImage, deleteImage } from '../image.service';
import { invalidateCache, invalidateCachePattern } from '../cache.service';
import { AppError } from '../../utils/errors';
import type { createCategorySchema, updateCategorySchema } from '../../schemas/admin.schema';
import type { z } from 'zod';

type CreateInput = z.infer<typeof createCategorySchema>;
type UpdateInput = z.infer<typeof updateCategorySchema>;

async function invalidateAll(slug?: string) {
  await Promise.all([
    invalidateCache('cache:categories:all'),
    invalidateCachePattern('cache:products:list:*'),
    slug ? invalidateCache(`cache:categories:slug:${slug}`) : Promise.resolve(),
  ]);
}

export async function listCategories() {
  return db.select().from(categories).orderBy(categories.sortOrder);
}

export async function createCategory(input: CreateInput) {
  const existing = await db.query.categories.findFirst({
    where: eq(categories.slug, input.slug),
  });
  if (existing) throw new AppError(409, 'SLUG_TAKEN', 'A category with this slug already exists');

  const [category] = await db.insert(categories).values(input).returning();
  await invalidateAll();
  return category;
}

export async function updateCategory(id: string, input: UpdateInput) {
  const category = await db.query.categories.findFirst({ where: eq(categories.id, id) });
  if (!category) throw new AppError(404, 'CATEGORY_NOT_FOUND', 'Category not found');

  if (input.slug && input.slug !== category.slug) {
    const clash = await db.query.categories.findFirst({ where: eq(categories.slug, input.slug) });
    if (clash) throw new AppError(409, 'SLUG_TAKEN', 'A category with this slug already exists');
  }

  const [updated] = await db
    .update(categories)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(categories.id, id))
    .returning();

  await invalidateAll(category.slug);
  return updated;
}

export async function deleteCategory(id: string) {
  const category = await db.query.categories.findFirst({ where: eq(categories.id, id) });
  if (!category) throw new AppError(404, 'CATEGORY_NOT_FOUND', 'Category not found');

  await db
    .update(categories)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(categories.id, id));

  await invalidateAll(category.slug);
}

export async function uploadCategoryImage(id: string, buffer: Buffer) {
  const category = await db.query.categories.findFirst({ where: eq(categories.id, id) });
  if (!category) throw new AppError(404, 'CATEGORY_NOT_FOUND', 'Category not found');

  if (category.imageUrl && (category as { publicId?: string }).publicId) {
    await deleteImage((category as unknown as { publicId: string }).publicId).catch(() => {});
  }

  // imageUrl stored separately — upload then update both url and a publicId via jsonb workaround
  // Since categories table only has imageUrl (not publicId), store publicId in imageUrl metadata
  // We'll use a simple approach: just store the URL (Cloudinary URL contains publicId info)
  const { url } = await uploadImage(buffer, 'khaatiaraarot/categories');

  const [updated] = await db
    .update(categories)
    .set({ imageUrl: url, updatedAt: new Date() })
    .where(eq(categories.id, id))
    .returning();

  await invalidateAll(category.slug);
  return updated;
}
