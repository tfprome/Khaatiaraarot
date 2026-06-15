import { Router } from 'express';
import * as couponController from '../../controllers/admin/coupon.controller';

const router = Router();

/**
 * @swagger
 * /admin/coupons:
 *   get:
 *     tags: [Admin - Coupons]
 *     summary: List all coupons
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: isActive
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: Paginated coupon list
 */
router.get('/', couponController.listCoupons);

/**
 * @swagger
 * /admin/coupons/{id}:
 *   get:
 *     tags: [Admin - Coupons]
 *     summary: Get coupon by ID with usage stats
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Coupon detail
 *       404:
 *         description: Not found
 */
router.get('/:id', couponController.getCoupon);

/**
 * @swagger
 * /admin/coupons:
 *   post:
 *     tags: [Admin - Coupons]
 *     summary: Create a coupon
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code, type, value]
 *             properties:
 *               code: { type: string }
 *               type: { type: string, enum: [percentage, fixed] }
 *               value: { type: number }
 *               minOrderAmount: { type: number }
 *               maxDiscount: { type: number }
 *               usageLimit: { type: integer }
 *               perUserLimit: { type: integer, default: 1 }
 *               isActive: { type: boolean, default: true }
 *               expiresAt: { type: string, format: date-time }
 *     responses:
 *       201:
 *         description: Coupon created
 *       409:
 *         description: Code already exists
 */
router.post('/', couponController.createCoupon);

/**
 * @swagger
 * /admin/coupons/{id}:
 *   put:
 *     tags: [Admin - Coupons]
 *     summary: Update coupon (partial)
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
 *               code: { type: string }
 *               type: { type: string, enum: [percentage, fixed] }
 *               value: { type: number }
 *               minOrderAmount: { type: number }
 *               maxDiscount: { type: number }
 *               usageLimit: { type: integer }
 *               perUserLimit: { type: integer }
 *               isActive: { type: boolean }
 *               expiresAt: { type: string, format: date-time }
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not found
 */
router.put('/:id', couponController.updateCoupon);

/**
 * @swagger
 * /admin/coupons/{id}:
 *   delete:
 *     tags: [Admin - Coupons]
 *     summary: Delete coupon permanently
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Not found
 */
router.delete('/:id', couponController.deleteCoupon);

export default router;
