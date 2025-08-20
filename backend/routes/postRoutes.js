const express = require("express");
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getPostById,
  getUserPosts,
  updatePost,
  deletePost,
  markAsSold,
  upload, // multer middleware
} = require("../controllers/postController");
const { authenticateToken } = require("../middleware/auth");

// Public routes (no authentication required)
router.get("/:id", getPostById); // GET /api/posts/:id - Get single post
router.get("/user/:userId", getUserPosts); // GET /api/posts/user/:userId - Get user's posts

// Protected routes (authentication required)
router.get("/", authenticateToken, getAllPosts); // GET /api/posts - Get all posts (user's university only)
router.post("/", authenticateToken, upload.array("images", 5), createPost); // POST /api/posts - Create post with images (max 5)
router.put("/:id", authenticateToken, updatePost); // PUT /api/posts/:id - Update post
router.delete("/:id", authenticateToken, deletePost); // DELETE /api/posts/:id - Delete post
router.patch("/:id/sold", authenticateToken, markAsSold); // PATCH /api/posts/:id/sold - Mark as sold

module.exports = router;
