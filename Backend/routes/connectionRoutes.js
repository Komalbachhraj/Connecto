const express = require("express");
const router = express.Router();
const connectionController = require("../controllers/connectionController");
const verifyToken = require("../middlewares/authmiddleware");

// Send a connection request
router.post("/send/:receiverId", verifyToken, connectionController.sendConnectionRequest);

// Accept or reject a request  (body: { action: "accepted" | "rejected" })
router.put("/respond/:connectionId", verifyToken, connectionController.respondToRequest);

// Check connection status with another user
router.get("/status/:otherUserId", verifyToken, connectionController.getConnectionStatus);

// Get all accepted connections
router.get("/my", verifyToken, connectionController.getMyConnections);

module.exports = router;