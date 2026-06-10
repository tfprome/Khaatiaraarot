import { and, count, desc, eq, gte, inArray, sql } from 'drizzle-orm';
import { db } from '../config/db';
import { redis } from '../config/redis';
import {
  addresses,
  cartItems,
  carts,
  orderItems,
  orderNumberCounter,
  orders,
  orderStatusHistory,
  productImages,
  products,
} from '../db/schema';
import { AppError } from '../utils/errors';
import { stockAlertQueue } from '../queues';
import { getDeliveryFee } from './admin/ratePlan.service';
import type { PlaceOrderInput } from '../schemas/order.schema';

const IDEMPOTENCY_TTL = 86400; // 24 hours

async function checkIdempotency(userId: string, key: string) {
  const existing = await redis.get(`idempotency:${userId}:${key}`);
  if (existing) return existing; // orderId already created
  return null;
}

async function storeIdempotency(userId: string, key: string, orderId: string) {
  await redis.set(`idempotency:${userId}:${key}`, orderId, 'EX', IDEMPOTENCY_TTL);
}

async function resolveAddressSnapshot(
  userId: string,
  input: PlaceOrderInput,
): Promise<Record<string, unknown>> {
  if (input.addressId) {
    const addr = await db.query.addresses.findFirst({
      where: and(eq(addresses.id, input.addressId), eq(addresses.userId, userId)),
    });
    if (!addr) throw new AppError(404, 'ADDRESS_NOT_FOUND', 'Address not found');
    return {
      fullName: addr.fullName,
      phone: addr.phone,
      line1: addr.line1,
      line2: addr.line2,
      city: addr.city,
      district: addr.district,
      postalCode: addr.postalCode,
    };
  }
  return input.address as Record<string, unknown>;
}

async function getCartWithItems(userId: string) {
  const cart = await db.query.carts.findFirst({ where: eq(carts.userId, userId) });
  if (!cart) return { cart: null, items: [] };

  const items = await db
    .select({
      cartItemId: cartItems.id,
      productId: products.id,
      quantity: cartItems.quantity,
      name: products.name,
      unit: products.unit,
      price: products.price,
      sourceRegion: products.sourceRegion,
      stockQty: products.stockQty,
      isActive: products.isActive,
      ratePlanId: products.ratePlanId,
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.cartId, cart.id));

  return { cart, items };
}

export async function placeOrder(
  userId: string,
  input: PlaceOrderInput,
  idempotencyKey?: string,
) {
  // Idempotency check
  if (idempotencyKey) {
    const existingId = await checkIdempotency(userId, idempotencyKey);
    if (existingId) {
      const existing = await db.query.orders.findFirst({
        where: eq(orders.id, existingId),
        with: { items: true },
      });
      if (existing) return existing;
    }
  }

  // Pre-transaction validation
  const { cart, items } = await getCartWithItems(userId);
  if (!cart || items.length === 0) {
    throw new AppError(400, 'EMPTY_CART', 'Cart is empty');
  }

  const inactive = items.filter((i) => !i.isActive);
  if (inactive.length > 0) {
    throw new AppError(
      400,
      'PRODUCT_UNAVAILABLE',
      `Product "${inactive[0].name}" is no longer available`,
    );
  }

  const outOfStock = items.filter((i) => i.stockQty < i.quantity);
  if (outOfStock.length > 0) {
    throw new AppError(
      400,
      'INSUFFICIENT_STOCK',
      `Insufficient stock for "${outOfStock[0].name}"`,
    );
  }

  const addressSnapshot = await resolveAddressSnapshot(userId, input);
  const district = addressSnapshot.district as string;

  const subtotal = items.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0,
  );

  const deliveryFees = await Promise.all(
    items.map((item) =>
      item.ratePlanId
        ? getDeliveryFee(item.ratePlanId, district, item.quantity)
        : Promise.resolve(0),
    ),
  );
  const deliveryFee = deliveryFees.reduce((sum, fee) => sum + fee, 0);

  const order = await db.transaction(async (tx) => {
    // Atomic order number
    const year = new Date().getFullYear();
    const result = await tx.execute<{ last_seq: number }>(sql`
      INSERT INTO order_number_counter (year, last_seq)
      VALUES (${year}, 1)
      ON CONFLICT (year) DO UPDATE
      SET last_seq = order_number_counter.last_seq + 1
      RETURNING last_seq
    `);
    const seq = result.rows[0].last_seq;
    const orderNumber = `KA-${year}-${String(seq).padStart(5, '0')}`;

    // Insert order
    const [newOrder] = await tx
      .insert(orders)
      .values({
        userId,
        orderNumber,
        paymentMethod: input.paymentMethod,
        subtotal: subtotal.toFixed(2),
        deliveryFee: deliveryFee.toFixed(2),
        discount: '0',
        total: (subtotal + deliveryFee).toFixed(2),
        source: 'web',
        shippingAddressSnapshot: addressSnapshot,
        notes: input.notes,
      })
      .returning();

    // Insert order items with product snapshot
    await tx.insert(orderItems).values(
      items.map((item) => ({
        orderId: newOrder.id,
        productId: item.productId,
        productSnapshot: {
          name: item.name,
          unit: item.unit,
          price: item.price,
          sourceRegion: item.sourceRegion,
        },
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: (parseFloat(item.price) * item.quantity).toFixed(2),
      })),
    );

    // Deduct stock with optimistic locking
    for (const item of items) {
      const [updated] = await tx
        .update(products)
        .set({ stockQty: sql`${products.stockQty} - ${item.quantity}` })
        .where(and(eq(products.id, item.productId), gte(products.stockQty, item.quantity)))
        .returning({ id: products.id });

      if (!updated) {
        throw new AppError(
          409,
          'STOCK_CONFLICT',
          `"${item.name}" ran out of stock during checkout`,
        );
      }
    }

    // Initial status history (append-only — never UPDATE orders.status alone)
    await tx.insert(orderStatusHistory).values({
      orderId: newOrder.id,
      status: 'pending',
      note: 'Order placed',
      changedBy: userId,
    });

    // Clear cart inside transaction for atomicity
    await tx.delete(cartItems).where(eq(cartItems.cartId, cart.id));

    return newOrder;
  });

  if (idempotencyKey) {
    await storeIdempotency(userId, idempotencyKey, order.id);
  }

  // Dispatch low-stock alerts for products that dropped below threshold
  const updatedStocks = await db
    .select({ id: products.id, name: products.name, stockQty: products.stockQty, lowStockThreshold: products.lowStockThreshold })
    .from(products)
    .where(inArray(products.id, items.map((i) => i.productId)));

  for (const p of updatedStocks) {
    if (p.stockQty <= p.lowStockThreshold) {
      await stockAlertQueue.add(`stock-alert:${p.id}`, {
        productId: p.id,
        productName: p.name,
        stockQty: p.stockQty,
        threshold: p.lowStockThreshold,
      });
    }
  }

  return getOrderById(order.id, userId);
}

export async function getOrderById(orderId: string, userId: string) {
  const order = await db.query.orders.findFirst({
    where: and(eq(orders.id, orderId), eq(orders.userId, userId)),
    with: {
      items: true,
      statusHistory: { orderBy: [desc(orderStatusHistory.createdAt)] },
    },
  });
  if (!order) throw new AppError(404, 'ORDER_NOT_FOUND', 'Order not found');
  return order;
}

export async function listOrders(userId: string, page: number, limit: number) {
  const offset = (page - 1) * limit;

  const [countResult, rows] = await Promise.all([
    db.select({ total: count() }).from(orders).where(eq(orders.userId, userId)),
    db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt))
      .limit(limit)
      .offset(offset),
  ]);

  const total = Number(countResult[0]?.total ?? 0);
  return {
    data: rows,
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}
