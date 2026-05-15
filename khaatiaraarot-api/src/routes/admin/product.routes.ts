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

const router = Router();

router.get('/', listProducts);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.put('/:id/stock', adjustStock);

router.post('/:id/images', handleUpload('image'), uploadProductImage);
router.delete('/:id/images/:imageId', deleteProductImage);
router.patch('/:id/images/:imageId/primary', setProductImagePrimary);

export default router;
