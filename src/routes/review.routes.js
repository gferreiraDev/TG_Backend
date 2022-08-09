const { Router } = require('express');
const authGuard = require('../middlewares/authGuard');
const reviewController = require('../controllers/review.controller');

const router = Router();

router.post('/new', reviewController.postReview);
router.post('/list', reviewController.listReviews);
router.patch('/update', authGuard.authenticate, reviewController.updateReview);
router.delete('/remove', authGuard.authenticate, reviewController.deleteReview);

module.exports = router;