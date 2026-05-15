import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types';
import * as adminOrderService from '../../services/admin/order.service';
import {
  listAdminOrdersQuerySchema,
  updateOrderStatusSchema,
  createManualOrderSchema,
  listInventoryQuerySchema,
} from '../../schemas/admin.schema';

export async function listOrders(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const query = listAdminOrdersQuerySchema.parse(req.query);
    const result = await adminOrderService.listOrders(query);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

export async function getOrderById(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = await adminOrderService.getOrderById(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function updateOrderStatus(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const input = updateOrderStatusSchema.parse(req.body);
    const data = await adminOrderService.updateOrderStatus(req.params.id, input, req.user!.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function createManualOrder(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const input = createManualOrderSchema.parse(req.body);
    const data = await adminOrderService.createManualOrder(req.user!.id, input);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function triggerInvoice(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = await adminOrderService.triggerInvoice(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getInventory(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const query = listInventoryQuerySchema.parse(req.query);
    const result = await adminOrderService.getInventory(query);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}
