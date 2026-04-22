const express = require('express');
const { protect } = require('../middlewares/auth');
const { getConversation, getChatUsers } = require('../controllers/chatController');

const router = express.Router();

router.get('/users', protect, getChatUsers);
router.get('/:userId', protect, getConversation);

module.exports = router;