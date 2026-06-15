import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getWishlist, addItem, removeItem } from '../controllers/wishlist.controller';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /wishlist:
 *   get:
 *     tags: [Wishlist]
 *     summary: Get authenticated user's wishlist
 *     responses:
 *       200:
 *         description: Wishlist items with product details
 */
router.get('/', getWishlist);

/**
 * @swagger
 * /wishlist/items:
 *   post:
 *     tags: [Wishlist]
 *     summary: Add product to wishlist
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId]
 *             properties:
 *               productId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Item added (idempotent — safe to call even if already present)
 *       404:
 *         description: Product not found
 */
router.post('/items', addItem);

/**
 * @swagger
 * /wishlist/items/{productId}:
 *   delete:
 *     tags: [Wishlist]
 *     summary: Remove product from wishlist
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Item removed
 */
router.delete('/items/:productId', removeItem);

export default router;
