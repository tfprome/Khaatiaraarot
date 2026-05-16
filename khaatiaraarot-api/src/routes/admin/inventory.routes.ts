import { Router } from 'express';
import { getInventory } from '../../controllers/admin/order.controller';

const router = Router();

/**
 * @swagger
 * /admin/inventory:
 *   get:
 *     tags: [Admin - Inventory]
 *     summary: Get inventory with stock levels
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 50 }
 *       - in: query
 *         name: lowStockOnly
 *         schema: { type: boolean, default: false }
 *         description: Filter to only products at or below low stock threshold
 *     responses:
 *       200:
 *         description: Paginated inventory list sorted by stock level ascending
 */
router.get('/', getInventory);

export default router;
