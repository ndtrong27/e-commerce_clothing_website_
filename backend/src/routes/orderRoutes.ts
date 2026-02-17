import { Router } from 'express';
import { createOrder, getUserOrders } from '../controllers/orderController';

const router = Router();

router.post('/', createOrder);
router.get('/user/:user_id', getUserOrders);

export default router;
