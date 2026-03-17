const { Server } = require("socket.io");
const pool = require("./config/db.js");

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:8080", // Aapka frontend URL
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ User connected to socket:", socket.id);

    // --- COMMUNITY CHAT LOGIC ---
    socket.on("join_community", (communityId) => {
      socket.join(communityId);
      console.log(`👤 User joined community room: ${communityId}`);
    });

    socket.on("send_message", async (data) => {
      try {
        const { communityId, sender_name, message_text } = data;
        const query =
          "INSERT INTO community_messages (community_id, sender_name, message_text, created_at) VALUES (?, ?, ?, NOW())";

        const [result] = await pool.execute(query, [communityId, sender_name, message_text]);

        io.to(communityId).emit("receive_message", {
          id: result.insertId,
          communityId,
          sender_name,
          message_text,
          created_at: new Date().toISOString(),
          is_read: 0,
        });
      } catch (err) {
        console.error("❌ Community Socket Error:", err);
      }
    });

    // --- DIRECT MESSAGING (DM) LOGIC ---

    // 1. User ko uski personal ID wale room mein join karwana
    socket.on("join_private", (userId) => {
      const roomName = `user_${userId}`;
      socket.join(roomName);
      console.log(`🔒 User joined private room: ${roomName}`);
    });

    // 2. Personal Message send karna
    socket.on("send_direct_message", async (data) => {
      try {
        const { senderId, receiverId, text } = data;

        // Note: DB insertion hum Routes mein kar rahe hain, 
        // par agar real-time update chahiye toh socket se emit karna zaruri hai.
        
        const messagePayload = {
          sender_id: senderId,
          receiver_id: receiverId,
          message_text: text,
          created_at: new Date().toISOString(),
          is_request: false // Initial logic ke liye
        };

        // Bhejne wale ko dikhao (Self)
        socket.emit("receive_direct_message", messagePayload);

        // Pane wale ko dikhao (Receiver's private room)
        io.to(`user_${receiverId}`).emit("receive_direct_message", messagePayload);

      } catch (err) {
        console.error("❌ Direct Message Socket Error:", err);
      }
    });

    // --- COMMON LOGIC ---

    socket.on("mark_messages_read", async ({ communityId, userId }) => {
      try {
        const sql =
          "UPDATE community_messages SET is_read = 1 WHERE community_id = ? AND sender_name != ?";
        await pool.execute(sql, [communityId, userId]);
        io.to(communityId).emit("messages_marked_read", { communityId });
      } catch (err) {
        console.error("❌ Read Receipt Error:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });

  return io;
};

module.exports = initSocket;