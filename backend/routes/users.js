const express = require('express');
const path = require('path');
const multer = require('multer');
const { protect } = require('../middlewares/auth');
const { getSavedPosts, getLikedPosts, followUser, unfollowUser, getUserProfile, getUserNetwork, updateProfile } = require('../controllers/userController');

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    cb(null, true);
  }
});

router.put('/me/profile', protect, upload.single('profilePicture'), updateProfile);
router.get('/me/saved', protect, getSavedPosts);
router.get('/me/liked', protect, getLikedPosts);

// Note: optional auth for get profile since public users can view, but for following check we need the token optionally (we will just reuse auth headers on frontend, but handle optional correctly we can just leave it public or protect, let's use protect for full functionality or make a custom optional auth middleware). Let's use a try-catch hack in controller assuming token might not exist if we omit protect, but since protect errors if no token, for simplicity we keep it public but no isFollowing check, or we create a route for /:id/profile that is public.
// But to deliver real chat we ensure user is logged in. So let's protect everything for chat.
router.get('/:id', protect, getUserProfile);
router.get('/:id/network', protect, getUserNetwork);
router.post('/:id/follow', protect, followUser);
router.delete('/:id/follow', protect, unfollowUser);

module.exports = router;
