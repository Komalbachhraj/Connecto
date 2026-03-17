const db = require("../config/db");

// POST /api/connections/send/:receiverId
// Send a connection request
const sendConnectionRequest = async (req, res) => {
  const sender_id = req.user?.id;
  const receiver_id = parseInt(req.params.receiverId);

  if (sender_id === receiver_id) {
    return res
      .status(400)
      .json({ success: false, message: "You cannot connect with yourself" });
  }

  try {
    // Check if connection already exists
    const [existing] = await db.query(
      `SELECT * FROM connections WHERE 
       (sender_id = ? AND receiver_id = ?) OR 
       (sender_id = ? AND receiver_id = ?)`,
      [sender_id, receiver_id, receiver_id, sender_id]
    );

    if (existing.length > 0) {
      const conn = existing[0];
      if (conn.status === "pending") {
        return res
          .status(400)
          .json({ success: false, message: "Request already sent" });
      }
      if (conn.status === "accepted") {
        return res
          .status(400)
          .json({ success: false, message: "Already connected" });
      }
    }

    // Get sender's name for notification message
    const [senderRows] = await db.query(
      `SELECT username FROM users WHERE id = ?`,
      [sender_id]
    );
    const senderName = senderRows[0]?.username || "Someone";

    // Insert connection request
    await db.query(
      `INSERT INTO connections (sender_id, receiver_id, status) VALUES (?, ?, 'pending')`,
      [sender_id, receiver_id]
    );

    // Create notification for the receiver
    await db.query(
      `INSERT INTO notifications (user_id, sender_id, type, message) VALUES (?, ?, 'connection_request', ?)`,
      [receiver_id, sender_id, `${senderName} sent you a connection request`]
    );

    res
      .status(201)
      .json({ success: true, message: "Connection request sent" });
  } catch (error) {
    console.error("sendConnectionRequest error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT /api/connections/respond/:connectionId
// Accept or reject a connection request
const respondToRequest = async (req, res) => {
  const user_id = req.user?.id;
  const { connectionId } = req.params;
  const { action } = req.body; // 'accepted' or 'rejected'

  if (!["accepted", "rejected"].includes(action)) {
    return res.status(400).json({ success: false, message: "Invalid action" });
  }

  try {
    const [connections] = await db.query(
      `SELECT * FROM connections WHERE id = ? AND receiver_id = ? AND status = 'pending'`,
      [connectionId, user_id]
    );

    if (connections.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Connection request not found" });
    }

    const connection = connections[0];

    await db.query(`UPDATE connections SET status = ? WHERE id = ?`, [
      action,
      connectionId,
    ]);

    if (action === "accepted") {
      // Get receiver name
      const [receiverRows] = await db.query(
        `SELECT username FROM users WHERE id = ?`,
        [user_id]
      );
      const receiverName = receiverRows[0]?.username || "Someone";

      // Notify the original sender
      await db.query(
        `INSERT INTO notifications (user_id, sender_id, type, message) VALUES (?, ?, 'connection_accepted', ?)`,
        [
          connection.sender_id,
          user_id,
          `${receiverName} accepted your connection request`,
        ]
      );
    }

    res.status(200).json({ success: true, message: `Request ${action}` });
  } catch (error) {
    console.error("respondToRequest error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/connections/status/:otherUserId
// Check connection status between logged-in user and another user
const getConnectionStatus = async (req, res) => {
  const user_id = req.user?.id;
  const other_id = parseInt(req.params.otherUserId);

  try {
    const [rows] = await db.query(
      `SELECT * FROM connections WHERE 
       (sender_id = ? AND receiver_id = ?) OR 
       (sender_id = ? AND receiver_id = ?)`,
      [user_id, other_id, other_id, user_id]
    );

    if (rows.length === 0) {
      return res.status(200).json({ success: true, status: "none" });
    }

    const conn = rows[0];
    const isSender = conn.sender_id === user_id;

    res.status(200).json({
      success: true,
      status: conn.status,             // 'pending' | 'accepted' | 'rejected'
      direction: isSender ? "sent" : "received",
      connectionId: conn.id,
    });
  } catch (error) {
    console.error("getConnectionStatus error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/connections/my
// Get all accepted connections of the logged-in user
const getMyConnections = async (req, res) => {
  const user_id = req.user?.id;

  try {
    const [rows] = await db.query(
      `SELECT 
         u.id, u.username, u.profile_picture,
         c.created_at as connected_since
       FROM connections c
       JOIN users u ON (
         CASE WHEN c.sender_id = ? THEN c.receiver_id ELSE c.sender_id END = u.id
       )
       WHERE (c.sender_id = ? OR c.receiver_id = ?) AND c.status = 'accepted'
       ORDER BY c.created_at DESC`,
      [user_id, user_id, user_id]
    );

    res.status(200).json({ success: true, connections: rows });
  } catch (error) {
    console.error("getMyConnections error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  sendConnectionRequest,
  respondToRequest,
  getConnectionStatus,
  getMyConnections,
};