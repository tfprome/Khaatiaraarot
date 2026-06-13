import { Request, Response, NextFunction } from 'express';
import * as couponService from '../../services/admin/coupon.service';
import { createCouponSchema, updateCouponSchema } from '../../schemas/admin.schema';

export async function listCoupons(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await couponService.listCoupons();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getCoupon(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await couponService.getCoupon(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function createCoupon(req: Request, res: Response, next: NextFunction) {
  try {
    const input = createCouponSchema.parse(req.body);
    const data = await couponService.createCoupon(input);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function updateCoupon(req: Request, res: Response, next: NextFunction) {
  try {
    const input = updateCouponSchema.parse(req.body);
    const data = await couponService.updateCoupon(req.params.id, input);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function deleteCoupon(req: Request, res: Response, next: NextFunction) {
  try {
    await couponService.deleteCoupon(req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
