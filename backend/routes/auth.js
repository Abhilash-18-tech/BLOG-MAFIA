const express = require('express');
const passport = require('passport');
const { register, login, generateToken, getMe, forgotPassword, verifyOtp, resetPassword } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

const router = express.Router();
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

// @desc    Auth with Google
// @route   GET /api/auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @desc    Google auth callback
// @route   GET /api/auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: `${clientUrl}/login?error=auth_failed` }),
  (req, res) => {
    // Successful authentication, generate token
    const token = generateToken(req.user._id);
    res.redirect(`${clientUrl}/?token=${token}`);
  }
);

module.exports = router;
