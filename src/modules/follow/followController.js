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

module.exports = {
  followUser,
  getFollowers,
  getFollowing,
  
};
