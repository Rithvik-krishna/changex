const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    console.log("🔍 Auth Header:", authHeader); // Debug log
    
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header provided' });
    }

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization header must start with Bearer' });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    console.log("🔍 Token received:", token.substring(0, 20) + "..."); // Debug log (partial token)

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔍 Decoded token:", decoded); // Debug log

    // Get user from token
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    console.log("🔍 User found:", user._id); // Debug log
    
    req.user = user;
    next();
    
  } catch (error) {
    console.error("❌ Auth middleware error:", error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

module.exports = auth;