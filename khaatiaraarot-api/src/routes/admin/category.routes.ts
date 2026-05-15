import { Router } from 'express';
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
} from '../../controllers/admin/category.controller';
import { handleUpload } from '../../middleware/upload.middleware';

const router = Router();

router.get('/', listCategories);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);
router.post('/:id/image', handleUpload('image'), uploadCategoryImage);

export default router;
