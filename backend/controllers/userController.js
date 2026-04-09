const User = require('../models/User');

const populatePosts = {
  path: 'savedPosts',
  populate: [
    { path: 'author', select: 'username' },
    { path: 'category', select: 'name' }
  ]
};

const populateLikedPosts = {
  path: 'likedPosts',
  populate: [
    { path: 'author', select: 'username' },
    { path: 'category', select: 'name' }
  ]
};

// @desc    Get saved posts for current user
// @route   GET /api/users/me/saved
// @access  Private
exports.getSavedPosts = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate(populatePosts);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    const savedPosts = user?.savedPosts || [];

    res.status(200).json({
      success: true,
      count: savedPosts.length,
      data: savedPosts
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get liked posts for current user
// @route   GET /api/users/me/liked
// @access  Private
exports.getLikedPosts = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate(populateLikedPosts);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    const likedPosts = user?.likedPosts || [];

    res.status(200).json({
      success: true,
      count: likedPosts.length,
      data: likedPosts
    });
  } catch (err) {
    next(err);
  }
};
