const buildNestedUpdateFields = require("../../utils/buildNestedUpdateFields");
const shuffleArray = require("../../utils/shuffleArray");
const Post = require("../posts/postModel");
const User = require("./userModel");


const getAllUsersService = async (req) => {
  const id = req.user?.id;
  if (!id) throw new Error("USER_ID_REQUIRED");

  const { search, role, status } = req.query;

  const filter = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { username: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } }
    ];
  }
  if (role) filter.role = role;
  if (status) filter.status = status;

  const users = await User.find(filter)
    .select("name username email role profile contactInfo location activeStatus myFriends") 
    .sort({ createdAt: -1 });


  const mappedUsers = users.map(user => ({
    _id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
    profile: user.profile,
    contactInfo: user.contactInfo,
    location: user.location,
    activeStatus: user.activeStatus,
    friendCount: user.myFriends.length,
  }));

  const usersArray = shuffleArray(mappedUsers)

  const userCounts = await User.countDocuments(filter);

  return { users: usersArray, userCounts };
};



const getMyProfileService = async (req) => {
  if (!req.user?.id) throw new Error("UNAUTHORIZE");
 
  const user = await User.findById(req.user.id)
    .select("name username email role profile contactInfo location activeStatus myFriends ");

  if (!user) throw new Error("USER_NOT_FOUND");

  return {
     _id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
    profile: user.profile,
    contactInfo: user.contactInfo,
    location: user.location,
    activeStatus: user.activeStatus,
    friendCount: user.myFriends.length,
  };
};


const getUsersProfileService = async (req) => {
  if (!req.params?.userId) throw new Error("UNAUTHORIZE");
 
  const user = await User.findById(req.params.userId)
    .select("name username email role profile contactInfo location activeStatus myFriends ");

  if (!user) throw new Error("USER_NOT_FOUND");

  return {
    _id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
    profile: user.profile,
    contactInfo: user.contactInfo,
    location: user.location,
    activeStatus: user.activeStatus,
    friendCount: user.myFriends.length,
  };
}

const updateProfileService = async (req) => {
  const { name, username, profile, contactInfo, socialLinks, location } = req.body;

  const id = req.user?.id;
  if (!id) { throw new Error("USER_EMAIL_NOT_FOUND"); }

  const updateFields = {};

  if (name && name.trim() !== "") {
    updateFields.name = name;
  }

  if (username && username.trim() !== "") {
    const exist = await User.findOne({ username, _id: { $ne: id } });
    if (exist) throw new Error("USERNAME_ALREADY_EXISTS");
    updateFields.username = username;
  }

  buildNestedUpdateFields(profile, "profile", updateFields);
  buildNestedUpdateFields(socialLinks, "socialLinks", updateFields);
  buildNestedUpdateFields(contactInfo, "contactInfo", updateFields);
  buildNestedUpdateFields(location, "location", updateFields);

  if (Object.keys(updateFields).length === 0) {
    throw new Error("NO_FIELDS_TO_UPDATE");
  }

  const updatedUser = await User.findOneAndUpdate(
    { _id: id },
    { $set: updateFields },
    { new: true }
  ).select("-refreshToken");

  if (!updatedUser) { throw new Error("USER_NOT_FOUND"); }
  return updatedUser;
};

const deleteProfileService = async (req) => {
  const id = req.user.id

  const user = await User.findById(id);
  if (!user) { throw new Error("USER_NOT_FOUND"); }

  const userDeleted = await User.deleteOne({ _id: id });
  const postsDeleted = await Post.deleteMany({ author: id });
  const likesUpdated = await Post.updateMany(
    { likes: id },
    { $pull: { likes: id } }
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
      { $set: { "activeStatus.online": true, "activeStatus.lastActiveAt": new Date() } }
    );
    console.log(`🟢 ${userId} marked online`);
  } else {

    await User.updateOne(
      { _id: userId },
      { $set: { "activeStatus.lastActiveAt": new Date() } }
    );
  }

  if (userTimers.has(userId)) {
    clearTimeout(userTimers.get(userId));
  }

  const timeout = setTimeout(async () => {
    await User.updateOne(
      { _id: userId },
      { $set: { "activeStatus.online": false } }
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
  deleteProfileService,
  activeStatusServicess,
}