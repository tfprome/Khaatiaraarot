import { Router } from 'express';
import {
  listOrders,
  getOrderById,
  updateOrderStatus,
  createManualOrder,
  triggerInvoice,
} from '../../controllers/admin/order.controller';

const router = Router();

/**
 * @swagger
 * /admin/orders:
 *   get:
 *     tags: [Admin - Orders]
 *     summary: List all orders with filters
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [pending, confirmed, processing, shipped, delivered, cancelled, refunded] }
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         description: Search by order number or customer name
 *       - in: query
 *         name: from
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date-time }
 *     responses:
 *       200:
 *         description: Paginated order list
 */
router.get('/', listOrders);

/**
 * @swagger
 * /admin/orders:
 *   post:
 *     tags: [Admin - Orders]
 *     summary: Create manual order (phone/Facebook/admin)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [source, paymentMethod, address, items]
 *             properties:
 *               source:
 *                 type: string
 *                 enum: [facebook, phone, admin]
 *               paymentMethod:
 *                 type: string
 *                 enum: [cash, card, gcash, bkash, nagad, manual]
 *               notes:
 *                 type: string
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
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [productId, quantity]
 *                   properties:
 *                     productId: { type: string, format: uuid }
 *                     quantity: { type: integer, minimum: 1 }
 *     responses:
 *       201:
 *         description: Manual order created
 */
router.post('/', createManualOrder);

/**
 * @swagger
 * /admin/orders/{id}:
 *   get:
 *     tags: [Admin - Orders]
 *     summary: Get order details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Order with items, status history, and customer info
 *       404:
 *         description: Order not found
 */
router.get('/:id', getOrderById);

/**
 * @swagger
 * /admin/orders/{id}/status:
 *   put:
 *     tags: [Admin - Orders]
 *     summary: Update order status
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
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [confirmed, processing, shipped, delivered, cancelled, refunded]
 *               note:
 *                 type: string
 *                 maxLength: 500
 *     responses:
 *       200:
 *         description: Status updated
 *       400:
 *         description: Invalid transition from terminal status
 */
router.put('/:id/status', updateOrderStatus);

/**
 * @swagger
 * /admin/orders/{id}/invoice:
 *   post:
 *     tags: [Admin - Orders]
 *     summary: Manually trigger invoice generation and email
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Invoice job queued
 */
router.post('/:id/invoice', triggerInvoice);

export default router;
