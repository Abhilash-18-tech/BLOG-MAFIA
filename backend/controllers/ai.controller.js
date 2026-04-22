const aiService = require('../services/ai.service');

// @desc    Generate summary from content
// @route   POST /api/ai/summary
// @access  Private
exports.generateSummary = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ success: false, error: 'Content is required' });
    }

    const summary = await aiService.generateSummary(content);
    
    res.status(200).json({
      success: true,
      summary
    });
  } catch (err) {
    if (err.error?.code === 'insufficient_quota') {
      res.status(402).json({ success: false, error: 'OpenAI Quota Exceeded' });
    } else {
      next(err);
    }
  }
};

// @desc    Generate 3 titles from content
// @route   POST /api/ai/title
// @access  Private
exports.generateTitles = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ success: false, error: 'Content is required' });
    }

    const titles = await aiService.generateTitles(content);
    
    res.status(200).json({
      success: true,
      titles
    });
  } catch (err) {
    console.error('OPENAI ERROR:', err);
    if (err.error?.code === 'insufficient_quota') {
      res.status(402).json({ success: false, error: 'OpenAI Quota Exceeded' });
    } else {
      res.status(400).json({ success: false, error: err.error?.message || err.message });
    }
  }
};

// @desc    Suggest category from content
// @route   POST /api/ai/category
// @access  Private
exports.suggestCategory = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ success: false, error: 'Content is required' });
    }

    const category = await aiService.suggestCategory(content);
    
    res.status(200).json({
      success: true,
      category
    });
  } catch (err) {
    if (err.error?.code === 'insufficient_quota') {
      res.status(402).json({ success: false, error: 'OpenAI Quota Exceeded' });
    } else {
      next(err);
    }
  }
};