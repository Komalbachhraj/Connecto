const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authMiddleware = require("../middlewares/authmiddleware");

// Get Profile Data
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    // req.user.id aapke authMiddleware se aayega
    const [rows] = await db.query(
      "SELECT username, email, hometown,bio FROM users WHERE id = ?",
      [req.user.id],
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "User not found" });
   return res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update Profile Data
router.put("/profile/update", authMiddleware, async (req, res) => {
  const { name, phone, hometown, bio } = req.body;
  try {
    // Note: Agar aap username update kar rahe hain toh column name 'username' use karein
    await db.query(
      "UPDATE users SET username = ?, phone = ?, hometown = ?, bio = ? WHERE id = ?",
      [name, phone, hometown, bio, req.user.id],
    );
    res.json({ message: "Profile updated successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
});
// Get All Buddies (Excluding current user)
router.get("/all-buddies", authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, username, hometown, avatar_url, bio, course, year, travelMode, interests, online 
       FROM users 
       WHERE id != ?`,
      [req.user.id],
    );

    const formattedRows = rows.map((user) => ({
      id: user.id,
      name: user.username,
      hometown: user.hometown || "Unknown",
      // Agar avatar_url hai toh wo use karo, nahi toh naam ka pehla letter
      avatar: user.avatar_url
        ? user.avatar_url
        : user.username.charAt(0).toUpperCase(),
      course: user.course,
      year: user.year,
      interests:
        typeof user.interests === "string"
          ? JSON.parse(user.interests)
          : user.interests || [],
      travelMode: user.travelMode,
      online: Boolean(user.online),
    }));

    res.json(formattedRows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch buddies" });
  }
});
module.exports = router;
