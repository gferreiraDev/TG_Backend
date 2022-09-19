const { Router } = require('express');
const userRoutes = require('./user.routes');
const stockRoutes = require('./stock.routes');
const orderRoutes = require('./order.routes');
const reviewRoutes = require('./review.routes');
const productRoutes = require('./product.routes');

const router = Router();

router.use('/user', userRoutes);
router.use('/product', productRoutes);
router.use('/stock', stockRoutes);
router.use('/order', orderRoutes);
router.use('/review', reviewRoutes);

module.exports = router;