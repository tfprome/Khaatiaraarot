import { Router } from 'express';
import {
  listOrders,
  getOrderById,
  updateOrderStatus,
  createManualOrder,
  triggerInvoice,
} from '../../controllers/admin/order.controller';

const router = Router();

router.get('/', listOrders);
router.post('/', createManualOrder);
router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);
router.post('/:id/invoice', triggerInvoice);

export default router;
