import { Router } from 'express';
import { getCategories, getCategoryBySlug } from '../controllers/category.controller';

const router = Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     tags: [Categories]
 *     summary: List all active categories
 *     security: []
 *     responses:
 *       200:
 *         description: Array of categories
 */
router.get('/', getCategories);

/**
 * @swagger
 * /categories/{slug}:
 *   get:
 *     tags: [Categories]
 *     summary: Get category by slug
 *     security: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *         example: fresh-vegetables
 *     responses:
 *       200:
 *         description: Category details
 *       404:
 *         description: Category not found
 */
router.get('/:slug', getCategoryBySlug);

export default router;
