const { pool } = require("../config/database");

// Create a new post
const createPost = async (req, res) => {
  try {
    const sellerId = req.user.userId; // From JWT token
    const {
      title,
      description,
      price,
      category,
      contactMethod,
      course,
      event,
      location,
    } = req.body;

    // Validation
    if (!title || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, description, price, and category are required",
      });
    }

    // Get user's university from their profile
    const userQuery = await pool.query(
      "SELECT university FROM users WHERE id = $1",
      [sellerId]
    );

    if (userQuery.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const university = userQuery.rows[0].university;

    // Create new post
    const newPostQuery = await pool.query(
      `INSERT INTO posts (title, description, price, category, seller_id, university, contact_method, course, event, location)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        title,
        description,
        price,
        category,
        sellerId,
        university,
        contactMethod,
        course,
        event,
        location,
      ]
    );

    const newPost = newPostQuery.rows[0];

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: {
        post: newPost,
      },
    });
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get all posts with optional filters
const getAllPosts = async (req, res) => {
  try {
    const userId = req.user.userId; // Get user ID from JWT token
    const {
      category,
      status = "active",
      search,
      page = 1,
      limit = 20,
    } = req.query;

    // First, get the user's university
    const userQuery = await pool.query(
      "SELECT university FROM users WHERE id = $1",
      [userId]
    );

    if (userQuery.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userUniversity = userQuery.rows[0].university;

    let query = `
      SELECT 
        p.*,
        u.name as seller_name,
        u.email as seller_email
      FROM posts p
      JOIN users u ON p.seller_id = u.id
      WHERE p.status = $1 AND p.university = $2
    `;

    const queryParams = [status, userUniversity];
    let paramCount = 3;

    // Add filters
    if (category) {
      query += ` AND p.category = $${paramCount}`;
      queryParams.push(category);
      paramCount++;
    }

    if (search) {
      query += ` AND (p.title ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
      paramCount++;
    }

    // Get total count first (without pagination)
    const countQuery = query.replace(
      "SELECT \n        p.*,\n        u.name as seller_name,\n        u.email as seller_email\n      FROM posts p\n      JOIN users u ON p.seller_id = u.id",
      "SELECT COUNT(*) as total FROM posts p JOIN users u ON p.seller_id = u.id"
    );
    const countParams = queryParams.slice(0, paramCount - 1); // Remove limit and offset params
    const totalResult = await pool.query(countQuery, countParams);
    const totalPosts = parseInt(totalResult.rows[0].total);

    // Add ordering and pagination
    query += ` ORDER BY p.created_at DESC`;
    query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    queryParams.push(parseInt(limit));
    queryParams.push((parseInt(page) - 1) * parseInt(limit));

    const postsQuery = await pool.query(query, queryParams);

    res.status(200).json({
      success: true,
      data: {
        posts: postsQuery.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalPosts,
          totalPages: Math.ceil(totalPosts / parseInt(limit)),
          hasNextPage: parseInt(page) < Math.ceil(totalPosts / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error("Get posts error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get single post by ID
const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;

    const postQuery = await pool.query(
      `SELECT 
        p.*,
        u.name as seller_name,
        u.email as seller_email,
        u.phone as seller_phone
      FROM posts p
      JOIN users u ON p.seller_id = u.id
      WHERE p.id = $1`,
      [postId]
    );

    if (postQuery.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Increment view count
    await pool.query("UPDATE posts SET views = views + 1 WHERE id = $1", [
      postId,
    ]);

    const post = postQuery.rows[0];
    post.views += 1; // Update the returned object

    res.status(200).json({
      success: true,
      data: {
        post,
      },
    });
  } catch (error) {
    console.error("Get post error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get posts by user
const getUserPosts = async (req, res) => {
  try {
    const userId = req.params.userId;

    const postsQuery = await pool.query(
      `SELECT * FROM posts 
       WHERE seller_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    );

    res.status(200).json({
      success: true,
      data: {
        posts: postsQuery.rows,
      },
    });
  } catch (error) {
    console.error("Get user posts error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update post (only by owner)
const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;
    const {
      title,
      description,
      price,
      category,
      contactMethod,
      course,
      event,
      location,
    } = req.body;

    // Check if user owns this post
    const postQuery = await pool.query(
      "SELECT * FROM posts WHERE id = $1 AND seller_id = $2",
      [postId, userId]
    );

    if (postQuery.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this post",
      });
    }

    // Update post
    const updatedPostQuery = await pool.query(
      `UPDATE posts 
       SET title = $1, description = $2, price = $3, category = $4, 
           contact_method = $5, course = $6, event = $7, location = $8,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9 AND seller_id = $10
       RETURNING *`,
      [
        title,
        description,
        price,
        category,
        contactMethod,
        course,
        event,
        location,
        postId,
        userId,
      ]
    );

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: {
        post: updatedPostQuery.rows[0],
      },
    });
  } catch (error) {
    console.error("Update post error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Delete post (only by owner)
const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;

    // Check if user owns this post
    const deleteQuery = await pool.query(
      "DELETE FROM posts WHERE id = $1 AND seller_id = $2 RETURNING *",
      [postId, userId]
    );

    if (deleteQuery.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this post or post not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Mark post as sold
const markAsSold = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;

    const updateQuery = await pool.query(
      `UPDATE posts 
       SET status = 'sold', updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1 AND seller_id = $2
       RETURNING *`,
      [postId, userId]
    );

    if (updateQuery.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this post or post not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Post marked as sold",
      data: {
        post: updateQuery.rows[0],
      },
    });
  } catch (error) {
    console.error("Mark as sold error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  getUserPosts,
  updatePost,
  deletePost,
  markAsSold,
};
