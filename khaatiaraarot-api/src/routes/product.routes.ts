import { Router } from 'express';
import { getProducts, getProductById, getTopSellers } from '../controllers/product.controller';

const router = Router();

/**
 * @swagger
 * /products:
 *   get:
 *     tags: [Products]
 *     summary: List products with pagination and filters
 *     security: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         description: Search by name, description, or region
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *         description: Filter by category slug
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [newest, price_asc, price_desc, name_asc], default: newest }
 *     responses:
 *       200:
 *         description: Paginated product list
 */
router.get('/', getProducts);

/**
 * @swagger
 * /products/top-sellers:
 *   get:
 *     tags: [Products]
 *     summary: Get top-selling products
 *     security: []
 *     responses:
 *       200:
 *         description: List of best-selling products
 */
router.get('/top-sellers', getTopSellers);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Get single product by ID
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Product details with images and category
 *       404:
 *         description: Product not found
 */
router.get('/:id', getProductById);

export default router;
