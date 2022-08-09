const { Router } = require('express');
const authGuard = require('../middlewares/authGuard');
const orderController = require('../controllers/order.controller');

const router = Router();

router.post('/new', authGuard.authenticate, orderController.placeOrder);
router.get('/:orderId', orderController.findOrder);
router.get('/list', authGuard.authenticate, orderController.listOrders);
router.patch('/update', authGuard.authenticate, orderController.updateProduct);

module.exports = router;