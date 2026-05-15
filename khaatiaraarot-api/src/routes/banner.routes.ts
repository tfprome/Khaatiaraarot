import { Router } from 'express';
import { getBanners } from '../controllers/banner.controller';

const router = Router();

router.get('/', getBanners);

export default router;
