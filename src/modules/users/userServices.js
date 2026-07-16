const buildNestedUpdateFields = require("../../utils/buildNestedUpdateFields");
const shuffleArray = require("../../utils/helpers/shuffleArray");
const {
  deleteImageFromCloudinary,
  uploadImageToCloudinary,
} = require("../../utils/ImageUploads/uploadService");
const Comment = require("../posts/commentModel");
const Post = require("../posts/postModel");
const User = require("./userModel");

const getAllUsersService = async (req) => {
  const id = req.user?.id;
  if (!id) throw new Error("USER_ID_REQUIRED");

  const { search, role, online } = req.query;

  const filter = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { username: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }
  if (role) filter.role = role;

  const users = await User.find(filter)
    .select("name username email role isVerified profileImage activeStatus ")
    .sort({ createdAt: -1 });

  const usersArray = shuffleArray(users);
  const userCounts = await User.countDocuments(filter);

  return { users: usersArray, userCounts };
};

const getMyProfileService = async (req) => {
  if (!req.user?.id) throw new Error("UNAUTHORIZE");
  const user = await User.findById(req.user.id).select(" ");

  if (!user) throw new Error("USER_NOT_FOUND");
  return user;
};

const getUsersProfileService = async (req) => {
  if (!req.params?.userId) throw new Error("UNAUTHORIZE");

  const user = await User.findById(req.params.userId).select(
    "-savedPosts -role",
  );

  if (!user) throw new Error("USER_NOT_FOUND");

  return { user };
};

const updateProfileService = async (req) => {
  const { name, username, bio, contactInfo, location } = req.body;

  const id = req.user?.id;
  if (!id) throw new Error("USER_NOT_FOUND");

  const updateFields = {};

  if (typeof name === "string" && name.trim()) {
    updateFields.name = name.trim();
  }

  if (typeof username === "string" && username.trim()) {
    const formattedUsername = username.trim().toLowerCase();

    const exist = await User.findOne({
      username: formattedUsername,
      _id: { $ne: id },
    });

    if (exist) {
      throw new Error("USERNAME_ALREADY_EXISTS");
    }

    updateFields.username = formattedUsername;
  }

  if (typeof bio === "string") {
    updateFields.bio = bio.trim();
  }

  if (contactInfo && typeof contactInfo === "object") {
    buildNestedUpdateFields(contactInfo, "contactInfo", updateFields);
  }

  if (location && typeof location === "object") {
    buildNestedUpdateFields(location, "location", updateFields);
  }

  if (Object.keys(updateFields).length === 0) {
    throw new Error("NO_FIELDS_TO_UPDATE");
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { $set: updateFields },
    { new: true, runValidators: true },
  ).lean();

  if (!updatedUser) {
    throw new Error("USER_NOT_FOUND");
  }

  return updatedUser;
};

const updateUserImageService = async (userId, file, field, folder) => {
  if (!file) throw new Error("No image selected.");

  const user = await User.findById(userId);

  if (!user) throw new Error("User not found.");

  const oldPublicId = user[field]?.publicId;

  const uploadedImage = await uploadImageToCloudinary(file.buffer, folder);
  user[field] = {
    url: uploadedImage.url,
    publicId: uploadedImage.publicId,
  };

  await user.save();

  if (oldPublicId) {
    await deleteImageFromCloudinary(oldPublicId);
  }

  return user;
};






const deleteProfileService = async (userId) => {

  const user = await User.findById(userId);
  if (!user) throw new Error("USER_NOT_FOUND");

  const posts = await Post.find({ author: userId }).select("_id postImg");
  const postIds = posts.map((post) => post._id);

  const imageDeletePromises = [];

  if (user.profileImage?.publicId) {
    imageDeletePromises.push(
      deleteImageFromCloudinary(user.profileImage.publicId)
    );
  }

  if (user.coverImage?.publicId) {
    imageDeletePromises.push(
      deleteImageFromCloudinary(user.coverImage.publicId)
    );
  }

  posts.forEach((post) => {
    if (post.postImg?.publicId) {
      imageDeletePromises.push(
        deleteImageFromCloudinary(post.postImg.publicId)
      );
    }
  });

  await Promise.all(imageDeletePromises);

  const [
    userDeleted,
    postsDeleted,
    userCommentsDeleted,
    postCommentsDeleted,
    postReactsRemoved,
    commentLikesRemoved,
    commentDisLikesRemoved,
    followersFollowingUpdated,
    savedPostsUpdated,
  ] = await Promise.all([

    User.deleteOne({ _id: userId }),
    Post.deleteMany({ author: userId }),
    Comment.deleteMany({ author: userId }),
    Comment.deleteMany({ post: { $in: postIds }, }),

    Post.updateMany(
      { reacts: userId },
      { $pull: { reacts: userId, }, }
    ),

    Comment.updateMany(
      { likes: userId },
      { $pull: { likes: userId, }, }
    ),

    Comment.updateMany(
      { disLikes: userId },
      { $pull: { disLikes: userId, }, }
    ),

    User.updateMany(
      {},
      { $pull: { followers: userId, following: userId,} ,}
    ),

    User.updateMany(
      {},
      { $pull: { savePosts: { $in: postIds, }, }, }
    ),
  ]);

  return {
    success: true,
    message: "Profile deleted successfully.",
    userDeleted: userDeleted.deletedCount,
    postsDeleted: postsDeleted.deletedCount,
    userCommentsDeleted: userCommentsDeleted.deletedCount,
    postCommentsDeleted: postCommentsDeleted.deletedCount,
    postReactsRemoved: postReactsRemoved.modifiedCount,
    commentLikesRemoved: commentLikesRemoved.modifiedCount,
    commentDisLikesRemoved: commentDisLikesRemoved.modifiedCount,
    followersFollowingUpdated: followersFollowingUpdated.modifiedCount,
    savedPostsUpdated: savedPostsUpdated.modifiedCount,
  };
};














const userTimers = new Map();
const activeStatusServicess = async (userId) => {
  if (!userId) throw new Error("USER_ID_REQUIRED");

  const user = await User.findById(userId);
  if (!user) throw new Error("USER_NOT_FOUND");

  if (!user.activeStatus?.online) {
    await User.updateOne(
      { _id: userId },
      {
        $set: {
          "activeStatus.online": true,
          "activeStatus.lastActiveAt": new Date(),
        },
      },
    );
    console.log(`🟢 ${userId} marked online`);
  } else {
    await User.updateOne(
      { _id: userId },
      { $set: { "activeStatus.lastActiveAt": new Date() } },
    );
  }

  if (userTimers.has(userId)) {
    clearTimeout(userTimers.get(userId));
  }

  const timeout = setTimeout(async () => {
    await User.updateOne(
      { _id: userId },
      { $set: { "activeStatus.online": false } },
    );
    userTimers.delete(userId);
    console.log(`⚪ ${userId} marked offline`);
  }, 4000);

  userTimers.set(userId, timeout);

  return { status: "online" };
};

module.exports = {
  getAllUsersService,
  getUsersProfileService,

  getMyProfileService,
  updateProfileService,

  updateUserImageService,

  deleteProfileService,
  activeStatusServicess,
};
