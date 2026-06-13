import { eq } from 'drizzle-orm';
import { db } from '../../config/db';
import { ratePlans, ratePlanDistricts } from '../../db/schema';
import { AppError } from '../../utils/errors';
import type { z } from 'zod';
import type { createRatePlanSchema, updateRatePlanSchema } from '../../schemas/admin.schema';

type CreateInput = z.infer<typeof createRatePlanSchema>;
type UpdateInput = z.infer<typeof updateRatePlanSchema>;

export async function listRatePlans() {
  const plans = await db.select().from(ratePlans).orderBy(ratePlans.createdAt);
  const allRates = await db.select().from(ratePlanDistricts);
  const rateMap = new Map<string, typeof allRates>();
  for (const r of allRates) {
    const arr = rateMap.get(r.planId) ?? [];
    arr.push(r);
    rateMap.set(r.planId, arr);
  }
  return plans.map((p) => ({ ...p, rates: rateMap.get(p.id) ?? [] }));
}

export async function getRatePlan(id: string) {
  const plan = await db.query.ratePlans.findFirst({ where: eq(ratePlans.id, id) });
  if (!plan) throw new AppError(404, 'RATE_PLAN_NOT_FOUND', 'Rate plan not found');
  const rates = await db.select().from(ratePlanDistricts).where(eq(ratePlanDistricts.planId, id));
  return { ...plan, rates };
}

export async function createRatePlan(input: CreateInput) {
  return db.transaction(async (tx) => {
    const [plan] = await tx
      .insert(ratePlans)
      .values({ name: input.name, description: input.description, isActive: input.isActive })
      .returning();

    const rateRows = input.rates.map((r) => ({
      planId: plan.id,
      district: r.district,
      costPerUnit: String(r.costPerUnit),
    }));
    const rates = await tx.insert(ratePlanDistricts).values(rateRows).returning();
    return { ...plan, rates };
  });
}

export async function updateRatePlan(id: string, input: UpdateInput) {
  const plan = await db.query.ratePlans.findFirst({ where: eq(ratePlans.id, id) });
  if (!plan) throw new AppError(404, 'RATE_PLAN_NOT_FOUND', 'Rate plan not found');

  return db.transaction(async (tx) => {
    const planUpdates: Record<string, unknown> = { updatedAt: new Date() };
    if (input.name !== undefined) planUpdates.name = input.name;
    if (input.description !== undefined) planUpdates.description = input.description;
    if (input.isActive !== undefined) planUpdates.isActive = input.isActive;

    const [updated] = await tx.update(ratePlans).set(planUpdates).where(eq(ratePlans.id, id)).returning();

    let rates;
    if (input.rates) {
      await tx.delete(ratePlanDistricts).where(eq(ratePlanDistricts.planId, id));
      const rateRows = input.rates.map((r) => ({
        planId: id,
        district: r.district,
        costPerUnit: String(r.costPerUnit),
      }));
      rates = await tx.insert(ratePlanDistricts).values(rateRows).returning();
    } else {
      rates = await tx.select().from(ratePlanDistricts).where(eq(ratePlanDistricts.planId, id));
    }

    return { ...updated, rates };
  });
}

export async function deleteRatePlan(id: string) {
  const plan = await db.query.ratePlans.findFirst({ where: eq(ratePlans.id, id) });
  if (!plan) throw new AppError(404, 'RATE_PLAN_NOT_FOUND', 'Rate plan not found');
  await db.delete(ratePlans).where(eq(ratePlans.id, id));
}

export async function getDeliveryFee(ratePlanId: string, district: string, quantity: number): Promise<number> {
  const rate = await db.query.ratePlanDistricts.findFirst({
    where: (t, { and, eq }) => and(eq(t.planId, ratePlanId), eq(t.district, district)),
  });
  if (!rate) return 0;
  return Number(rate.costPerUnit) * quantity;
}
