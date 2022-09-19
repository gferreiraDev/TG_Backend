const { Router } = require('express');
// const fs = require('fs');
const multer = require('multer');
const upload = multer({dest: 'uploads/'})
const authGuard = require('../middlewares/authGuard');
const userController = require('../controllers/user.controller');

const router = Router();

router.delete('/address/:addressId', authGuard.authenticate, userController.removeAddress);
router.delete('/unregister', authGuard.authenticate, userController.unregister);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/authenticate', authGuard.authenticate, userController.authenticate);
router.put('/update', authGuard.authenticate, userController.userUpdate);
router.get('/list', authGuard.authenticate, userController.searchSellers);
router.post('/address', authGuard.authenticate, userController.includeAddress);
router.put('/address', authGuard.authenticate, userController.updateAddress);

router.post('/avatar', upload.single('fileName'), userController.updateAvatar);
// router.post('/avatar', upload.single('fileName'), (req, res, next) => {
//   console.log('fileData:', req.file);

//   fs.readFile(req.file.path, (err, contents) => {
//     if (err) {
//       console.log('Error:', err);
//       return res.status(400).send({ error: true, message: err });
//     }
//     console.log('File contents', contents);
//     return res.status(200).send(contents);
//   })
// });

module.exports = router;