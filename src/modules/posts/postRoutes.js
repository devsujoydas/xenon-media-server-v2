const express = require("express");
const router = express.Router();
const {
  getPosts,
  deletePost,
  updatePost,
  getPost,
  createPost,
  reactPost,
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



router.get("/", isVerifyUser, getPosts);
router.get("/user/:userId", isVerifyUser, getUserPosts);

router.get("/me", isVerifyUser, getMyPosts);
router.get("/me/saved", isVerifyUser, getMySavedPosts);

router.get("/post/:postId", isVerifyUser, getPost);



router.post("/", isVerifyUser, upload.single("image"), createPost);
router.put("/post/:postId", isVerifyUser, updatePost);
router.delete("/post/:postId", isVerifyUser, deletePost);
router.put("/post/:postId/save", isVerifyUser, savePost);

router.patch("/post/:postId/react", isVerifyUser, toggleReact);

// Comments
router.get("/post/:postId/comments", isVerifyUser, getComments);
router.post("/post/:postId/comment", isVerifyUser, createComment);
router.put("/post/:postId/comments/:commentId", isVerifyUser, updateComment);
router.delete("/post/:postId/comments/:commentId", isVerifyUser, deleteComment);

router.put("/comments/:commentId/like", isVerifyUser, manageLike);
router.put("/comments/:commentId/dislike", isVerifyUser, manageDislike);

module.exports = router;
