import { Router } from 'express';
import {
  getDashboard,
  getSalesReport,
  getRevenueSummary,
  getTopProducts,
  getTopCategories,
} from '../../controllers/admin/report.controller';

const router = Router();

/**
 * @swagger
 * /admin/reports/dashboard:
 *   get:
 *     tags: [Admin - Reports]
 *     summary: Get dashboard overview (revenue, orders, low stock)
 *     responses:
 *       200:
 *         description: Dashboard stats including today/month/year/all-time revenue and orders, low stock count, status distribution, recent orders
 */
router.get('/dashboard', getDashboard);

/**
 * @swagger
 * /admin/reports/sales:
 *   get:
 *     tags: [Admin - Reports]
 *     summary: Get sales report grouped by day or month
 *     parameters:
 *       - in: query
 *         name: from
 *         schema: { type: string, format: date-time }
 *         description: Start date (defaults to 30 days ago)
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date-time }
 *         description: End date (defaults to now)
 *       - in: query
 *         name: group
 *         schema: { type: string, enum: [day, month], default: day }
 *     responses:
 *       200:
 *         description: Time-series sales data with summary totals
 */
router.get('/sales', getSalesReport);

/**
 * @swagger
 * /admin/reports/revenue:
 *   get:
 *     tags: [Admin - Reports]
 *     summary: Revenue breakdown by payment method and order source
 *     parameters:
 *       - in: query
 *         name: from
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date-time }
 *     responses:
 *       200:
 *         description: Revenue summary with breakdowns
 */
router.get('/revenue', getRevenueSummary);

/**
 * @swagger
 * /admin/reports/top-products:
 *   get:
 *     tags: [Admin - Reports]
 *     summary: Get top products by revenue
 *     parameters:
 *       - in: query
 *         name: from
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 50, default: 10 }
 *     responses:
 *       200:
 *         description: Top products ranked by revenue
 */
router.get('/top-products', getTopProducts);

/**
 * @swagger
 * /admin/reports/top-categories:
 *   get:
 *     tags: [Admin - Reports]
 *     summary: Get top categories by revenue
 *     parameters:
 *       - in: query
 *         name: from
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date-time }
 *     responses:
 *       200:
 *         description: Top categories ranked by revenue
 */
router.get('/top-categories', getTopCategories);

export default router;
