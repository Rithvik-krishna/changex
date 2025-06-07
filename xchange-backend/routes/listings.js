const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  createListing,
  getListings,
  getListing,
  updateListing,
  deleteListing,
  getMyListings
} = require('../controllers/listingController');

// Public
router.get('/', getListings);
router.get('/:id', getListing);

// Protected
router.post('/', auth, createListing);
router.put('/:id', auth, updateListing);
router.delete('/:id', auth, deleteListing);
router.get('/mine', auth, getMyListings);

module.exports = router;
