const express = require('express');
const passport = require('passport');
const { register, login, generateToken, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// @desc    Auth with Google
// @route   GET /api/auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @desc    Google auth callback
// @route   GET /api/auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login?error=auth_failed' }),
  (req, res) => {
    // Successful authentication, generate token
    const token = generateToken(req.user._id);
    res.redirect(`http://localhost:5173/?token=${token}`);
  }
);

module.exports = router;
