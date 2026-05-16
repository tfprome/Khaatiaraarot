import { Request, Response, NextFunction } from 'express';
import * as bannerService from '../services/banner.service';

export async function getBanners(req: Request, res: Response, next: NextFunction) {
  try {
    const type = req.query.type as 'hero' | 'side' | 'promo' | undefined;
    const data = await bannerService.listActiveBanners(type);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
