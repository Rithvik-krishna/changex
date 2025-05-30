const express = require('express');
const router = express.Router();
const { createTrade, getMyTrades, updateTradeStatus } = require('../controllers/tradeController');
const authMiddleware = require('../middleware/authMiddleware');
const auth = require('../middleware/authMiddleware');


// Debug middleware to log all requests
router.use((req, res, next) => {
  console.log(`🔍 ${req.method} ${req.originalUrl}`);
  console.log("🔍 Headers:", req.headers);
  next();
});

// All routes require authentication
router.post('/', authMiddleware, createTrade);
router.get('/', authMiddleware, getMyTrades);
router.put('/:id', authMiddleware, updateTradeStatus);


module.exports = router;