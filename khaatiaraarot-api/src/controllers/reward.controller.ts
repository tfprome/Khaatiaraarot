import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import * as rewardService from '../services/reward.service';

export async function getMyPoints(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = await rewardService.getUserPoints(req.user!.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
