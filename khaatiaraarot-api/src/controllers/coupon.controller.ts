import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { validateCoupon } from '../services/coupon.service';
import { validateCouponSchema } from '../schemas/order.schema';

export async function validateCouponHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { code, subtotal } = validateCouponSchema.parse(req.body);
    const { coupon, discountAmount } = await validateCoupon(code, req.user!.id, subtotal);
    res.json({
      success: true,
      data: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discountAmount,
      },
    });
  } catch (err) {
    next(err);
  }
}
