import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { validateCouponHandler } from '../controllers/coupon.controller';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /coupons/validate:
 *   post:
 *     tags: [Coupons]
 *     summary: Validate a coupon code against an order amount
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code, orderAmount]
 *             properties:
 *               code:
 *                 type: string
 *               orderAmount:
 *                 type: number
 *                 description: Cart subtotal in BDT
 *     responses:
 *       200:
 *         description: Coupon is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     coupon:
 *                       type: object
 *                       properties:
 *                         id: { type: string, format: uuid }
 *                         code: { type: string }
 *                         type: { type: string, enum: [percentage, fixed] }
 *                         value: { type: number }
 *                     discountAmount: { type: number }
 *       400:
 *         description: Coupon invalid, expired, usage limit reached, or order amount below minimum
 *       401:
 *         description: Unauthorized
 */
router.post('/validate', validateCouponHandler);

export default router;
