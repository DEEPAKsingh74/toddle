const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const {
  likePost,
  unlikePost,
  getPostLikes,
  getUserLikes
} = require('../controllers/likes');

const router = express.Router();

router.post('/', authenticateToken, likePost);
router.delete('/:post_id', authenticateToken, unlikePost);
router.get('/post/:post_id', authenticateToken, getPostLikes);
router.get('/user/:user_id', authenticateToken, getUserLikes);

module.exports = router;
