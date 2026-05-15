import { Router } from 'express';
import {
  uploadProductImage,
  deleteProductImage,
  setProductImagePrimary,
} from '../../controllers/admin/product.controller';
import { handleUpload } from '../../middleware/upload.middleware';

const router = Router();

router.post('/:id/images', handleUpload('image'), uploadProductImage);
router.delete('/:id/images/:imageId', deleteProductImage);
router.patch('/:id/images/:imageId/primary', setProductImagePrimary);

export default router;
