import { eq, sql } from 'drizzle-orm';
import { db } from '../../config/db';
import { coupons } from '../../db/schema';
import { AppError } from '../../utils/errors';
import type { z } from 'zod';
import type { createCouponSchema, updateCouponSchema } from '../../schemas/admin.schema';

type CreateCouponInput = z.infer<typeof createCouponSchema>;
type UpdateCouponInput = z.infer<typeof updateCouponSchema>;

export async function listCoupons() {
  return db.query.coupons.findMany({
    orderBy: (c, { desc }) => [desc(c.createdAt)],
  });
}

export async function getCoupon(id: string) {
  const coupon = await db.query.coupons.findFirst({ where: eq(coupons.id, id) });
  if (!coupon) throw new AppError(404, 'COUPON_NOT_FOUND', 'Coupon not found');
  return coupon;
}

export async function createCoupon(input: CreateCouponInput) {
  const code = input.code.toUpperCase();
  const existing = await db.query.coupons.findFirst({ where: eq(coupons.code, code) });
  if (existing) throw new AppError(409, 'COUPON_CODE_TAKEN', 'Coupon code already exists');

  const [coupon] = await db
    .insert(coupons)
    .values({
      code,
      type: input.type,
      value: String(input.value),
      minOrderAmount: input.minOrderAmount != null ? String(input.minOrderAmount) : null,
      maxDiscount: input.maxDiscount != null ? String(input.maxDiscount) : null,
      usageLimit: input.usageLimit ?? null,
      perUserLimit: input.perUserLimit ?? 1,
      isActive: input.isActive ?? true,
      expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
    })
    .returning();
  return coupon;
}

export async function updateCoupon(id: string, input: UpdateCouponInput) {
  await getCoupon(id);

  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (input.code != null) updates.code = input.code.toUpperCase();
  if (input.type != null) updates.type = input.type;
  if (input.value != null) updates.value = String(input.value);
  if ('minOrderAmount' in input) updates.minOrderAmount = input.minOrderAmount != null ? String(input.minOrderAmount) : null;
  if ('maxDiscount' in input) updates.maxDiscount = input.maxDiscount != null ? String(input.maxDiscount) : null;
  if ('usageLimit' in input) updates.usageLimit = input.usageLimit ?? null;
  if (input.perUserLimit != null) updates.perUserLimit = input.perUserLimit;
  if (input.isActive != null) updates.isActive = input.isActive;
  if ('expiresAt' in input) updates.expiresAt = input.expiresAt ? new Date(input.expiresAt) : null;

  const [updated] = await db.update(coupons).set(updates).where(eq(coupons.id, id)).returning();
  return updated;
}

export async function deleteCoupon(id: string) {
  await getCoupon(id);
  await db.delete(coupons).where(eq(coupons.id, id));
}
