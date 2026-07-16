const mongoose = require("mongoose");
const ServiceError = require("../../utils/errorHandlers/serviceError");
const User = require("../users/userModel");
const { buildPaginationMeta, parsePagination } = require("../../utils/errorHandlers/paginate");

const PUBLIC_PROFILE_FIELDS = "name username profileImage";



const followUserService = async (req) => {
  const currentUserId = req.user?._id;
  const { userId: targetUserId } = req.params;

  if (!targetUserId) throw new ServiceError("USER_ID_REQUIRED");
  if (!mongoose.isValidObjectId(targetUserId))
    throw new ServiceError("TARGET_USER_NOT_FOUND");
  if (String(currentUserId) === String(targetUserId))
    throw new ServiceError("CAN_NOT_FOLLOW_SELF");

  const [currentUser, targetUser] = await Promise.all([
    User.findById(currentUserId).select("_id following").lean(),
    User.findById(targetUserId).select("_id").lean(),
  ]);

  if (!currentUser) throw new ServiceError("CURRENT_USER_NOT_FOUND");
  if (!targetUser) throw new ServiceError("TARGET_USER_NOT_FOUND");

  const alreadyFollowing = currentUser.following?.some(
    (id) => String(id) === String(targetUserId),
  );
  if (alreadyFollowing) throw new ServiceError("ALREADY_FOLLOWING");
 
  await Promise.all([
    User.updateOne(
      { _id: currentUserId },
      { $addToSet: { following: targetUserId } },
    ),
    User.updateOne(
      { _id: targetUserId },
      { $addToSet: { followers: currentUserId } },
    ),
  ]);

  return {
    statusCode: 200,
    message: "User followed successfully.",
    data: { targetUserId: String(targetUserId), isFollowing: true },
  };
};


const unfollowUserService = async (req) => {
  const currentUserId = req.user?._id;
  const { userId: targetUserId } = req.params;

  if (!targetUserId) throw new ServiceError("USER_ID_REQUIRED");
  if (!mongoose.isValidObjectId(targetUserId))
    throw new ServiceError("TARGET_USER_NOT_FOUND");
  if (String(currentUserId) === String(targetUserId))
    throw new ServiceError("CAN_NOT_UNFOLLOW_SELF");

  const [currentUser, targetUser] = await Promise.all([
    User.findById(currentUserId).select("_id following").lean(),
    User.findById(targetUserId).select("_id").lean(),
  ]);

  if (!currentUser) throw new ServiceError("CURRENT_USER_NOT_FOUND");
  if (!targetUser) throw new ServiceError("TARGET_USER_NOT_FOUND");

  const isFollowing = currentUser.following?.some(
    (id) => String(id) === String(targetUserId),
  );
  if (!isFollowing) throw new ServiceError("NOT_FOLLOWING");

  await Promise.all([
    User.updateOne(
      { _id: currentUserId },
      { $pull: { following: targetUserId } },
    ),
    User.updateOne(
      { _id: targetUserId },
      { $pull: { followers: currentUserId } },
    ),
  ]);

  return {
    statusCode: 200,
    message: "User unfollowed successfully.",
    data: { targetUserId: String(targetUserId), isFollowing: false },
  };
};



const getFollowersService = async (req) => {
  const { userId } = req.params;
  if (!mongoose.isValidObjectId(userId))
    throw new ServiceError("TARGET_USER_NOT_FOUND");

  const { page, limit, skip } = parsePagination(req.query);
  const objectId = new mongoose.Types.ObjectId(userId);

  const [countResult, userDoc] = await Promise.all([
    User.aggregate([
      { $match: { _id: objectId } },
      { $project: { count: { $size: { $ifNull: ["$followers", []] } } } },
    ]),
    User.findById(userId)
      .select("followers")
      .slice("followers", [skip, limit])
      .populate({ path: "followers", select: PUBLIC_PROFILE_FIELDS })
      .lean(),
  ]);

  if (!userDoc) throw new ServiceError("TARGET_USER_NOT_FOUND");

  const totalFollowers = countResult[0]?.count || 0;
  const meta = buildPaginationMeta({ totalItems: totalFollowers, page, limit });

  return {
    statusCode: 200,
    message: "Followers fetched successfully.",
    data: {
      followers: userDoc.followers,
      totalFollowers: meta.totalItems,
      totalPages: meta.totalPages,
      currentPage: meta.currentPage,
      hasNextPage: meta.hasNextPage,
      hasPrevPage: meta.hasPrevPage,
    },
  };
};


const getFollowingService = async (req) => {
  const { userId } = req.params;
  if (!mongoose.isValidObjectId(userId))
    throw new ServiceError("TARGET_USER_NOT_FOUND");

  const { page, limit, skip } = parsePagination(req.query);
  const objectId = new mongoose.Types.ObjectId(userId);

  const [countResult, userDoc] = await Promise.all([
    User.aggregate([
      { $match: { _id: objectId } },
      { $project: { count: { $size: { $ifNull: ["$following", []] } } } },
    ]),
    User.findById(userId)
      .select("following")
      .slice("following", [skip, limit])
      .populate({ path: "following", select: PUBLIC_PROFILE_FIELDS })
      .lean(),
  ]);

  if (!userDoc) throw new ServiceError("TARGET_USER_NOT_FOUND");

  const totalFollowing = countResult[0]?.count || 0;
  const meta = buildPaginationMeta({ totalItems: totalFollowing, page, limit });

  return {
    statusCode: 200,
    message: "Following list fetched successfully.",
    data: {
      following: userDoc.following,
      totalFollowing: meta.totalItems,
      totalPages: meta.totalPages,
      currentPage: meta.currentPage,
      hasNextPage: meta.hasNextPage,
      hasPrevPage: meta.hasPrevPage,
    },
  };
};

const getFollowStatusService = async (req) => {
  const currentUserId = req.user?._id;
  const { userId: targetUserId } = req.params;

  if (!mongoose.isValidObjectId(targetUserId))
    throw new ServiceError("TARGET_USER_NOT_FOUND");

  if (String(currentUserId) === String(targetUserId)) {
    return {
      statusCode: 200,
      message: "Follow status fetched successfully.",
      data: { isFollowing: false },
    };
  }

  const [targetExists, isFollowing] = await Promise.all([
    User.exists({ _id: targetUserId }),
    User.exists({ _id: currentUserId, following: targetUserId }),
  ]);

  if (!targetExists) throw new ServiceError("TARGET_USER_NOT_FOUND");

  return {
    statusCode: 200,
    message: "Follow status fetched successfully.",
    data: { isFollowing: !!isFollowing },
  };
};



module.exports = {
  followUserService,
  unfollowUserService,
  getFollowersService,
  getFollowingService,
  getFollowStatusService,
};
