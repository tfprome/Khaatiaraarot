import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import * as orderService from '../services/order.service';
import { placeOrderSchema, listOrdersQuerySchema } from '../schemas/order.schema';
import { AppError } from '../utils/errors';

export async function createOrder(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const input = placeOrderSchema.parse(req.body);
    const idempotencyKey = req.headers['idempotency-key'] as string | undefined;
    const order = await orderService.placeOrder(userId, input, idempotencyKey);
    res.status(201).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
}

export async function getOrders(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const { page, limit, status } = listOrdersQuerySchema.parse(req.query);
    const result = await orderService.listOrders(userId, page, limit, status);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

export async function cancelOrder(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const data = await orderService.cancelOrder(req.params.id, userId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getOrderById(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const data = await orderService.getOrderById(req.params.id, userId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
