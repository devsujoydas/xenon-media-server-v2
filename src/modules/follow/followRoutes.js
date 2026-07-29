const express = require("express");
const {
  followUser,
  getFollowing,
  getFollowers,
  getFollowStatus,
} = require("./followController");
const authorizeRoles = require("../../middlewares/authorizeRoles");
const router = express.Router();

router.patch("/users/:userId/follow",authorizeRoles(), followUser);

router.get("/users/:userId/followers",authorizeRoles(), getFollowers);
router.get("/users/:userId/following",authorizeRoles(), getFollowing);
router.get("/users/:userId/follow-status",authorizeRoles(), getFollowStatus);

module.exports = router;
