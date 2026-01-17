const sharp = require("sharp");
const axios = require("axios");

const User = require("./userModel");
const postModel = require("../posts/postModel");
const { getUserServices, updateUserServices, deleteUserService } = require("./userServices");




const getUser = async (req, res) => {
  try {
    const user = getUserServices(req, res)
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

const updateUser = async (req, res) => {
  try {
    const updatedUser = await updateUserServices(req);

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });

  } catch (error) {

    if (error.message === "USERNAME_ALREADY_EXISTS") {
      return res.status(409).json({
        message: "This username already exists",
      });
    }

    if (error.message === "NO_FIELDS_TO_UPDATE") {
      return res.status(400).json({
        message: "No fields provided for update",
      });
    }

    if (error.message === "USER_EMAIL_NOT_FOUND") {
      return res.status(401).json({
        message: "Unauthorized user",
      });
    }

    if (error.message === "USER_NOT_FOUND") {
      return res.status(404).json({
        message: "User not found",
      });
    }

    console.error("Update user error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const result = await deleteUserService(req.user._id);
    return res.status(200).json({
      message: "Account deleted successfully",
      ...result,
    });

  } catch (error) {
    if (error.message === "EMAIL_REQUIRED") {
      return res.status(400).json({ message: "Email is required" });
    }
    if (error.message === "USER_NOT_FOUND") {
      return res.status(404).json({ message: "User not found" });
    }
    console.error("Delete user error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};




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






module.exports = {
  getUser,
  search,
  activeStatus,
  updateUser,
  deleteUser,
};
