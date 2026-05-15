import { Router } from 'express';
import { getInventory } from '../../controllers/admin/order.controller';

const router = Router();

router.get('/', getInventory);

export default router;
