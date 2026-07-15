const buildNestedUpdateFields = require("../../utils/buildNestedUpdateFields");
const shuffleArray = require("../../utils/helpers/shuffleArray");
const {
  deleteImageFromCloudinary,
  uploadImageToCloudinary,
} = require("../../utils/ImageUploads/uploadService"); 
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
  if (!file) {
    throw new Error("No image selected.");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  // পুরনো image-এর publicId রেখে দিচ্ছি
  const oldPublicId = user[field]?.publicId;

  // নতুন image upload
  const uploadedImage = await uploadImageToCloudinary(
    file.buffer,
    folder
  );

  // Database update
  user[field] = {
    url: uploadedImage.url,
    publicId: uploadedImage.publicId,
  };

  await user.save();

  // Database save সফল হলে পুরনো image delete
  if (oldPublicId) {
    await deleteImageFromCloudinary(oldPublicId);
  }

  return user;
};








const deleteProfileService = async (req) => {
  const id = req.user.id;

  const user = await User.findById(id);
  if (!user) throw new Error("USER_NOT_FOUND");

  const userDeleted = await User.deleteOne({ _id: id });
  const postsDeleted = await Post.deleteMany({ author: id });
  const likesUpdated = await Post.updateMany(
    { likes: id },
    { $pull: { likes: id } },
  );

  return {
    userDeleted: userDeleted.deletedCount,
    postsDeleted: postsDeleted.deletedCount,
    likesUpdated: likesUpdated.modifiedCount,
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
