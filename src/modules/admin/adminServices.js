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

const updatePostStatusService = async (req) => {
  const { postId } = req.params;
  const { status } = req.body;

  if (!postId) throw new Error("POST_ID_REQUIRED");

  if (!status) throw new Error("STATUS_REQUIRED");

  const validStatus = ["pending", "approved", "rejected"];

  if (!validStatus.includes(status)) {
    throw new Error("INVALID_STATUS");
  }

  const post = await Post.findById(postId);

  if (!post) throw new Error("POST_NOT_FOUND");

  post.status = status;

  await post.save();

  return {
    success: true,
    message: `Post status updated to ${status}.`,
    post,
  };
};

module.exports = {
  makeAdminService,
  removeAdminService,
  updatePostStatusService
};
