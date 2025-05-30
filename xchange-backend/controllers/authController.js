const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { 
    expiresIn: '30d' 
  });
};

// Register new user
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        error: 'Please provide name, email, and password' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        error: 'User already exists with this email' 
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create user
    const user = await User.create({ 
      name, 
      email, 
      password: hashedPassword 
    });

    // Generate token
    const token = generateToken(user._id);
    
    // Return user data without password
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email
    };

    res.status(201).json({ 
      token, 
      user: userData,
      message: 'User registered successfully'
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Server error during registration' 
    });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Please provide email and password' 
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }

    // Check password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }

    // Generate token
    const token = generateToken(user._id);
    
    // Return user data without password
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email
    };

    res.status(200).json({ 
      token, 
      user: userData,
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Server error during login' 
    });
  }
};

// Get user profile (bonus endpoint)
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      error: 'Server error while fetching user' 
    });
  }
};