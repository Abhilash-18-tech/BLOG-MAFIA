const express = require('express');
const { protect } = require('../middlewares/auth');
const { getSavedPosts, getLikedPosts } = require('../controllers/userController');

const router = express.Router();

router.get('/me/saved', protect, getSavedPosts);
router.get('/me/liked', protect, getLikedPosts);

module.exports = router;
