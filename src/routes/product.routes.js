const { Router } = require('express');
const authGuard = require('../middlewares/authGuard');
const productController = require('../controllers/product.controller');

const router = Router();

router.post('/add', authGuard.authenticate, productController.registerProduct);
router.post('/list', productController.listProducts);
router.patch('/update', authGuard.authenticate, productController.updateProduct);
router.delete('/:productId', authGuard.authenticate, productController.removeProduct);

module.exports = router;