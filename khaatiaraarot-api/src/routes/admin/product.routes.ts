import { Router } from 'express';
import {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  adjustStock,
  uploadProductImage,
  deleteProductImage,
  setProductImagePrimary,
} from '../../controllers/admin/product.controller';
import { handleUpload } from '../../middleware/upload.middleware';
import { uploadLimiter } from '../../middleware/rateLimiter.middleware';

const router = Router();

/**
 * @swagger
 * /admin/products:
 *   get:
 *     tags: [Admin - Products]
 *     summary: List all products (including inactive)
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
 *       - in: query
 *         name: categoryId
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: isActive
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: Paginated product list
 */
router.get('/', listProducts);

/**
 * @swagger
 * /admin/products:
 *   post:
 *     tags: [Admin - Products]
 *     summary: Create new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, slug, unit, price]
 *             properties:
 *               name: { type: string, minLength: 2 }
 *               slug: { type: string, pattern: '^[a-z0-9-]+$' }
 *               description: { type: string }
 *               unit: { type: string }
 *               sourceRegion: { type: string }
 *               categoryId: { type: string, format: uuid }
 *               price: { type: number, minimum: 0 }
 *               originalPrice: { type: number }
 *               stockQty: { type: integer, minimum: 0, default: 0 }
 *               lowStockThreshold: { type: integer, minimum: 0, default: 5 }
 *               isBestSelling: { type: boolean, default: false }
 *               isActive: { type: boolean, default: true }
 *     responses:
 *       201:
 *         description: Product created
 *       400:
 *         description: Validation error or slug conflict
 */
router.post('/', createProduct);

/**
 * @swagger
 * /admin/products/{id}:
 *   put:
 *     tags: [Admin - Products]
 *     summary: Update product (partial update supported)
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
 *               slug: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *               isActive: { type: boolean }
 *     responses:
 *       200:
 *         description: Product updated
 *       404:
 *         description: Product not found
 *   delete:
 *     tags: [Admin - Products]
 *     summary: Soft-delete product (sets isActive=false)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Product deactivated
 */
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

/**
 * @swagger
 * /admin/products/{id}/stock:
 *   put:
 *     tags: [Admin - Products]
 *     summary: Set stock quantity directly
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
 *             required: [stockQty]
 *             properties:
 *               stockQty: { type: integer, minimum: 0 }
 *     responses:
 *       200:
 *         description: Stock updated
 */
router.put('/:id/stock', adjustStock);

/**
 * @swagger
 * /admin/products/{id}/images:
 *   post:
 *     tags: [Admin - Products]
 *     summary: Upload product image to Cloudinary
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
 *       201:
 *         description: Image uploaded and saved
 */
router.post('/:id/images', uploadLimiter, handleUpload('image'), uploadProductImage);

/**
 * @swagger
 * /admin/products/{id}/images/{imageId}:
 *   delete:
 *     tags: [Admin - Products]
 *     summary: Delete product image
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Image deleted from Cloudinary and DB
 */
router.delete('/:id/images/:imageId', deleteProductImage);

/**
 * @swagger
 * /admin/products/{id}/images/{imageId}/primary:
 *   patch:
 *     tags: [Admin - Products]
 *     summary: Set image as primary
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Primary image updated
 */
router.patch('/:id/images/:imageId/primary', setProductImagePrimary);

export default router;
