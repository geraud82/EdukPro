// ===========================
// School Posts Controller
// ===========================

const { PrismaClient } = require('@prisma/client');
const { ApiError, asyncHandler } = require('../middleware/errorHandler');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const prisma = new PrismaClient();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/posts');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'post-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

/**
 * Get all posts for a school (public)
 * GET /api/schools/:schoolId/posts
 */
const getSchoolPosts = asyncHandler(async (req, res) => {
  const { schoolId } = req.params;
  const { type } = req.query; // Filter by type: announcement, event, news, photo

  const where = {
    schoolId: Number(schoolId),
    isPublished: true,
  };

  if (type) {
    where.type = type;
  }

  const posts = await prisma.schoolPost.findMany({
    where,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  res.json(posts);
});

/**
 * Get posts for admin's school
 * GET /api/admin/posts
 */
const getAdminPosts = asyncHandler(async (req, res) => {
  if (!req.user.schoolId) {
    throw new ApiError(400, 'No school associated with this admin');
  }

  const posts = await prisma.schoolPost.findMany({
    where: {
      schoolId: req.user.schoolId,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  res.json(posts);
});

/**
 * Create a new post
 * POST /api/admin/posts
 */
const createPost = asyncHandler(async (req, res) => {
  if (!req.user.schoolId) {
    throw new ApiError(400, 'No school associated with this admin');
  }

  const { type, title, content, eventDate, isPublished } = req.body;

  if (!type || !title || !content) {
    throw new ApiError(400, 'Type, title, and content are required');
  }

  const validTypes = ['announcement', 'event', 'news', 'photo'];
  if (!validTypes.includes(type)) {
    throw new ApiError(400, 'Invalid post type');
  }

  const postData = {
    schoolId: req.user.schoolId,
    type,
    title,
    content,
    authorId: req.user.id,
    isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
  };

  // Add imageUrl if provided
  if (req.file) {
    postData.imageUrl = `/uploads/posts/${req.file.filename}`;
  } else if (req.body.imageUrl) {
    postData.imageUrl = req.body.imageUrl;
  }

  // Add eventDate for events
  if (type === 'event' && eventDate) {
    postData.eventDate = new Date(eventDate);
  }

  const post = await prisma.schoolPost.create({
    data: postData,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
  });

  res.status(201).json(post);
});

/**
 * Update a post
 * PATCH /api/admin/posts/:id
 */
const updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { type, title, content, eventDate, isPublished, imageUrl } = req.body;

  // Check if post belongs to admin's school
  const existingPost = await prisma.schoolPost.findUnique({
    where: { id: Number(id) },
  });

  if (!existingPost) {
    throw new ApiError(404, 'Post not found');
  }

  if (existingPost.schoolId !== req.user.schoolId) {
    throw new ApiError(403, 'Access denied');
  }

  const updateData = {};
  
  if (type) updateData.type = type;
  if (title) updateData.title = title;
  if (content) updateData.content = content;
  if (isPublished !== undefined) updateData.isPublished = Boolean(isPublished);
  if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
  if (eventDate !== undefined) {
    updateData.eventDate = eventDate ? new Date(eventDate) : null;
  }

  // Handle file upload
  if (req.file) {
    updateData.imageUrl = `/uploads/posts/${req.file.filename}`;
    
    // Delete old image if exists
    if (existingPost.imageUrl && existingPost.imageUrl.startsWith('/uploads/')) {
      const oldImagePath = path.join(__dirname, '../..', existingPost.imageUrl);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
  }

  const post = await prisma.schoolPost.update({
    where: { id: Number(id) },
    data: updateData,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
  });

  res.json(post);
});

/**
 * Delete a post
 * DELETE /api/admin/posts/:id
 */
const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if post belongs to admin's school
  const post = await prisma.schoolPost.findUnique({
    where: { id: Number(id) },
  });

  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  if (post.schoolId !== req.user.schoolId) {
    throw new ApiError(403, 'Access denied');
  }

  // Delete associated image if exists
  if (post.imageUrl && post.imageUrl.startsWith('/uploads/')) {
    const imagePath = path.join(__dirname, '../..', post.imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  await prisma.schoolPost.delete({
    where: { id: Number(id) },
  });

  res.json({ message: 'Post deleted successfully' });
});

module.exports = {
  getSchoolPosts,
  getAdminPosts,
  createPost,
  updatePost,
  deletePost,
  upload, // Export multer upload middleware
};
