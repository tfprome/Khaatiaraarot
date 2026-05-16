import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types';
import * as bannerService from '../../services/admin/banner.service';
import { createBannerSchema, updateBannerSchema } from '../../schemas/admin.schema';
import { AppError } from '../../utils/errors';

export async function listBanners(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = await bannerService.listBanners();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function createBanner(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const input = createBannerSchema.parse(req.body);
    const data = await bannerService.createBanner(input);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function updateBanner(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const input = updateBannerSchema.parse(req.body);
    const data = await bannerService.updateBanner(req.params.id, input);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function deleteBanner(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await bannerService.deleteBanner(req.params.id);
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
}

export async function uploadBannerImage(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.file) throw new AppError(400, 'NO_FILE', 'No file provided');
    const data = await bannerService.uploadBannerImage(req.params.id, req.file.buffer);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
