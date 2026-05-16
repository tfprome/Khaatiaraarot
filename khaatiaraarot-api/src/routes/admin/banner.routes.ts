import { Router } from 'express';
import {
  listBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  uploadBannerImage,
} from '../../controllers/admin/banner.controller';
import { handleUpload } from '../../middleware/upload.middleware';
import { uploadLimiter } from '../../middleware/rateLimiter.middleware';

const router = Router();

/**
 * @swagger
 * /admin/banners:
 *   get:
 *     tags: [Admin - Banners]
 *     summary: List all banners (including inactive)
 *     responses:
 *       200:
 *         description: Array of banners
 */
router.get('/', listBanners);

/**
 * @swagger
 * /admin/banners:
 *   post:
 *     tags: [Admin - Banners]
 *     summary: Create new banner
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type]
 *             properties:
 *               type: { type: string, enum: [hero, side, promo] }
 *               title: { type: string }
 *               subtitle: { type: string }
 *               tagText: { type: string }
 *               ctaLabel: { type: string }
 *               ctaHref: { type: string }
 *               sortOrder: { type: integer, default: 0 }
 *               isActive: { type: boolean, default: true }
 *               startsAt: { type: string, format: date-time }
 *               endsAt: { type: string, format: date-time }
 *     responses:
 *       201:
 *         description: Banner created
 */
router.post('/', createBanner);

/**
 * @swagger
 * /admin/banners/{id}:
 *   put:
 *     tags: [Admin - Banners]
 *     summary: Update banner
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               isActive: { type: boolean }
 *               startsAt: { type: string, format: date-time }
 *               endsAt: { type: string, format: date-time }
 *     responses:
 *       200:
 *         description: Banner updated
 *   delete:
 *     tags: [Admin - Banners]
 *     summary: Delete banner permanently
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Banner deleted
 */
router.put('/:id', updateBanner);
router.delete('/:id', deleteBanner);

/**
 * @swagger
 * /admin/banners/{id}/image:
 *   post:
 *     tags: [Admin - Banners]
 *     summary: Upload banner image
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [image]
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded
 */
router.post('/:id/image', uploadLimiter, handleUpload('image'), uploadBannerImage);

export default router;
