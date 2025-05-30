const express = require('express');
const router = express.Router();
const { addReview, getUserReviews } = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/:tradeId', authMiddleware, addReview);
router.get('/user/:userId', getUserReviews); // Public route

module.exports = router;
