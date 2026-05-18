import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types';
import { AppError } from '../../utils/errors';
import { createRatePlanSchema, updateRatePlanSchema } from '../../schemas/admin.schema';
import * as ratePlanService from '../../services/admin/ratePlan.service';

export async function listRatePlans(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = await ratePlanService.listRatePlans();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getRatePlan(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = await ratePlanService.getRatePlan(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function createRatePlan(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const input = createRatePlanSchema.parse(req.body);
    const data = await ratePlanService.createRatePlan(input);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function updateRatePlan(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const input = updateRatePlanSchema.parse(req.body);
    const data = await ratePlanService.updateRatePlan(req.params.id, input);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function deleteRatePlan(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await ratePlanService.deleteRatePlan(req.params.id);
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
}
