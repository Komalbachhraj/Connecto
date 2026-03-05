// const express = require("express");
// const router = express.Router();
// const postController = require("../controllers/postController");
// const authMiddleware = require("../middlewares/authmiddleware");
// const verifyToken=require("../middlewares/authmiddleware.js");
// router.get(
//   "/:community_id",
//   authMiddleware,
//   postController.getPostsByCommunity,
// );
// router.post("/create", authMiddleware, postController.createPost);
// router.put("/:id/like", authMiddleware, postController.likePost);
// router.get("/:postId/comments", verifyToken, postController.getComments);
// router.post("/:postId/comments", verifyToken, postController.addComment);

// module.exports = router;
const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const authMiddleware = require("../middlewares/authmiddleware");
const verifyToken = require("../middlewares/authmiddleware.js");

// Get all posts for a specific community
router.get(
  "/:community_id",
  authMiddleware,
  postController.getPostsByCommunity
);

// Create a new post (community_id should be in req.body)
router.post("/create", authMiddleware, postController.createPost);

// Like / unlike a post
router.put("/:id/like", authMiddleware, postController.likePost);

// Get comments for a post
router.get("/:postId/comments", verifyToken, postController.getComments);

// Add a comment to a post
router.post("/:postId/comments", verifyToken, postController.addComment);

module.exports = router;