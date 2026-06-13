import { relations } from 'drizzle-orm';
import { users, addresses } from './users';
import { categories } from './categories';
import { products, productImages } from './products';
import { carts, cartItems, wishlists } from './carts';
import { orders, orderItems, orderStatusHistory } from './orders';
import { invoices } from './invoices';
import { userPoints, pointTransactions } from './rewards';
import { coupons, couponUsages } from './coupons';

export const usersRelations = relations(users, ({ one, many }) => ({
  addresses: many(addresses),
  orders: many(orders),
  carts: many(carts),
  wishlists: many(wishlists),
  points: one(userPoints, { fields: [users.id], references: [userPoints.userId] }),
  pointTransactions: many(pointTransactions),
  couponUsages: many(couponUsages),
}));

export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, { fields: [addresses.userId], references: [users.id] }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
  images: many(productImages),
  orderItems: many(orderItems),
  cartItems: many(cartItems),
  wishlists: many(wishlists),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, { fields: [productImages.productId], references: [products.id] }),
}));

export const cartsRelations = relations(carts, ({ one, many }) => ({
  user: one(users, { fields: [carts.userId], references: [users.id] }),
  items: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, { fields: [cartItems.cartId], references: [carts.id] }),
  product: one(products, { fields: [cartItems.productId], references: [products.id] }),
}));

export const wishlistsRelations = relations(wishlists, ({ one }) => ({
  user: one(users, { fields: [wishlists.userId], references: [users.id] }),
  product: one(products, { fields: [wishlists.productId], references: [products.id] }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  items: many(orderItems),
  statusHistory: many(orderStatusHistory),
  invoice: one(invoices, { fields: [orders.id], references: [invoices.orderId] }),
  couponUsage: one(couponUsages, { fields: [orders.id], references: [couponUsages.orderId] }),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, { fields: [orderItems.productId], references: [products.id] }),
}));

export const orderStatusHistoryRelations = relations(orderStatusHistory, ({ one }) => ({
  order: one(orders, { fields: [orderStatusHistory.orderId], references: [orders.id] }),
  changedByUser: one(users, { fields: [orderStatusHistory.changedBy], references: [users.id] }),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
  order: one(orders, { fields: [invoices.orderId], references: [orders.id] }),
}));

export const userPointsRelations = relations(userPoints, ({ one }) => ({
  user: one(users, { fields: [userPoints.userId], references: [users.id] }),
}));

export const pointTransactionsRelations = relations(pointTransactions, ({ one }) => ({
  user: one(users, { fields: [pointTransactions.userId], references: [users.id] }),
  order: one(orders, { fields: [pointTransactions.orderId], references: [orders.id] }),
}));

export const couponsRelations = relations(coupons, ({ many }) => ({
  usages: many(couponUsages),
}));

export const couponUsagesRelations = relations(couponUsages, ({ one }) => ({
  coupon: one(coupons, { fields: [couponUsages.couponId], references: [coupons.id] }),
  user: one(users, { fields: [couponUsages.userId], references: [users.id] }),
  order: one(orders, { fields: [couponUsages.orderId], references: [orders.id] }),
}));
