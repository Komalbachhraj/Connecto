// const express = require("express");
// const cors = require("cors");
// require("dotenv").config();
// const authRoutes = require("./routes/authRoutes");
// const postRoutes=require("./routes/postRoutes");
// const userRoutes = require("./routes/userRoutes");
// const profileRouter = require('./routes/profile');
// const app = express();
// const path = require('path');

// // Middlewares
// app.use(cors());
// // Frontend ko backend se baat karne ki permission dene ke liye
// app.use(express.json()); // Frontend se aane wale JSON data ko samajhne ke liye

// // Routes setup
// // Ab aapke sare auth routes http://localhost:5000/api/auth/... par milenge
// app.use("/api/auth", authRoutes);
// app.use("/api/posts", postRoutes);
// app.use("/api/users",userRoutes);
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use('/api/profile', profileRouter);
// // Ek basic route testing ke liye
// app.get("/", (req, res) => {
//   res.send("Connecto Backend is running! 🚀");
// });

// // Port configuration
// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
//   console.log(`Test it here: http://localhost:${PORT}`);
// });
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const authRoutes         = require("./routes/authRoutes");
const postRoutes         = require("./routes/postRoutes");
const userRoutes         = require("./routes/userRoutes");
const communityRoutes    = require("./routes/communityRoutes");
const connectionRoutes   = require("./routes/connectionRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

// ============================================
// MySQL Connection Pool
// ============================================
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "connecto",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Test database connection
pool.getConnection()
  .then((connection) => {
    console.log("✅ MySQL connected successfully");
    connection.release();
  })
  .catch((err) => {
    console.error("❌ MySQL connection error:", err.message);
    process.exit(1);
  });

// Make pool available globally to routes
global.db = pool;
app.locals.db = pool;

// ============================================
// Middlewares
// ============================================
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Make database available in req object
app.use((req, res, next) => {
  req.db = pool;
  next();
});

// ============================================
// Routes
// ============================================
app.use("/api/auth",          authRoutes);
app.use("/api/posts",         postRoutes);
app.use("/api/users",         userRoutes);
app.use("/api/communities",   communityRoutes);
app.use("/api/connections",   connectionRoutes);
app.use("/api/notifications", notificationRoutes);

// Health check route
app.get("/", (req, res) => {
  res.json({ 
    message: "Connecto Backend is running! 🚀",
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

// API status route
app.get("/api/status", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    
    res.json({
      server: "online",
      database: "connected",
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      server: "online",
      database: "disconnected",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// ============================================
// Error Handling Middleware
// ============================================

// 404 handler - must be after all routes
app.use((req, res, next) => {
  res.status(404).json({ 
    error: "Route not found",
    path: req.path,
    method: req.method
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  
  // MySQL specific error codes
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ error: "Duplicate entry" });
  }
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({ error: "Foreign key constraint failed" });
  }
  
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { 
      stack: err.stack,
      code: err.code 
    })
  });
});

// ============================================
// Server Startup
// ============================================
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log("=".repeat(50));
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🗄️  Database: MySQL`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log("=".repeat(50));
});

// ============================================
// Graceful Shutdown
// ============================================
const gracefulShutdown = async () => {
  console.log("\\n⚠️  Shutting down gracefully...");
  
  server.close(async () => {
    console.log("✅ HTTP server closed");
    
    try {
      await pool.end();
      console.log("✅ MySQL connection pool closed");
      process.exit(0);
    } catch (error) {
      console.error("❌ Error closing MySQL pool:", error);
      process.exit(1);
    }
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.error("⚠️  Forcing shutdown...");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Promise Rejection:", err);
  gracefulShutdown();
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  gracefulShutdown();
});

module.exports = app;