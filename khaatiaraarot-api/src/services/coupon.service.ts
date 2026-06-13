import { and, eq, count } from 'drizzle-orm';
import { db } from '../config/db';
import { coupons, couponUsages } from '../db/schema';
import { AppError } from '../utils/errors';

export async function validateCoupon(code: string, userId: string, subtotal: number) {
  const coupon = await db.query.coupons.findFirst({
    where: eq(coupons.code, code.toUpperCase()),
  });

  if (!coupon || !coupon.isActive) {
    throw new AppError(404, 'COUPON_NOT_FOUND', 'Coupon not found or inactive');
  }

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    throw new AppError(400, 'COUPON_EXPIRED', 'Coupon has expired');
  }

  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
    throw new AppError(400, 'COUPON_EXHAUSTED', 'Coupon usage limit reached');
  }

  if (coupon.minOrderAmount && subtotal < parseFloat(coupon.minOrderAmount)) {
    throw new AppError(
      400,
      'COUPON_MIN_ORDER',
      `Minimum order amount is ৳${coupon.minOrderAmount}`,
    );
  }

  const [usageCount] = await db
    .select({ total: count() })
    .from(couponUsages)
    .where(and(eq(couponUsages.couponId, coupon.id), eq(couponUsages.userId, userId)));

  if (Number(usageCount.total) >= coupon.perUserLimit) {
    throw new AppError(400, 'COUPON_ALREADY_USED', 'You have already used this coupon');
  }

  let discountAmount: number;
  if (coupon.type === 'percentage') {
    discountAmount = (subtotal * parseFloat(coupon.value)) / 100;
    if (coupon.maxDiscount) {
      discountAmount = Math.min(discountAmount, parseFloat(coupon.maxDiscount));
    }
  } else {
    discountAmount = parseFloat(coupon.value);
  }

  discountAmount = Math.min(discountAmount, subtotal);

  return { coupon, discountAmount: parseFloat(discountAmount.toFixed(2)) };
}
