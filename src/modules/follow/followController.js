const asyncHandler = require("../../utils/errorHandlers/asyncHandler");
const followErrors = require("../../utils/errorHandlers/followErrors");
const { 
  getFollowersService,
  getFollowingService,
  getFollowStatusService,
  toggleFollowService,
} = require("./followServices");

const followUser = asyncHandler(toggleFollowService, followErrors);

const getFollowers = asyncHandler(getFollowersService, followErrors);
const getFollowing = asyncHandler(getFollowingService, followErrors);
const getFollowStatus = asyncHandler(getFollowStatusService, followErrors);

module.exports = {
  followUser,
  getFollowers,
  getFollowing,
  getFollowStatus,
};
