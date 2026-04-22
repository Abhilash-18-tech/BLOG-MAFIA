const express = require('express');
const path = require('path');
const multer = require('multer');
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  savePost,
  unsavePost,
  addComment
} = require('../controllers/postController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });

router
  .route('/')
  .get(getPosts)
  .post(protect, upload.single('image'), createPost);

router
  .route('/:id')
  .get(getPost)
  .put(protect, upload.single('image'), updatePost)
  .delete(protect, deletePost);

router.post('/:id/like', protect, likePost);
router.delete('/:id/like', protect, unlikePost);
router.post('/:id/save', protect, savePost);
router.delete('/:id/save', protect, unsavePost);
router.post('/:id/comments', protect, addComment);

module.exports = router;
