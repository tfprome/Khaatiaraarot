import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import * as wishlistService from '../services/wishlist.service';
import { AppError } from '../utils/errors';

export async function getWishlist(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = await wishlistService.getWishlist(req.user!.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function addItem(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { productId } = req.body;
    if (!productId || typeof productId !== 'string') {
      throw new AppError(400, 'MISSING_PRODUCT_ID', 'productId is required');
    }
    const data = await wishlistService.addItem(req.user!.id, productId);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function removeItem(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { productId } = req.params;
    const data = await wishlistService.removeItem(req.user!.id, productId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
