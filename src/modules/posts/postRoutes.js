const express = require("express");
const router = express.Router();

const {
  getPosts,
  deletePost,
  updatePost,
  getPost,
  createPost,
  getMyPosts,
  getUserPosts,
  savePost,
  getMySavedPosts,
  createComment,
  deleteComment,
  getComments,
  updateComment,
  manageDislike,
  manageLike,
  toggleReact,
} = require("./postController");

const isVerifyUser = require("../../middlewares/verifyUser");
const upload = require("../../utils/ImageUploads/multer");

// ---------------- POSTS: read ----------------
router.get("/", isVerifyUser, getPosts);
router.get("/user/:userId", isVerifyUser, getUserPosts);
router.get("/me", isVerifyUser, getMyPosts);
router.get("/me/saved", isVerifyUser, getMySavedPosts);
router.get("/post/:postId", isVerifyUser, getPost);

// ---------------- POSTS: write ----------------
router.post("/", isVerifyUser, upload.single("image"), createPost);
router.put("/post/:postId", isVerifyUser, upload.single("image"), updatePost);
router.delete("/post/:postId", isVerifyUser, deletePost);
router.put("/post/:postId/save", isVerifyUser, savePost);

// ---------------- REACT ----------------
router.patch("/post/:postId/react", isVerifyUser, toggleReact);

// ---------------- COMMENTS ----------------
router.get("/post/:postId/comments", isVerifyUser, getComments);
router.post("/post/:postId/comment", isVerifyUser, createComment);

router.put("/comment/:commentId", isVerifyUser, updateComment);
router.delete("/comment/:commentId", isVerifyUser, deleteComment);
router.put("/comment/:commentId/like", isVerifyUser, manageLike);
router.put("/comment/:commentId/dislike", isVerifyUser, manageDislike);

module.exports = router;
