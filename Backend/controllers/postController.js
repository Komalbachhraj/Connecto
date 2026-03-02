import db from "../config/db.js"; // Aapka database connection path

// 1. Get all posts for a specific community
export const getPostsByCommunity = async (req, res) => {
  const { community_id } = req.params;

  try {
    // Hum JOIN use kar rahe hain taaki user ID ki jagah username mil sake
    const [posts] = await db.query(
      `SELECT p.*, u.username 
             FROM community_posts p 
             JOIN users u ON p.user_id = u.id 
             WHERE p.community_id = ? 
             ORDER BY p.created_at DESC`,
      [community_id],
    );
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error: Posts fetch nahi ho payi" });
  }
};

// 2. Create a new post
export const createPost = async (req, res) => {
  const { community_id, content } = req.body;
  const user_id = req.user.id; // Yeh JWT middleware se aayega

  if (!content) {
    return res.status(400).json({ message: "Content khali nahi ho sakta!" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO community_posts (community_id, user_id, content) VALUES (?, ?, ?)",
      [community_id, user_id, content],
    );
    res
      .status(201)
      .json({ message: "Post create ho gayi!", postId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error: Post create nahi ho payi" });
  }
};
export const likePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  try {
    const [existing] = await db.query(
      "SELECT * FROM post_likes WHERE user_id = ? AND post_id = ?",
      [userId, postId],
    );

    if (existing.length > 0) {
      await db.query(
        "DELETE FROM post_likes WHERE user_id = ? AND post_id = ?",
        [userId, postId],
      );
      await db.query(
        "UPDATE community_posts SET likes = likes - 1 WHERE id = ?",
        [postId],
      );
      return res.status(200).json({ message: "Unliked", liked: false });
    } else {
      await db.query(
        "INSERT INTO post_likes (user_id, post_id) VALUES (?, ?)",
        [userId, postId],
      );
      await db.query(
        "UPDATE community_posts SET likes = likes + 1 WHERE id = ?",
        [postId],
      );
      return res.status(200).json({ message: "Liked", liked: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
// 1. Get Comments for a Post (MySQL Fixed)
export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    
    // Yahan $1 ki jagah ? use karein (MySQL syntax)
    const [rows] = await db.query(
      "SELECT c.*, u.username FROM comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = ? ORDER BY c.created_at DESC",
      [postId]
    );
    
    // MySQL mein result seedhe rows mein hota hai
    res.json(rows); 
  } catch (err) {
    console.error("Fetch Comment Error:", err);
    res.status(500).json({ message: "Server Error: Comments fetch nahi ho paye" });
  }
};

// 2. Add a Comment (MySQL Fixed)
export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    // Yahan bhi $1, $2, $3 ki jagah ? use karein
    await db.query(
      "INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)",
      [postId, userId, content]
    );
    
    res.status(201).json({ message: "Comment added" });
  } catch (err) {
    console.error("Add Comment Error:", err);
    res.status(500).json({ message: "Server Error: Comment post nahi ho paya" });
  }
};
