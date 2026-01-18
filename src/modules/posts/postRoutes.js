const express = require("express");
const router = express.Router();

const userModel = require("../users/userModel");
const postModel = require("./postModel");

const { mongoose } = require("mongoose");
const { getPosts, deletePost, updatePost, getPost, createPost, getUsersPosts, reactPost } = require("./postController");
const isVerifyUser = require("../../middlewares/verifyUser");


router.get("/", isVerifyUser, getPosts);
// router.get("/search=&text=", isVerifyUser, getPosts); for searching post

router.get("/:id", isVerifyUser, getPost);
router.post("/", isVerifyUser, createPost);
router.put("/:id", isVerifyUser, updatePost);
router.delete("/:id", isVerifyUser, deletePost);

router.put("/:id/like", isVerifyUser, reactPost);







router.post("/:postId/comment", async (req, res) => {
  const { postId } = req.params;
  const { userId, text } = req.body;
  if (!text) return res.status(400).json({ message: "Comment cannot be empty" });

  try {
    const post = await postModel.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ user: userId, text });
    await post.save();

    res.status(201).json({ success: true, comments: post.comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:postId/comment", async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await postModel.findById(postId).populate("comments.user", "name profilePhotoUrl username");
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json(post.comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:postId/comment/:commentId", async (req, res) => {
  const { postId, commentId } = req.params;
  try {
    const post = await postModel.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.id(commentId).remove();
    await post.save();

    res.json({ message: "Comment deleted successfully", comments: post.comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
