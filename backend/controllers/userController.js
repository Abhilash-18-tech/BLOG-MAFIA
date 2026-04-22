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

// @desc    Follow a user
// @route   POST /api/users/:id/follow
// @access  Private
exports.followUser = async (req, res, next) => {
  try {
    if (req.user.id === req.params.id) {
      return res.status(400).json({ success: false, error: 'You cannot follow yourself' });
    }

    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (!currentUser.following.includes(userToFollow._id)) {
      currentUser.following.push(userToFollow._id);
      userToFollow.followers.push(currentUser._id);
      await Promise.all([currentUser.save(), userToFollow.save()]);
    }

    res.status(200).json({
      success: true,
      data: { following: true }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Unfollow a user
// @route   DELETE /api/users/:id/follow
// @access  Private
exports.unfollowUser = async (req, res, next) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToUnfollow) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (currentUser.following.includes(userToUnfollow._id)) {
      currentUser.following = currentUser.following.filter(id => id.toString() !== userToUnfollow._id.toString());
      userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== currentUser._id.toString());
      await Promise.all([currentUser.save(), userToUnfollow.save()]);
    }

    res.status(200).json({
      success: true,
      data: { following: false }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user profile with follow status
// @route   GET /api/users/:id
// @access  Public
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Determine follow status if a user is logged in
    let isFollowing = false;
    if (req.user) {
      const currentUser = await User.findById(req.user.id);
      isFollowing = currentUser.following.includes(user._id);
    }

    res.status(200).json({
      success: true,
      data: {
        ...user._doc,
        followersCount: user.followers.length,
        followingCount: user.following.length,
        isFollowing
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get followers/following list
// @route   GET /api/users/:id/network
// @access  Private
exports.getUserNetwork = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('following', 'username profilePicture')
      .populate('followers', 'username profilePicture');

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        following: user.following,
        followers: user.followers
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user profile picture/username
// @route   PUT /api/users/me/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {};
    if (req.body.username) fieldsToUpdate.username = req.body.username;
    
    if (req.file) {
      fieldsToUpdate.profilePicture = `http://localhost:5000/uploads/${req.file.filename}`;
    } else if (req.body.profilePicture) {
      fieldsToUpdate.profilePicture = req.body.profilePicture;
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture
      }
    });
  } catch (err) {
    next(err);
  }
};
