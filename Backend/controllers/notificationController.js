const db = require("../config/db");

// GET /api/notifications
// Get all notifications for the logged-in user
const getNotifications = async (req, res) => {
  const user_id = req.user?.id;

  try {
    const [notifications] = await db.query(
      `SELECT 
         n.id,
         n.type,
         n.message,
         n.is_read,
         n.created_at,
         u.username as sender_name,
         u.profile_picture as sender_pic
       FROM notifications n
       LEFT JOIN users u ON n.sender_id = u.id
       WHERE n.user_id = ?
       ORDER BY n.created_at DESC
       LIMIT 30`,
      [user_id]
    );

    // Count unread
    const unreadCount = notifications.filter((n) => !n.is_read).length;

    res.status(200).json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error("getNotifications error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT /api/notifications/mark-read
// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  const user_id = req.user?.id;

  try {
    await db.query(
      `UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0`,
      [user_id]
    );

    res
      .status(200)
      .json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    console.error("markAllAsRead error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT /api/notifications/mark-read/:id
// Mark a single notification as read
const markOneAsRead = async (req, res) => {
  const user_id = req.user?.id;
  const { id } = req.params;

  try {
    await db.query(
      `UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?`,
      [id, user_id]
    );

    res
      .status(200)
      .json({ success: true, message: "Notification marked as read" });
  } catch (error) {
    console.error("markOneAsRead error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getNotifications,
  markAllAsRead,
  markOneAsRead,
};