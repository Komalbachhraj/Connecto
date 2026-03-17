const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const verifyToken = require("../middlewares/authmiddleware.js");

// 1. Personal Messages Fetch Karna (Buddy ke saath purani chat)
router.get("/chat/:buddyId", verifyToken, async (req, res) => {
  const myId = req.user.id;
  const buddyId = req.params.buddyId;
  try {
    const [messages] = await pool.execute(
      `SELECT id, sender_id, receiver_id, message_text, created_at, is_request 
       FROM direct_messages 
       WHERE (sender_id = ? AND receiver_id = ?) 
       OR (sender_id = ? AND receiver_id = ?) 
       ORDER BY created_at ASC`,
      [myId, buddyId, buddyId, myId],
    );
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Message Bhejna (With Connection Check Logic)
router.post("/send", verifyToken, async (req, res) => {
  const { receiverId, text } = req.body;
  const senderId = req.user.id;
  try {
    const [result] = await pool.execute(
      "INSERT INTO direct_messages (sender_id, receiver_id, message_text) VALUES (?, ?, ?)",
      [senderId, receiverId, text],
    );

    const newMessage = {
      id: result.insertId,
      sender_id: senderId,
      receiver_id: receiverId,
      message_text: text,
      created_at: new Date().toISOString(),
    };

    // Socket ko bolo broadcast kare
    // (Ise tum socket.js ke andar se export karke yahan use kar sakte ho ya global io access karo)
    res.json(newMessage); // Full object bhejo!
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Community Messages (Keep it at the bottom to avoid path conflicts)
router.get("/:communityId", verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT sender_name, message_text, created_at, is_read FROM community_messages WHERE community_id = ? ORDER BY id ASC",
      [req.params.communityId],
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
