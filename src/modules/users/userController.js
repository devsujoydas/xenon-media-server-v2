const User = require("./userModel");
const { getUserServices, updateUserServices, deleteUserService, getAllUsersServices, activeStatusServicess } = require("./userServices");



const getUsers = async (req, res) => {
  try {
    const { users, userCounts } = await getAllUsersServices(req)
    res.json({ userCounts, users });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
}

const getUser = async (req, res) => {
  try {
    const user = await getUserServices(req) 
    res.status(200).json(user);
  } catch (error) {
    if (error.message === "UNAUTHORIZE") {
      return res.status(400).json({ message: "Unauthorized" });
    }
    if (error.message === "USER_NOT_FOUND") {
      return res.status(400).json({ message: "User not found" });
    }
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
    const result = await deleteUserService(req);
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

const activeStatus = async (req, res) => {




 

  const userId = req.user.id;

  try {
    const result = await activeStatusServicess(userId);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    if (err.message === "USER_ID_REQUIRED") {
      return res.status(400).json({ message: err.message });
    }
    if (err.message === "USER_NOT_FOUND") {
      return res.status(404).json({ message: err.message });
    }
    res.status(500).json({ message: "SERVER_ERROR" });
  }
};








module.exports = {
  getUsers,
  getUser,
  activeStatus,
  updateUser,
  deleteUser,
};
