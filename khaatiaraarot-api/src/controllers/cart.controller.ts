import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import * as cartService from '../services/cart.service';
import { AppError } from '../utils/errors';

function identity(req: AuthRequest) {
  return { userId: req.user?.id, sessionId: req.sessionId };
}

export async function getCart(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { userId, sessionId } = identity(req);
    const data = await cartService.getCart(userId, sessionId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function addItem(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { userId, sessionId } = identity(req);
    const { productId, quantity = 1 } = req.body;
    if (!productId) throw new AppError(400, 'MISSING_PRODUCT_ID', 'productId is required');
    if (typeof quantity !== 'number' || quantity < 1) {
      throw new AppError(400, 'INVALID_QUANTITY', 'quantity must be a positive integer');
    }
    const data = await cartService.addItem(userId, sessionId, productId, quantity);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function updateItem(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { userId, sessionId } = identity(req);
    const { productId } = req.params;
    const { quantity } = req.body;
    if (typeof quantity !== 'number') {
      throw new AppError(400, 'INVALID_QUANTITY', 'quantity must be a number');
    }
    const data = await cartService.updateItem(userId, sessionId, productId, quantity);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function removeItem(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { userId, sessionId } = identity(req);
    const data = await cartService.removeItem(userId, sessionId, req.params.productId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function clearCart(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { userId, sessionId } = identity(req);
    const data = await cartService.clearCart(userId, sessionId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
