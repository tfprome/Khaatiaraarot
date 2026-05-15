import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types';
import * as reportService from '../../services/admin/report.service';
import {
  salesReportQuerySchema,
  topProductsQuerySchema,
} from '../../schemas/admin.schema';

export async function getDashboard(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = await reportService.getDashboard();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getSalesReport(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const query = salesReportQuerySchema.parse(req.query);
    const data = await reportService.getSalesReport(query);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getRevenueSummary(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const query = topProductsQuerySchema.parse(req.query);
    const data = await reportService.getRevenueSummary(query);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getTopProducts(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const query = topProductsQuerySchema.parse(req.query);
    const data = await reportService.getTopProducts(query);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getTopCategories(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const query = topProductsQuerySchema.parse(req.query);
    const data = await reportService.getTopCategories(query);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
