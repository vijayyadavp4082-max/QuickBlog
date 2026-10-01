import express from 'express';

import {
    addBlog,
    addComment,
    deleteBlogById,
    generateContent,
    getAllBlogs,
    getBlogById,
    getBlogComments,
    togglePublish
} from '../Controllers/blogController.js';

import upload from '../Middleware/multer.js';
import auth from '../Middleware/auth.js';

const blogRouter = express.Router();

// ==============================
// Blog Routes
// ==============================

// Add new blog
blogRouter.post(
    '/add',
    upload.single('image'),
    auth,
    addBlog
);

// Get all published blogs
blogRouter.get(
    '/all',
    getAllBlogs
);

// Get single blog
blogRouter.get(
    '/:blogId',
    getBlogById
);

// Delete blog
blogRouter.post(
    '/delete',
    auth,
    deleteBlogById
);

// Publish / Unpublish blog
blogRouter.post(
    '/toggle-publish',
    auth,
    togglePublish
);

// ==============================
// Comment Routes
// ==============================

// Add comment
blogRouter.post(
    '/add-comment',
    addComment
);

// Get blog comments
blogRouter.post(
    '/comments',
    getBlogComments
);

// ==============================
// AI Content Generation
// ==============================

// Generate AI content
blogRouter.post(
    '/generate',
    auth,
    generateContent
);

export default blogRouter;