const express = require("express");
const router = express.Router();
const { getPosts, deletePost, updatePost, getPost, createPost, reactPost, getMyPosts, getUserPosts, savePost } = require("./postController");
const isVerifyUser = require("../../middlewares/verifyUser");


router.get("/", isVerifyUser, getPosts);
router.get("/me", isVerifyUser, getMyPosts);
router.get("/:postid", isVerifyUser, getPost);
router.get("/user/:userId", isVerifyUser, getUserPosts);


router.post("/", isVerifyUser, createPost);
router.put("/:id", isVerifyUser, updatePost);
router.delete("/:id", isVerifyUser, deletePost);


router.put("/:id/like", isVerifyUser, reactPost);
router.put("/:id/save", isVerifyUser, savePost);





// router.post("/:postId/comment", async (req, res) => {
//   const { postId } = req.params;
//   const { userId, text } = req.body;
//   if (!text) return res.status(400).json({ message: "Comment cannot be empty" });

//   try {
//     const post = await Post.findById(postId);
//     if (!post) return res.status(404).json({ message: "Post not found" });

//     post.comments.push({ user: userId, text });
//     await post.save();

//     res.status(201).json({ success: true, comments: post.comments });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// router.get("/:postId/comment", async (req, res) => {
//   const { postId } = req.params;
//   try {
//     const post = await Post.findById(postId).populate("comments.user", "name profilePhotoUrl username");
//     if (!post) return res.status(404).json({ message: "Post not found" });

//     res.json(post.comments);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// router.delete("/:postId/comment/:commentId", async (req, res) => {
//   const { postId, commentId } = req.params;
//   try {
//     const post = await Post.findById(postId);
//     if (!post) return res.status(404).json({ message: "Post not found" });

//     post.comments.id(commentId).remove();
//     await post.save();

//     res.json({ message: "Comment deleted successfully", comments: post.comments });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });


module.exports = router;
