const sharp = require("sharp");
const axios = require("axios");

const User = require("./userModel");
const postModel = require("../posts/postModel");
const { getProfileServices, updateUserServices } = require("./userServices");


const userTimers = new Map();
const activeStatus = async (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.onlineStatus) {
      await User.updateOne({ email }, { $set: { onlineStatus: true } });
      console.log(`🟢 ${email} marked online`);
    }

    if (userTimers.has(email)) clearTimeout(userTimers.get(email));

    const timeout = setTimeout(async () => {
      await User.updateOne({ email }, { $set: { onlineStatus: false } });
      userTimers.delete(email);
    }, 4000);

    userTimers.set(email, timeout);
    res.status(200).json({ status: "online" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

const getProfile = async (req, res) => {
  try {
    const user = getProfileServices(req, res)
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

const updateUser = async (req, res) => {
  try {
    const userEmail = req.user?.email;
    const updatedUser = await updateUserServices(userEmail, req.body);

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateUserName = async (req, res) => {
  try {
    const { email, username } = req.body;
    if (!email || !username) return res.status(400).json({ message: "Email and username required" });

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "This username already existed" });

    const result = await User.updateOne({ email }, { $set: { username } });
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}
const deleteUser = async (req, res) => {
  try {
    const email = req.params.email;
    const userDeleted = await User.deleteOne({ email });
    const postsDeleted = await postModel.deleteMany({ author: email });
    const likesUpdated = await postModel.updateMany({}, { $pull: { likes: email } });

    res.status(200).json({
      message: "Account and related data deleted successfully",
      userDeleted: userDeleted.deletedCount,
      postsDeleted: postsDeleted.deletedCount,
      likesUpdated: likesUpdated.modifiedCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}











const search = async (req, res) => {
  try {
    const query = req.query.q || "";
    if (!query.trim()) return res.json({ posts: [], users: [] });

    const email = req.query.email;
    if (!email) return res.status(400).send("Email missing");

    const limit = parseInt(req.query.limit) || 10;
    const regex = new RegExp(query, "i");

    const posts = await postModel.find({ postContent: { $regex: regex } })
      .limit(limit)
      .exec();

    const users = await User.find({
      $and: [
        { $or: [{ name: { $regex: regex } }, { email: { $regex: regex } }] },
        { email: { $ne: email } },
      ],
    })
      .limit(limit)
      .exec();

    res.json({ posts, users });
  } catch (err) {
    console.error("Error in search:", err);
    res.status(500).json({ error: "Server Error" });
  }
};









module.exports = {
  getProfile,
  search,
  activeStatus,
  updateUser,
  updateUserName,
  deleteUser,

};
