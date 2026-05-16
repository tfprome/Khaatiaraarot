import { Router } from 'express';
import { getBanners } from '../controllers/banner.controller';

const router = Router();

/**
 * @swagger
 * /banners:
 *   get:
 *     tags: [Banners]
 *     summary: Get active banners (optionally filtered by type)
 *     security: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [hero, side, promo] }
 *         description: Filter by banner type
 *     responses:
 *       200:
 *         description: List of active banners
 */
router.get('/', getBanners);

export default router;
