const express = require('express');
const router = express.Router();
const { signup, login, getMe } = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many attempts, please try again later' },
});

router.post('/signup', authLimiter, signup);
router.post('/login', authLimiter, login);
router.get('/me', auth, getMe);

module.exports = router;
