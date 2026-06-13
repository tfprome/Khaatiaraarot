import { Router } from 'express';
import * as couponController from '../../controllers/admin/coupon.controller';

const router = Router();

router.get('/', couponController.listCoupons);
router.get('/:id', couponController.getCoupon);
router.post('/', couponController.createCoupon);
router.put('/:id', couponController.updateCoupon);
router.delete('/:id', couponController.deleteCoupon);

export default router;
