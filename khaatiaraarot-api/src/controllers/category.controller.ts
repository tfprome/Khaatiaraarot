import { Request, Response, NextFunction } from 'express';
import * as productService from '../services/product.service';

export async function getCategories(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await productService.listCategories();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getCategoryBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await productService.getCategoryBySlug(req.params.slug);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
