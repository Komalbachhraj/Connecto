const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authMiddleware = require("../middlewares/authmiddleware");

// 1. Connection Status Fetch Karna (Frontend Store ke liye)
router.get("/my-status", authMiddleware, async (req, res) => {
  try {
    const myId = req.user.id;
    const [rows] = await db.query(
      `SELECT 
        IF(sender_id = ?, receiver_id, sender_id) AS buddyId,
        status,
        IF(sender_id = ?, 1, 0) AS isSender
       FROM connections 
       WHERE sender_id = ? OR receiver_id = ?`,
      [myId, myId, myId, myId],
    );
    console.log("DB Rows for User", myId, ":", rows); // Backend console check karo
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
});

// 2. Connection Request Bhejna
router.post("/send", authMiddleware, async (req, res) => {
  const { receiverId } = req.body;
  const senderId = req.user.id;

  try {
    // Check karo pehle se toh request nahi hai
    const [existing] = await db.query(
      "SELECT * FROM connections WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)",
      [senderId, receiverId, receiverId, senderId],
    );

    if (existing.length > 0) {
      return res
        .status(400)
        .json({ message: "Connection already exists or pending" });
    }

    await db.query(
      "INSERT INTO connections (sender_id, receiver_id, status) VALUES (?, ?, 'pending')",
      [senderId, receiverId],
    );
    res.json({ message: "Request sent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 3. Request Accept ya Reject karna
router.post("/update", authMiddleware, async (req, res) => {
  const { buddyId, action } = req.body; // action: 'accepted' or 'rejected'
  const myId = req.user.id;

  try {
    if (action === "accepted") {
      await db.query(
        "UPDATE connections SET status = 'accepted' WHERE sender_id = ? AND receiver_id = ?",
        [buddyId, myId],
      );
      res.json({ message: "Request accepted" });
    } else {
      await db.query(
        "DELETE FROM connections WHERE sender_id = ? AND receiver_id = ?",
        [buddyId, myId],
      );
      res.json({ message: "Request rejected/deleted" });
    }
  } catch (err) {
    res.status(500).json({ message: "Action failed" });
  }
});

module.exports = router;
