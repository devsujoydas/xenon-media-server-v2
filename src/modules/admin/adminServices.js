const Post = require("../posts/postModel");
const User = require("../users/userModel");

/**
 * Make a user admin
 */
const makeAdminService = async (req) => {
  const { userId } = req.params;
  if (!userId) throw new Error("USER_ID_REQUIRED");

  const user = await User.findById(userId);
  if (!user) throw new Error("USER_NOT_FOUND");
  if (user.role === "admin") throw new Error("ALREADY_ADMIN");

  user.role = "admin";
  await user.save();

  return {
    success: true,
    message: `${user.name} promoted to admin.`,
  };
};

const removeAdminService = async (req) => {
  const { userId } = req.params;
  if (!userId) throw new Error("USER_ID_REQUIRED");

  const user = await User.findById(userId);
  if (!user) throw new Error("USER_NOT_FOUND");
  if (user.role !== "admin") throw new Error("NOT_ALLOWED");

  user.role = "user";
  await user.save();

  return {
    success: true,
    message: `${user.name} removed from admin role.`,
  };
};

module.exports = {
  makeAdminService,
  removeAdminService,
};
