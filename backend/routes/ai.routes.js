const express = require('express');
const { generateSummary, generateTitles, suggestCategory } = require('../controllers/ai.controller');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Apply protect middleware if you only want logged-in users to use AI
router.use(protect);

router.post('/summary', generateSummary);
router.post('/title', generateTitles);
router.post('/category', suggestCategory);

module.exports = router;