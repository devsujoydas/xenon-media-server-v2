const Post = require("../posts/postModel");
const User = require("../users/userModel");

 
/**
 * Make a user admin
 */
const makeAdminService = async (req) => {
  const { userId } = req.params;

  if (!userId) {
    throw new Error("USER_ID_REQUIRED");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  if (user.role === "admin") {
    throw new Error("ALREADY_ADMIN");
  }

  user.role = "admin";
  await user.save();

  return {
    _id: user._id,
    role: user.role,
  };
};

/**
 * Remove admin role from a user
 */
const removeAdminService = async (req) => {
  const { userId } = req.params;

  if (!userId) {
    throw new Error("USER_ID_REQUIRED");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  if (user.role !== "admin") {
    throw new Error("NOT_ALLOWED");
  }

  user.role = "user";
  await user.save();

  return {
    _id: user._id,
    role: user.role,
  };
};



const deleteUserByAdminService = async (targetUserId, adminUser) => {
  if (adminUser.role !== "admin") throw new Error("UNAUTHORIZED");

  const user = await User.findById(targetUserId);
  if (!user) throw new Error("USER_NOT_FOUND");

  const userDeleted = await User.deleteOne({ _id: targetUserId });
  const postsDeleted = await Post.deleteMany({ author: targetUserId });
  const likesUpdated = await Post.updateMany(
      { likes: targetUserId },
      { $pull: { likes: targetUserId } }
  );

  return {
    userDeleted: userDeleted.deletedCount,
    postsDeleted: postsDeleted.deletedCount,
    likesUpdated: likesUpdated.modifiedCount,
  };
};



module.exports = {
  makeAdminService,
  removeAdminService,
  deleteUserByAdminService,
};
