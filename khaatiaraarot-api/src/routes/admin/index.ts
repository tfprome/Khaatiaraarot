import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role.middleware';
import productRoutes from './product.routes';
import categoryRoutes from './category.routes';
import bannerRoutes from './banner.routes';
import orderRoutes from './order.routes';
import inventoryRoutes from './inventory.routes';
import reportRoutes from './report.routes';
import ratePlanRoutes from './ratePlan.routes';

const router = Router();

router.use(authenticate, requireRole('admin'));

router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/banners', bannerRoutes);
router.use('/orders', orderRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/reports', reportRoutes);
router.use('/rate-plans', ratePlanRoutes);

export default router;
