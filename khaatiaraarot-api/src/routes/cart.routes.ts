import { Router } from 'express';
import { authenticateOptional } from '../middleware/auth.middleware';
import { ensureSession } from '../middleware/session.middleware';
import { getCart, addItem, updateItem, removeItem, clearCart } from '../controllers/cart.controller';

const router = Router();

router.use(ensureSession, authenticateOptional);

router.get('/', getCart);
router.post('/items', addItem);
router.patch('/items/:productId', updateItem);
router.delete('/items/:productId', removeItem);
router.delete('/', clearCart);

export default router;
