import { Router } from 'express';
import {
  listBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  uploadBannerImage,
} from '../../controllers/admin/banner.controller';
import { handleUpload } from '../../middleware/upload.middleware';

const router = Router();

router.get('/', listBanners);
router.post('/', createBanner);
router.put('/:id', updateBanner);
router.delete('/:id', deleteBanner);
router.post('/:id/image', handleUpload('image'), uploadBannerImage);

export default router;
