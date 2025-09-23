const express = require('express');
const { body } = require('express-validator');
const jwt = require('jsonwebtoken');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

console.log('=== Loading auth routes ===');

// Simple rate limiting (basic demo only)
const simpleRateLimit = (req, res, next) => {
  console.log('Rate limit check passed');
  next();
};

// =======================
// Register Route
// =======================
console.log('Setting up register route...');
router.post(
  '/register',
  simpleRateLimit,
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().isLength({ min: 2 }),
  (req, res, next) => {
    console.log('Register validation middleware passed');
    next();
  },
  authController.register
);
console.log('✅ Register route set up');

// =======================
// Login Route
// =======================
console.log('Setting up login route...');
router.post(
  '/login',
  simpleRateLimit,
  body('email').isEmail().normalizeEmail(),
  body('password').exists(),
  (req, res, next) => {
    console.log('Login validation middleware passed');
    next();
  },
  authController.login
);
console.log('✅ Login route set up');

// =======================
// Verify Token Route
// =======================
console.log('Setting up verify route...');
router.get('/verify', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('Token verification failed:', err.message);
      return res.status(403).json({ message: 'Invalid token' });
    }
    console.log('Token verified successfully');
    res.json({ user: decoded });
  });
});
console.log('✅ Verify route set up');

// =======================
// Profile Route
// =======================
console.log('Setting up profile route...');
router.get('/profile', auth, authController.getProfile);
console.log('✅ Profile route set up');

console.log('=== All auth routes loaded successfully ===');

module.exports = router;
