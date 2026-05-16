import { Request, Response, NextFunction } from 'express';
import * as productService from '../services/product.service';
import { listProductsQuerySchema } from '../schemas/product.schema';

export async function getProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const params = listProductsQuerySchema.parse(req.query);
    const result = await productService.listProducts(params);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

export async function getProductById(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await productService.getProductById(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getTopSellers(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await productService.getTopSellers();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
