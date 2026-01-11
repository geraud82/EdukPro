// ===========================
// School Posts Routes
// ===========================

const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { authMiddleware, requireAdmin } = require('../middleware/auth');

// Public routes - get posts for a school
router.get('/schools/:schoolId/posts', postController.getSchoolPosts);

// Admin routes - manage posts
router.get('/admin/posts', authMiddleware, requireAdmin, postController.getAdminPosts);
router.post('/admin/posts', authMiddleware, requireAdmin, postController.upload.single('image'), postController.createPost);
router.patch('/admin/posts/:id', authMiddleware, requireAdmin, postController.upload.single('image'), postController.updatePost);
router.delete('/admin/posts/:id', authMiddleware, requireAdmin, postController.deletePost);

module.exports = router;
