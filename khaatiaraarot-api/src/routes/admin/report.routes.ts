import { Router } from 'express';
import {
  getDashboard,
  getSalesReport,
  getRevenueSummary,
  getTopProducts,
  getTopCategories,
} from '../../controllers/admin/report.controller';

const router = Router();

router.get('/dashboard', getDashboard);
router.get('/sales', getSalesReport);
router.get('/revenue', getRevenueSummary);
router.get('/top-products', getTopProducts);
router.get('/top-categories', getTopCategories);

export default router;
