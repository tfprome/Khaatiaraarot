import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { createOrder, getOrders, getOrderById, cancelOrder } from '../controllers/order.controller';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /orders:
 *   post:
 *     tags: [Orders]
 *     summary: Place order from current cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [paymentMethod, address]
 *             properties:
 *               paymentMethod:
 *                 type: string
 *                 enum: [cash, card, gcash, bkash, nagad, manual]
 *               notes:
 *                 type: string
 *                 maxLength: 500
 *               address:
 *                 type: object
 *                 required: [fullName, phone, line1, city, district]
 *                 properties:
 *                   fullName: { type: string }
 *                   phone: { type: string }
 *                   line1: { type: string }
 *                   line2: { type: string }
 *                   city: { type: string }
 *                   district: { type: string }
 *                   postalCode: { type: string }
 *     parameters:
 *       - in: header
 *         name: Idempotency-Key
 *         schema: { type: string }
 *         description: Unique key to prevent duplicate orders on retry
 *     responses:
 *       201:
 *         description: Order created
 *       400:
 *         description: Cart empty or stock issue
 *       409:
 *         description: Duplicate idempotency key
 */
router.post('/', createOrder);

/**
 * @swagger
 * /orders:
 *   get:
 *     tags: [Orders]
 *     summary: List authenticated user's orders
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Paginated order list
 */
router.get('/', getOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Get order details by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Order with items and status history
 *       404:
 *         description: Order not found
 */
router.get('/:id', getOrderById);

/**
 * @swagger
 * /orders/{id}/cancel:
 *   patch:
 *     tags: [Orders]
 *     summary: Cancel an order (only when status is pending or confirmed)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Order cancelled
 *       400:
 *         description: Order cannot be cancelled at current status
 *       404:
 *         description: Order not found
 */
router.patch('/:id/cancel', cancelOrder);

export default router;
