// routes/communityRoutes.js

const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authMiddleware = require("../middlewares/authmiddleware");

// ─────────────────────────────────────────────
// GET /api/communities/:slug/joined
// Check if logged-in user has joined a community
// ─────────────────────────────────────────────
router.get("/:slug/joined", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { slug } = req.params;

  try {
    // Step 1: Get community id from slug
    const [community] = await db.query(
      "SELECT id FROM communities WHERE slug = ?",
      [slug]
    );

    if (community.length === 0) {
      return res.status(404).json({ message: "Community not found" });
    }

    const communityId = community[0].id;

    // Step 2: Check if user is already a member
    const [existing] = await db.query(
      "SELECT * FROM user_communities WHERE user_id = ? AND community_id = ?",
      [userId, communityId]
    );

    res.json({ joined: existing.length > 0 });
  } catch (err) {
    console.error("Error checking join status:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ─────────────────────────────────────────────
// POST /api/communities/:slug/join
// Join or Leave a community (toggle)
// ─────────────────────────────────────────────
router.post("/:slug/join", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { slug } = req.params;

  try {
    // Step 1: Get community id from slug
    const [community] = await db.query(
      "SELECT id FROM communities WHERE slug = ?",
      [slug]
    );

    if (community.length === 0) {
      return res.status(404).json({ message: "Community not found" });
    }

    const communityId = community[0].id;

    // Step 2: Check if already joined
    const [existing] = await db.query(
      "SELECT * FROM user_communities WHERE user_id = ? AND community_id = ?",
      [userId, communityId]
    );

    if (existing.length > 0) {
      // Already joined → Leave
      await db.query(
        "DELETE FROM user_communities WHERE user_id = ? AND community_id = ?",
        [userId, communityId]
      );
      return res.json({ joined: false, message: "Left community successfully" });
    } else {
      // Not joined → Join
      await db.query(
        "INSERT INTO user_communities (user_id, community_id) VALUES (?, ?)",
        [userId, communityId]
      );
      return res.json({ joined: true, message: "Joined community successfully" });
    }
  } catch (err) {
    console.error("Error toggling community membership:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;