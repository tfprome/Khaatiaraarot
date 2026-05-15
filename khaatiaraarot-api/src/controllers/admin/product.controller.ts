import { Response, NextFunction } from 'express';
import { and, eq } from 'drizzle-orm';
import { db } from '../../config/db';
import { productImages, products } from '../../db/schema';
import * as imageService from '../../services/image.service';
import { invalidateCache, invalidateCachePattern } from '../../services/cache.service';
import { AppError } from '../../utils/errors';
import { AuthRequest } from '../../types';

async function invalidateProductCache(productId: string) {
  await Promise.all([
    invalidateCache(`cache:products:id:${productId}`),
    invalidateCache('cache:products:top-sellers'),
    invalidateCachePattern('cache:products:list:*'),
  ]);
}

export async function uploadProductImage(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.file) throw new AppError(400, 'NO_FILE', 'No file provided');

    const { id } = req.params;

    const product = await db.query.products.findFirst({
      where: eq(products.id, id),
      columns: { id: true },
    });
    if (!product) throw new AppError(404, 'PRODUCT_NOT_FOUND', 'Product not found');

    const { url, publicId } = await imageService.uploadImage(
      req.file.buffer,
      'khaatiaraarot/products',
    );

    const existing = await db
      .select({ id: productImages.id })
      .from(productImages)
      .where(eq(productImages.productId, id))
      .limit(1);

    const isPrimary = existing.length === 0;

    const [image] = await db
      .insert(productImages)
      .values({ productId: id, url, publicId, isPrimary })
      .returning();

    await invalidateProductCache(id);

    res.status(201).json({ success: true, data: image });
  } catch (err) {
    next(err);
  }
}

export async function deleteProductImage(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id, imageId } = req.params;

    const image = await db.query.productImages.findFirst({
      where: and(eq(productImages.id, imageId), eq(productImages.productId, id)),
    });
    if (!image) throw new AppError(404, 'IMAGE_NOT_FOUND', 'Image not found');

    await imageService.deleteImage(image.publicId);
    await db.delete(productImages).where(eq(productImages.id, imageId));

    if (image.isPrimary) {
      const [nextImage] = await db
        .select({ id: productImages.id })
        .from(productImages)
        .where(eq(productImages.productId, id))
        .limit(1);

      if (nextImage) {
        await db
          .update(productImages)
          .set({ isPrimary: true })
          .where(eq(productImages.id, nextImage.id));
      }
    }

    await invalidateProductCache(id);

    res.status(200).json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
}

export async function setProductImagePrimary(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id, imageId } = req.params;

    const image = await db.query.productImages.findFirst({
      where: and(eq(productImages.id, imageId), eq(productImages.productId, id)),
    });
    if (!image) throw new AppError(404, 'IMAGE_NOT_FOUND', 'Image not found');

    await db.transaction(async (tx) => {
      await tx
        .update(productImages)
        .set({ isPrimary: false })
        .where(eq(productImages.productId, id));
      await tx
        .update(productImages)
        .set({ isPrimary: true })
        .where(eq(productImages.id, imageId));
    });

    await invalidateProductCache(id);

    res.status(200).json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
}
