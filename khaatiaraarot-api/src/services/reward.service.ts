import { eq, sql, desc } from 'drizzle-orm';
import { db } from '../config/db';
import { userPoints, pointTransactions } from '../db/schema';

const POINTS_PER_TAKA = 1 / 100; // 1 point per 100 taka

export async function awardOrderPoints(userId: string, orderId: string, orderTotal: number) {
  const points = Math.floor(orderTotal * POINTS_PER_TAKA);
  if (points <= 0) return;

  await db.transaction(async (tx) => {
    await tx
      .insert(userPoints)
      .values({ userId, balance: points, lifetimeEarned: points })
      .onConflictDoUpdate({
        target: userPoints.userId,
        set: {
          balance: sql`${userPoints.balance} + ${points}`,
          lifetimeEarned: sql`${userPoints.lifetimeEarned} + ${points}`,
          updatedAt: new Date(),
        },
      });

    await tx.insert(pointTransactions).values({
      userId,
      orderId,
      type: 'earn',
      points,
      description: `Earned ${points} point${points !== 1 ? 's' : ''} for order completion`,
    });
  });
}

export async function getUserPoints(userId: string) {
  const [points, transactions] = await Promise.all([
    db.query.userPoints.findFirst({ where: eq(userPoints.userId, userId) }),
    db.query.pointTransactions.findMany({
      where: eq(pointTransactions.userId, userId),
      orderBy: [desc(pointTransactions.createdAt)],
      limit: 20,
    }),
  ]);

  return {
    balance: points?.balance ?? 0,
    lifetimeEarned: points?.lifetimeEarned ?? 0,
    transactions,
  };
}
