const express = require("express");
const { makeAdmin, removeAdmin, deleteUserByAdmin, deletePostByAdmin, deleteCommentByAdmin } = require("./adminControllers");
const isVerifyAdmin = require("../../middlewares/verifyAdmin");
const router = express.Router()


router.put("/make/:userId", isVerifyAdmin, makeAdmin);
router.put("/remove/:userId", isVerifyAdmin, removeAdmin);
router.delete("/users/:userId", isVerifyAdmin, deleteUserByAdmin);
router.delete("/posts/:postId", isVerifyAdmin, deletePostByAdmin);
router.delete("/posts/:postId/:commentId", isVerifyAdmin, deleteCommentByAdmin);

module.exports = router 