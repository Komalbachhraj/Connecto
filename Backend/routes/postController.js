const db = require("../config/db"); // adjust path if needed

// GET posts by community_id (from community_posts table)
const getPostsByCommunity = async (req, res) => {
  const { community_id } = req.params;
  try {
    const [posts] = await db.query(
      `SELECT cp.*, u.username, u.profile_picture
       FROM community_posts cp
       LEFT JOIN users u ON cp.user_id = u.id
       WHERE cp.community_id = ?
       ORDER BY cp.created_at DESC`,
      [community_id]
    );
    res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error("getPostsByCommunity error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST create a new post (saves to community_posts)
const createPost = async (req, res) => {
  const { community_id, content, image_url } = req.body;
  const user_id = req.user?.id; // from authMiddleware

  if (!community_id || !content) {
    return res
      .status(400)
      .json({ success: false, message: "community_id and content are required" });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO community_posts (community_id, user_id, content, image_url)
       VALUES (?, ?, ?, ?)`,
      [community_id, user_id, content, image_url || null]
    );
    res.status(201).json({
      success: true,
      message: "Post created successfully",
      postId: result.insertId,
    });
  } catch (error) {
    console.error("createPost error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT like/unlike a post (toggles in post_likes, updates likes count in community_posts)
const likePost = async (req, res) => {
  const { id: post_id } = req.params;
  const user_id = req.user?.id;

  try {
    // Check if already liked
    const [existing] = await db.query(
      `SELECT id FROM post_likes WHERE user_id = ? AND post_id = ?`,
      [user_id, post_id]
    );

    if (existing.length > 0) {
      // Unlike: remove from post_likes and decrement
      await db.query(`DELETE FROM post_likes WHERE user_id = ? AND post_id = ?`, [
        user_id,
        post_id,
      ]);
      await db.query(
        `UPDATE community_posts SET likes = GREATEST(likes - 1, 0) WHERE id = ?`,
        [post_id]
      );
      return res.status(200).json({ success: true, message: "Post unliked" });
    } else {
      // Like: insert into post_likes and increment
      await db.query(
        `INSERT INTO post_likes (user_id, post_id) VALUES (?, ?)`,
        [user_id, post_id]
      );
      await db.query(
        `UPDATE community_posts SET likes = likes + 1 WHERE id = ?`,
        [post_id]
      );
      return res.status(200).json({ success: true, message: "Post liked" });
    }
  } catch (error) {
    console.error("likePost error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET comments for a post
const getComments = async (req, res) => {
  const { postId } = req.params;
  try {
    const [comments] = await db.query(
      `SELECT c.*, u.username, u.profile_picture
       FROM comments c
       LEFT JOIN users u ON c.user_id = u.id
       WHERE c.post_id = ?
       ORDER BY c.created_at ASC`,
      [postId]
    );
    res.status(200).json({ success: true, comments });
  } catch (error) {
    console.error("getComments error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST add a comment to a post
const addComment = async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const user_id = req.user?.id;

  if (!content) {
    return res.status(400).json({ success: false, message: "Content is required" });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)`,
      [postId, user_id, content]
    );
    res.status(201).json({
      success: true,
      message: "Comment added",
      commentId: result.insertId,
    });
  } catch (error) {
    console.error("addComment error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getPostsByCommunity,
  createPost,
  likePost,
  getComments,
  addComment,
};