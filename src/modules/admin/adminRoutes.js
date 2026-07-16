const express = require("express");
const { makeAdmin, removeAdmin, deleteUserByAdmin, deletePostByAdmin, deleteCommentByAdmin, updatePostStatus } = require("./adminControllers");
const authorizeRoles = require("../../middlewares/authorizeRoles");
const router = express.Router()


router.put("/make/:userId", authorizeRoles("admin", "ceo"), makeAdmin);
router.put("/remove/:userId", authorizeRoles("admin", "ceo"), removeAdmin);

router.patch( "/posts/:postId/status", authorizeRoles("admin", "ceo"), updatePostStatus );

router.delete("/users/:userId", authorizeRoles("admin", "ceo"), deleteUserByAdmin);
router.delete("/posts/:postId", authorizeRoles("admin", "ceo"), deletePostByAdmin);
router.delete("/comments/:commentId", authorizeRoles("admin", "ceo"), deleteCommentByAdmin);

module.exports = router 