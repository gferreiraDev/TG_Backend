const { Router } = require('express');
const authGuard = require('../middlewares/authGuard');
const userController = require('../controllers/user.controller');

const router = Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/authenticate', authGuard.authenticate, userController.authenticate);
router.patch('/update', authGuard.authenticate, userController.userUpdate);
router.delete('/unregister', authGuard.authenticate, userController.unregister);
router.get('/list', authGuard.authenticate, userController.searchSellers);
router.post('/address', authGuard.authenticate, userController.includeAddress);
router.patch('/address', authGuard.authenticate, userController.updateAddress);
router.delete('/address', authGuard.authenticate, userController.removeAddress);

module.exports = router;