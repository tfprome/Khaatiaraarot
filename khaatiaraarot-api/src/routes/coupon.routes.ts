import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { validateCouponHandler } from '../controllers/coupon.controller';

const router = Router();

router.use(authenticate);
router.post('/validate', validateCouponHandler);

export default router;
