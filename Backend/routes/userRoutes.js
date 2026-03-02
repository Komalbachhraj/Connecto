const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authMiddleware = require("../middlewares/authmiddleware");

// Get Profile Data
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    // req.user.id aapke authMiddleware se aayega
    const [rows] = await db.query(
      "SELECT username, email, hometown,bio, profile_photo FROM users WHERE id = ?",
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

module.exports = router;
