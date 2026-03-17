const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const verifyToken = require("../middlewares/authmiddleware");

// Get all notifications (with unread count)
router.get("/", verifyToken, notificationController.getNotifications);

// Mark ALL notifications as read
router.put("/mark-read", verifyToken, notificationController.markAllAsRead);

// Mark ONE notification as read
router.put("/mark-read/:id", verifyToken, notificationController.markOneAsRead);

module.exports = router;
