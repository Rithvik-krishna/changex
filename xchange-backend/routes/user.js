const express = require('express');
const router = express.Router();
const { saveListing, unsaveListing, getSavedListings } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/save', authMiddleware, saveListing);
router.post('/unsave', authMiddleware, unsaveListing);
router.get('/saved', authMiddleware, getSavedListings);

module.exports = router;
