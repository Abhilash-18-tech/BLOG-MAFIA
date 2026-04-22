const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Get conversation between two users
// @route   GET /api/chat/:userId
// @access  Private
exports.getConversation = async (req, res, next) => {
  try {
    const currentUserId = req.user.id;
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId }
      ]
    }).sort('createdAt'); // oldest to newest

    res.status(200).json({ success: true, count: messages.length, data: messages });
  } catch (err) {
    next(err);
  }
};

// @desc    Get users list for chat (following & followers)
// @route   GET /api/chat/users
// @access  Private
exports.getChatUsers = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('following', 'username profilePicture')
      .populate('followers', 'username profilePicture');

    // Combine following and followers to create a unique list of contacts
    const combinedMap = new Map();
    user.following.forEach(u => combinedMap.set(u._id.toString(), u));
    user.followers.forEach(u => combinedMap.set(u._id.toString(), u));
    
    const contactList = Array.from(combinedMap.values());

    res.status(200).json({ success: true, data: contactList });
  } catch (err) {
    next(err);
  }
};