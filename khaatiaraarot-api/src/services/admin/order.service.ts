import { and, asc, count, desc, eq, gte, ilike, inArray, lte, or, sql } from 'drizzle-orm';
import { db } from '../../config/db';
import {
  orderItems,
  orderNumberCounter,
  orders,
  orderStatusHistory,
  products,
} from '../../db/schema';
import { invoiceQueue, emailQueue } from '../../queues';
import { invoices, users } from '../../db/schema';
import { AppError } from '../../utils/errors';
import type {
  createManualOrderSchema,
  listAdminOrdersQuerySchema,
  updateOrderStatusSchema,
} from '../../schemas/admin.schema';
import type { z } from 'zod';

type ListQuery = z.infer<typeof listAdminOrdersQuerySchema>;
type UpdateStatusInput = z.infer<typeof updateOrderStatusSchema>;
type CreateManualInput = z.infer<typeof createManualOrderSchema>;

export async function listOrders(query: ListQuery) {
  const { page, limit, status, q, from, to } = query;
  const offset = (page - 1) * limit;

  const conditions = [];
  if (status) conditions.push(eq(orders.status, status));
  if (q) {
    const search = or(ilike(orders.orderNumber, `%${q}%`), ilike(orders.notes, `%${q}%`));
    if (search) conditions.push(search);
  }
  if (from) conditions.push(gte(orders.createdAt, new Date(from)));
  if (to) conditions.push(lte(orders.createdAt, new Date(to)));

  const where = conditions.length ? and(...conditions) : undefined;

  const [countResult, rows] = await Promise.all([
    db.select({ total: count() }).from(orders).where(where),
    db
      .select()
      .from(orders)
      .where(where)
      .orderBy(desc(orders.createdAt))
      .limit(limit)
      .offset(offset),
  ]);

  const total = Number(countResult[0]?.total ?? 0);
  return { data: rows, meta: { page, limit, total, pages: Math.ceil(total / limit) } };
}

export async function getOrderById(id: string) {
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, id),
    with: {
      items: true,
      statusHistory: { orderBy: [desc(orderStatusHistory.createdAt)] },
      invoice: true,
      user: { columns: { id: true, email: true, fullName: true, phone: true } },
    },
  });
  if (!order) throw new AppError(404, 'ORDER_NOT_FOUND', 'Order not found');
  return order;
}

export async function updateOrderStatus(
  id: string,
  input: UpdateStatusInput,
  adminId: string,
) {
  const order = await db.query.orders.findFirst({ where: eq(orders.id, id) });
  if (!order) throw new AppError(404, 'ORDER_NOT_FOUND', 'Order not found');

  const terminal = ['cancelled', 'refunded'];
  if (terminal.includes(order.status)) {
    throw new AppError(
      400,
      'ORDER_TERMINAL',
      `Order is ${order.status} and cannot be updated`,
    );
  }

  await db.transaction(async (tx) => {
    await tx.update(orders).set({ status: input.status, updatedAt: new Date() }).where(eq(orders.id, id));
    await tx.insert(orderStatusHistory).values({
      orderId: id,
      status: input.status,
      note: input.note,
      changedBy: adminId,
    });
  });

  return getOrderById(id);
}

export async function createManualOrder(adminId: string, input: CreateManualInput) {
  const productIds = input.items.map((i) => i.productId);
  const productRows = await db
    .select()
    .from(products)
    .where(and(inArray(products.id, productIds), eq(products.isActive, true)));

  if (productRows.length !== productIds.length) {
    throw new AppError(400, 'PRODUCT_UNAVAILABLE', 'One or more products are unavailable');
  }

  const productMap = new Map(productRows.map((p) => [p.id, p]));
  const outOfStock = input.items.filter((i) => productMap.get(i.productId)!.stockQty < i.quantity);
  if (outOfStock.length > 0) {
    const name = productMap.get(outOfStock[0].productId)!.name;
    throw new AppError(400, 'INSUFFICIENT_STOCK', `Insufficient stock for "${name}"`);
  }

  const subtotal = input.items.reduce((sum, item) => {
    return sum + parseFloat(productMap.get(item.productId)!.price) * item.quantity;
  }, 0);

  const order = await db.transaction(async (tx) => {
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

    const [newOrder] = await tx
      .insert(orders)
      .values({
        orderNumber,
        paymentMethod: input.paymentMethod,
        subtotal: subtotal.toFixed(2),
        deliveryFee: '0',
        discount: '0',
        total: subtotal.toFixed(2),
        source: input.source,
        shippingAddressSnapshot: input.address as Record<string, unknown>,
        notes: input.notes,
      })
      .returning();

    await tx.insert(orderItems).values(
      input.items.map((item) => {
        const p = productMap.get(item.productId)!;
        return {
          orderId: newOrder.id,
          productId: item.productId,
          productSnapshot: { name: p.name, unit: p.unit, price: p.price, sourceRegion: p.sourceRegion },
          quantity: item.quantity,
          unitPrice: p.price,
          totalPrice: (parseFloat(p.price) * item.quantity).toFixed(2),
        };
      }),
    );

    for (const item of input.items) {
      const [updated] = await tx
        .update(products)
        .set({ stockQty: sql`${products.stockQty} - ${item.quantity}` })
        .where(and(eq(products.id, item.productId), gte(products.stockQty, item.quantity)))
        .returning({ id: products.id });
      if (!updated) {
        throw new AppError(409, 'STOCK_CONFLICT', 'Stock changed during order creation');
      }
    }

    await tx.insert(orderStatusHistory).values({
      orderId: newOrder.id,
      status: 'pending',
      note: `Manual order created via ${input.source}`,
      changedBy: adminId,
    });

    return newOrder;
  });

  await invoiceQueue.add('generate-invoice', { orderId: order.id });
  return getOrderById(order.id);
}

export async function triggerInvoice(orderId: string) {
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
    with: { invoice: true, user: { columns: { email: true } } },
  });
  if (!order) throw new AppError(404, 'ORDER_NOT_FOUND', 'Order not found');

  if (order.invoice && order.user?.email) {
    await emailQueue.add('resend-invoice', {
      to: order.user.email,
      orderNumber: order.orderNumber,
      invoiceNumber: order.invoice.number,
      pdfUrl: order.invoice.pdfUrl!,
    });
    return { queued: 'email' };
  }

  await invoiceQueue.add('generate-invoice', { orderId });
  return { queued: 'invoice' };
}

export async function getInventory(query: { page: number; limit: number; lowStockOnly: boolean }) {
  const { page, limit, lowStockOnly } = query;
  const offset = (page - 1) * limit;

  const where = lowStockOnly
    ? sql`${products.stockQty} <= ${products.lowStockThreshold}`
    : undefined;

  const [countResult, rows] = await Promise.all([
    db.select({ total: count() }).from(products).where(where),
    db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        unit: products.unit,
        stockQty: products.stockQty,
        lowStockThreshold: products.lowStockThreshold,
        isActive: products.isActive,
        categoryId: products.categoryId,
      })
      .from(products)
      .where(where)
      .orderBy(asc(products.stockQty))
      .limit(limit)
      .offset(offset),
  ]);

  const total = Number(countResult[0]?.total ?? 0);
  return {
    data: rows.map((p) => ({
      ...p,
      isLowStock: p.stockQty <= p.lowStockThreshold,
    })),
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}
