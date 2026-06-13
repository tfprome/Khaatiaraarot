import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getMyPoints } from '../controllers/reward.controller';

const router = Router();

router.use(authenticate);
router.get('/', getMyPoints);

export default router;
