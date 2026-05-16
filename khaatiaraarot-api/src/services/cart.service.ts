import { and, eq, inArray } from 'drizzle-orm';
import { db } from '../config/db';
import { cartItems, carts, productImages, products } from '../db/schema';
import { AppError } from '../utils/errors';

async function getOrCreateCart(userId?: string, sessionId?: string) {
  if (userId) {
    const existing = await db.query.carts.findFirst({ where: eq(carts.userId, userId) });
    if (existing) return existing;
    const [cart] = await db.insert(carts).values({ userId }).returning();
    return cart;
  }
  if (sessionId) {
    const existing = await db.query.carts.findFirst({ where: eq(carts.sessionId, sessionId) });
    if (existing) return existing;
    const [cart] = await db.insert(carts).values({ sessionId }).returning();
    return cart;
  }
  throw new AppError(500, 'CART_IDENTITY_MISSING', 'Cannot identify cart');
}

async function fetchCartItems(cartId: string) {
  return db
    .select({
      id: cartItems.id,
      quantity: cartItems.quantity,
      productId: products.id,
      name: products.name,
      slug: products.slug,
      unit: products.unit,
      price: products.price,
      originalPrice: products.originalPrice,
      stockQty: products.stockQty,
      image: productImages.url,
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .leftJoin(
      productImages,
      and(eq(productImages.productId, products.id), eq(productImages.isPrimary, true)),
    )
    .where(eq(cartItems.cartId, cartId));
}

function formatItems(rows: Awaited<ReturnType<typeof fetchCartItems>>) {
  return rows.map((row) => ({
    id: row.id,
    quantity: row.quantity,
    product: {
      id: row.productId,
      name: row.name,
      slug: row.slug,
      unit: row.unit,
      price: parseFloat(row.price),
      originalPrice: row.originalPrice ? parseFloat(row.originalPrice) : null,
      stockQty: row.stockQty,
      image: row.image ?? null,
    },
  }));
}

function computeSummary(items: ReturnType<typeof formatItems>) {
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = parseFloat(
    items.reduce((s, i) => s + i.product.price * i.quantity, 0).toFixed(2),
  );
  return { itemCount, subtotal };
}

export async function getCart(userId?: string, sessionId?: string) {
  const cart = await getOrCreateCart(userId, sessionId);
  const rows = await fetchCartItems(cart.id);
  const items = formatItems(rows);
  return { id: cart.id, items, ...computeSummary(items) };
}

export async function addItem(
  userId: string | undefined,
  sessionId: string | undefined,
  productId: string,
  quantity: number,
) {
  const product = await db.query.products.findFirst({
    where: and(eq(products.id, productId), eq(products.isActive, true)),
    columns: { id: true, stockQty: true },
  });
  if (!product) throw new AppError(404, 'PRODUCT_NOT_FOUND', 'Product not found');

  const cart = await getOrCreateCart(userId, sessionId);

  const existing = await db.query.cartItems.findFirst({
    where: and(eq(cartItems.cartId, cart.id), eq(cartItems.productId, productId)),
  });

  const newQty = (existing?.quantity ?? 0) + quantity;
  if (newQty > product.stockQty) {
    throw new AppError(400, 'INSUFFICIENT_STOCK', `Only ${product.stockQty} units available`);
  }

  if (existing) {
    await db
      .update(cartItems)
      .set({ quantity: newQty })
      .where(eq(cartItems.id, existing.id));
  } else {
    await db.insert(cartItems).values({ cartId: cart.id, productId, quantity });
  }

  return getCart(userId, sessionId);
}

export async function updateItem(
  userId: string | undefined,
  sessionId: string | undefined,
  productId: string,
  quantity: number,
) {
  if (quantity <= 0) return removeItem(userId, sessionId, productId);

  const product = await db.query.products.findFirst({
    where: eq(products.id, productId),
    columns: { stockQty: true },
  });
  if (!product) throw new AppError(404, 'PRODUCT_NOT_FOUND', 'Product not found');
  if (quantity > product.stockQty) {
    throw new AppError(400, 'INSUFFICIENT_STOCK', `Only ${product.stockQty} units available`);
  }

  const cart = await getOrCreateCart(userId, sessionId);

  const existing = await db.query.cartItems.findFirst({
    where: and(eq(cartItems.cartId, cart.id), eq(cartItems.productId, productId)),
  });
  if (!existing) throw new AppError(404, 'CART_ITEM_NOT_FOUND', 'Item not in cart');

  await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, existing.id));

  return getCart(userId, sessionId);
}

export async function removeItem(
  userId: string | undefined,
  sessionId: string | undefined,
  productId: string,
) {
  const cart = await getOrCreateCart(userId, sessionId);
  await db
    .delete(cartItems)
    .where(and(eq(cartItems.cartId, cart.id), eq(cartItems.productId, productId)));
  return getCart(userId, sessionId);
}

export async function clearCart(userId?: string, sessionId?: string) {
  const cart = await getOrCreateCart(userId, sessionId);
  await db.delete(cartItems).where(eq(cartItems.cartId, cart.id));
  return { id: cart.id, items: [], itemCount: 0, subtotal: 0 };
}

export async function mergeGuestCart(sessionId: string, userId: string) {
  const guestCart = await db.query.carts.findFirst({
    where: eq(carts.sessionId, sessionId),
    with: { items: true },
  });

  if (!guestCart || guestCart.items.length === 0) {
    if (guestCart) await db.delete(carts).where(eq(carts.id, guestCart.id));
    return;
  }

  const userCart = await getOrCreateCart(userId);

  const userItems = await db
    .select()
    .from(cartItems)
    .where(eq(cartItems.cartId, userCart.id));
  const userItemMap = new Map(userItems.map((i) => [i.productId, i]));

  const productIds = guestCart.items.map((i) => i.productId);
  const productStocks = await db
    .select({ id: products.id, stockQty: products.stockQty })
    .from(products)
    .where(inArray(products.id, productIds));
  const stockMap = new Map(productStocks.map((p) => [p.id, p.stockQty]));

  for (const guestItem of guestCart.items) {
    const userItem = userItemMap.get(guestItem.productId);
    const stock = stockMap.get(guestItem.productId) ?? 0;

    if (userItem) {
      const merged = Math.min(userItem.quantity + guestItem.quantity, stock);
      await db
        .update(cartItems)
        .set({ quantity: merged })
        .where(eq(cartItems.id, userItem.id));
    } else {
      const qty = Math.min(guestItem.quantity, stock);
      if (qty > 0) {
        await db.insert(cartItems).values({
          cartId: userCart.id,
          productId: guestItem.productId,
          quantity: qty,
        });
      }
    }
  }

  await db.delete(carts).where(eq(carts.id, guestCart.id));
}
