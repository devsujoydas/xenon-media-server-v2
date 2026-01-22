const express = require("express");
const router = express.Router();
const { getPosts, deletePost, updatePost, getPost, createPost, reactPost, getMyPosts, getUserPosts, savePost ,getMySavedPosts, createComment, deleteComment, getComments, updateComment } = require("./postController");
const isVerifyUser = require("../../middlewares/verifyUser");


router.get("/", isVerifyUser, getPosts);
router.get("/user/:userId", isVerifyUser, getUserPosts);

router.get("/me", isVerifyUser, getMyPosts);
router.get("/me/saved", isVerifyUser, getMySavedPosts);

router.get("/:postid", isVerifyUser, getPost);

router.post("/", isVerifyUser, createPost);
router.put("/:id", isVerifyUser, updatePost);
router.delete("/:id", isVerifyUser, deletePost);


router.put("/:id/like", isVerifyUser, reactPost);
router.put("/:id/save", isVerifyUser, savePost);



// Comments
router.get("/:postId/comments", getComments)
router.post("/:postId/comment", isVerifyUser, createComment)
router.put("/:postId/:commentId", isVerifyUser, updateComment);
router.delete("/:postId/:commentId", isVerifyUser, deleteComment)

 

module.exports = router;
