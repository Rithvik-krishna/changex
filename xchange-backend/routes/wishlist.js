const express = require('express');
const router = express.Router();
const { addToWishlist, removeFromWishlist, getWishlist } = require('../controllers/wishlistController');
const auth = require('../middleware/authMiddleware');

router.post('/add', auth, addToWishlist);
router.post('/remove', auth, removeFromWishlist);
router.get('/', auth, getWishlist);

module.exports = router;
