const express = require('express');
const router = express.Router();
const {
  createListing,
  getListings,
  getListing,
  updateListing,
  deleteListing,
  getMyListings // <-- add this!
} = require('../controllers/listingController');
const authMiddleware = require('../middleware/authMiddleware');

// Protected routes
router.post('/', authMiddleware, createListing);
router.put('/:id', authMiddleware, updateListing);
router.delete('/:id', authMiddleware, deleteListing);

// NEW: Get my listings (protected)
router.get('/mine', authMiddleware, getMyListings);

// Public routes
router.get('/', getListings);
router.get('/:id', getListing);

module.exports = router;
