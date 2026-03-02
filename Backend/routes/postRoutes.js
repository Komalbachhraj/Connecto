const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const authMiddleware = require("../middlewares/authmiddleware");
const verifyToken=require("../middlewares/authmiddleware.js");
router.get(
  "/:community_id",
  authMiddleware,
  postController.getPostsByCommunity,
);
router.post("/create", authMiddleware, postController.createPost);
router.put("/:id/like", authMiddleware, postController.likePost);
router.get("/:postId/comments", verifyToken, postController.getComments);
router.post("/:postId/comments", verifyToken, postController.addComment);

module.exports = router;
