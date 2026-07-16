const express = require("express");
const {
  followUser,
  unfollowUser,
  getFollowing,
  getFollowers,
  getFollowStatus,
} = require("./followController");
const authorizeRoles = require("../../middlewares/authorizeRoles");
const router = express.Router();

router.post("/users/:userId/follow",authorizeRoles(), followUser);
router.delete("/users/:userId/follow",authorizeRoles(), unfollowUser);

router.get("/users/:userId/followers",authorizeRoles(), getFollowers);
router.get("/users/:userId/following",authorizeRoles(), getFollowing);
router.get("/users/:userId/follow-status",authorizeRoles(), getFollowStatus);

module.exports = router;
