import { Router } from 'express';
import { authenticateOptional } from '../middleware/auth.middleware';
import { ensureSession } from '../middleware/session.middleware';
import { getCart, addItem, updateItem, removeItem, clearCart } from '../controllers/cart.controller';

const router = Router();

router.use(ensureSession, authenticateOptional);

/**
 * @swagger
 * /cart:
 *   get:
 *     tags: [Cart]
 *     summary: Get current cart (guest or authenticated)
 *     security: []
 *     responses:
 *       200:
 *         description: Cart items with product details
 */
router.get('/', getCart);

/**
 * @swagger
 * /cart/items:
 *   post:
 *     tags: [Cart]
 *     summary: Add item to cart
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId, quantity]
 *             properties:
 *               productId:
 *                 type: string
 *                 format: uuid
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Item added
 *       400:
 *         description: Insufficient stock or invalid product
 */
router.post('/items', addItem);

/**
 * @swagger
 * /cart/items/{productId}:
 *   patch:
 *     tags: [Cart]
 *     summary: Update item quantity in cart
 *     security: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [quantity]
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Quantity updated
 *   delete:
 *     tags: [Cart]
 *     summary: Remove item from cart
 *     security: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Item removed
 */
router.patch('/items/:productId', updateItem);
router.delete('/items/:productId', removeItem);

/**
 * @swagger
 * /cart:
 *   delete:
 *     tags: [Cart]
 *     summary: Clear entire cart
 *     security: []
 *     responses:
 *       200:
 *         description: Cart cleared
 */
router.delete('/', clearCart);

export default router;
