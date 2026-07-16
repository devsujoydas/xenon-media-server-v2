const express = require("express");
const { makeAdmin, removeAdmin, deleteUserByAdmin, deletePostByAdmin, deleteCommentByAdmin } = require("./adminControllers");
const authorizeRoles = require("../../middlewares/authorizeRoles");
const router = express.Router()


router.put("/make/:userId", authorizeRoles("admin"), makeAdmin);
router.put("/remove/:userId", authorizeRoles("admin"), removeAdmin);

router.delete("/users/:userId", authorizeRoles("admin"), deleteUserByAdmin);
router.delete("/posts/:postId", authorizeRoles("admin"), deletePostByAdmin);
router.delete("/comments/:commentId", authorizeRoles("admin"), deleteCommentByAdmin);

module.exports = router 