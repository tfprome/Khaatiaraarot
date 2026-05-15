import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { createOrder, getOrders, getOrderById } from '../controllers/order.controller';

const router = Router();

router.use(authenticate);

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);

export default router;
