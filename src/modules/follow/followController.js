const asyncHandler = require("../../utils/errorHandlers/asyncHandler");
const followErrors = require("../../utils/errorHandlers/followErrors");
const {
  followUserService,
  unfollowUserService,
  getFollowersService,
  getFollowingService,
  getFollowStatusService,
} = require("./followServices");

const followUser = asyncHandler(followUserService, followErrors);
const unfollowUser = asyncHandler(unfollowUserService, followErrors);

const getFollowers = asyncHandler(getFollowersService, followErrors);
const getFollowing = asyncHandler(getFollowingService, followErrors);
const getFollowStatus = asyncHandler(getFollowStatusService, followErrors);

module.exports = {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getFollowStatus,
};
