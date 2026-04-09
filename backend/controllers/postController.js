const Post = require('../models/Post');
const User = require('../models/User');

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
exports.getPosts = async (req, res, next) => {
  try {
    let query;
    const reqQuery = { ...req.query };

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create query
    query = Post.find(JSON.parse(queryStr))
      .populate({
        path: 'author',
        select: 'username'
      })
      .populate({
        path: 'category',
        select: 'name'
      });

    // Sort by newest first
    query = query.sort('-createdAt');

    // Executing query
    const posts = await query;

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate({
        path: 'author',
        select: 'username'
      })
      .populate({
        path: 'category',
        select: 'name'
      });

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res, next) => {
  try {
    const payload = req.body || {};

    // Add author to payload
    payload.author = req.user.id;

    if (req.file) {
      payload.image = req.file.filename;
    }

    const post = await Post.create(payload);

    res.status(201).json({
      success: true,
      data: post
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
exports.updatePost = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    // Make sure user is post owner
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'User not authorized to update this post'
      });
    }

    const payload = req.body || {};

    if (req.file) {
      payload.image = req.file.filename;
    }

    post = await Post.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    // Make sure user is post owner
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'User not authorized to delete this post'
      });
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

const listHasPost = (list, postId) => {
  return list.some((id) => id.toString() === postId.toString());
};

// @desc    Like a post
// @route   POST /api/posts/:id/like
// @access  Private
exports.likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    const user = await User.findById(req.user.id);
    const alreadyLiked = listHasPost(user.likedPosts, post._id);

    if (!alreadyLiked) {
      user.likedPosts.push(post._id);
      post.likesCount = Math.max((post.likesCount || 0) + 1, 0);
      await Promise.all([user.save(), post.save()]);
    }

    res.status(200).json({
      success: true,
      data: {
        liked: true,
        likesCount: post.likesCount
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Unlike a post
// @route   DELETE /api/posts/:id/like
// @access  Private
exports.unlikePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    const user = await User.findById(req.user.id);
    const alreadyLiked = listHasPost(user.likedPosts, post._id);

    if (alreadyLiked) {
      user.likedPosts = user.likedPosts.filter((id) => id.toString() !== post._id.toString());
      post.likesCount = Math.max((post.likesCount || 0) - 1, 0);
      await Promise.all([user.save(), post.save()]);
    }

    res.status(200).json({
      success: true,
      data: {
        liked: false,
        likesCount: post.likesCount
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Save a post
// @route   POST /api/posts/:id/save
// @access  Private
exports.savePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    const user = await User.findById(req.user.id);
    const alreadySaved = listHasPost(user.savedPosts, post._id);

    if (!alreadySaved) {
      user.savedPosts.push(post._id);
      await user.save();
    }

    res.status(200).json({
      success: true,
      data: {
        saved: true
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Unsave a post
// @route   DELETE /api/posts/:id/save
// @access  Private
exports.unsavePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    const user = await User.findById(req.user.id);
    const alreadySaved = listHasPost(user.savedPosts, post._id);

    if (alreadySaved) {
      user.savedPosts = user.savedPosts.filter((id) => id.toString() !== post._id.toString());
      await user.save();
    }

    res.status(200).json({
      success: true,
      data: {
        saved: false
      }
    });
  } catch (err) {
    next(err);
  }
};
