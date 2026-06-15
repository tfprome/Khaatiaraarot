import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getMyPoints } from '../controllers/reward.controller';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /rewards:
 *   get:
 *     tags: [Rewards]
 *     summary: Get loyalty points balance and recent transactions
 *     responses:
 *       200:
 *         description: Points balance and transaction history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     balance: { type: integer }
 *                     lifetimeEarned: { type: integer }
 *                     transactions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id: { type: string, format: uuid }
 *                           type: { type: string, enum: [earn, redeem] }
 *                           points: { type: integer }
 *                           description: { type: string }
 *                           createdAt: { type: string, format: date-time }
 *       401:
 *         description: Unauthorized
 */
router.get('/', getMyPoints);

export default router;
