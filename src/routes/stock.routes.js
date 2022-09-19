const { Router } = require('express');
const authGuard = require('../middlewares/authGuard');
const stockController = require('../controllers/stock.controller');

const router = Router();

router.post('/add', authGuard.authenticate, stockController.addToStock);
router.post('/list', stockController.listProducts);
// router.post('/search', stockController.);
router.patch('/update', authGuard.authenticate, stockController.updateProduct);
router.delete('/:productId', authGuard.authenticate, stockController.removeProduct);
router.delete('/remove', authGuard.authenticate, stockController.deleteStock);

module.exports = router;