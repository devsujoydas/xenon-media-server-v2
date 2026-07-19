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
  toggleReact,
  manageCommentLike,
  manageCommentDislike,
} = require("./postController");
 
const upload = require("../../utils/ImageUploads/multer");
const authorizeRoles = require("../../middlewares/authorizeRoles");

// ---------------- POSTS: read ----------------
router.get("/", authorizeRoles(), getPosts);
router.get("/user/:userId", authorizeRoles(), getUserPosts);
router.get("/me", authorizeRoles(), getMyPosts);
router.get("/me/saved", authorizeRoles(), getMySavedPosts);
router.get("/post/:postId", authorizeRoles(), getPost);

// ---------------- POSTS: write ----------------
router.post("/", authorizeRoles(), upload.single("image"), createPost);
router.put("/post/:postId", authorizeRoles(), upload.single("image"), updatePost);
router.delete("/post/:postId", authorizeRoles(), deletePost);
router.put("/post/:postId/save", authorizeRoles(), savePost);

// ---------------- REACT ----------------
router.patch("/post/:postId/react", authorizeRoles(), toggleReact);

// ---------------- COMMENTS ----------------
router.get("/post/:postId/comments", authorizeRoles(), getComments);
router.post("/post/:postId/comment", authorizeRoles(), createComment);

router.put("/comment/:commentId", authorizeRoles(), updateComment);
router.delete("/comment/:commentId", authorizeRoles(), deleteComment);
router.put("/comment/:commentId/like", authorizeRoles(), manageCommentLike);
router.put("/comment/:commentId/dislike", authorizeRoles(), manageCommentDislike);

module.exports = router;
