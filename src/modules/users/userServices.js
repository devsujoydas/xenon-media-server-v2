const buildNestedUpdateFields = require("../../utils/buildNestedUpdateFields");
const postModel = require("../posts/postModel");
const User = require("./userModel");


const getUserServices = (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const user = req.user;
  return user
}

const updateUserServices = async (req) => {
  const { name, username, profile, socialLinks, location } = req.body;

  const email = req.user?.email;
  if (!email) { throw new Error("USER_EMAIL_NOT_FOUND"); }

  const updateFields = {};

  if (name && name.trim() !== "") {
    updateFields.name = name;
  }

  if (username && username.trim() !== "") {
    const exist = await User.findOne({ username, email: { $ne: email } });
    if (exist) throw new Error("USERNAME_ALREADY_EXISTS");
    updateFields.username = username;
  }

  buildNestedUpdateFields(profile, "profile", updateFields);
  buildNestedUpdateFields(socialLinks, "socialLinks", updateFields);
  buildNestedUpdateFields(location, "location", updateFields);

  if (Object.keys(updateFields).length === 0) {
    throw new Error("NO_FIELDS_TO_UPDATE");
  }

  const updatedUser = await User.findOneAndUpdate(
    { email },
    { $set: updateFields },
    { new: true }
  );

  if (!updatedUser) { throw new Error("USER_NOT_FOUND"); }
  return updatedUser;
};

const deleteUserService = async (id) => {
  if (!id) {
    throw new Error("USER_ID_REQUIRED");
  }

  const user = await User.findById(id);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const userDeleted = await User.deleteOne({ _id: id });
  const postsDeleted = await postModel.deleteMany({ author: id });
  const likesUpdated = await postModel.updateMany(
    { likes: id },
    { $pull: { likes: id } }
  );

  return {
    userDeleted: userDeleted.deletedCount,
    postsDeleted: postsDeleted.deletedCount,
    likesUpdated: likesUpdated.modifiedCount,
  };
};






module.exports = { getUserServices, updateUserServices, deleteUserService }