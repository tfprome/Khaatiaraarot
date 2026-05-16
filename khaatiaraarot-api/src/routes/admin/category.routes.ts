import { Router } from 'express';
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
} from '../../controllers/admin/category.controller';
import { handleUpload } from '../../middleware/upload.middleware';
import { uploadLimiter } from '../../middleware/rateLimiter.middleware';

const router = Router();

/**
 * @swagger
 * /admin/categories:
 *   get:
 *     tags: [Admin - Categories]
 *     summary: List all categories (including inactive)
 *     responses:
 *       200:
 *         description: Array of categories
 */
router.get('/', listCategories);

/**
 * @swagger
 * /admin/categories:
 *   post:
 *     tags: [Admin - Categories]
 *     summary: Create new category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, slug]
 *             properties:
 *               name: { type: string, minLength: 2 }
 *               nameBn: { type: string, description: Bengali name }
 *               slug: { type: string, pattern: '^[a-z0-9-]+$' }
 *               sortOrder: { type: integer, default: 0 }
 *               isActive: { type: boolean, default: true }
 *     responses:
 *       201:
 *         description: Category created
 */
router.post('/', createCategory);

/**
 * @swagger
 * /admin/categories/{id}:
 *   put:
 *     tags: [Admin - Categories]
 *     summary: Update category
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
 *             properties:
 *               name: { type: string }
 *               nameBn: { type: string }
 *               slug: { type: string }
 *               sortOrder: { type: integer }
 *               isActive: { type: boolean }
 *     responses:
 *       200:
 *         description: Category updated
 *   delete:
 *     tags: [Admin - Categories]
 *     summary: Soft-delete category (sets isActive=false)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Category deactivated
 */
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

/**
 * @swagger
 * /admin/categories/{id}/image:
 *   post:
 *     tags: [Admin - Categories]
 *     summary: Upload category image
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [image]
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded
 */
router.post('/:id/image', uploadLimiter, handleUpload('image'), uploadCategoryImage);

export default router;
