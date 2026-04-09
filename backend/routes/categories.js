const express = require('express');
const { getCategories, createCategory } = require('../controllers/categoryController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .get(getCategories)
  .post(protect, createCategory);

module.exports = router;
