const {
  deletePostServices,
  deleteCommentService,
} = require("../posts/postServices");
const { deleteProfileService } = require("../users/userServices");
const {
  makeAdminService,
  removeAdminService,
  deleteUserByAdminService,
  updatePostStatusService,
} = require("./adminServices");

const handleAdminError = (res, error, action) => {
  console.error(`Admin ${action} error:`, error.message);

  switch (error.message) {
    case "USER_NOT_FOUND":
      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    case "NOT_ALLOWED":
      return res.status(403).json({
        success: false,
        message: "You are not allowed to perform this action",
      });

    case "ALREADY_ADMIN":
      return res.status(409).json({
        success: false,
        message: "User is already an admin",
      });

    default:
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
  }
};

const makeAdmin = async (req, res) => {
  try {
    const result = await makeAdminService(req);

    return res.status(200).json(result);
  } catch (error) {
    return handleAdminError(res, error, "make admin");
  }
};

const removeAdmin = async (req, res) => {
  try {
    const result = await removeAdminService(req);

    return res.status(200).json(result);
  } catch (error) {
    return handleAdminError(res, error, "remove admin");
  }
};



const updatePostStatus = async (req, res) => {
  try {
    const result = await updatePostStatusService(req);

    return res.status(200).json(result);
  } catch (error) {
    if (error.message === "POST_ID_REQUIRED") {
      return res.status(400).json({
        message: "Post ID is required",
      });
    }

    if (error.message === "STATUS_REQUIRED") {
      return res.status(400).json({
        message: "Status is required",
      });
    }

    if (error.message === "INVALID_STATUS") {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    if (error.message === "POST_NOT_FOUND") {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    console.error("Update post status error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};



const deleteUserByAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await deleteProfileService(userId);

    return res.status(200).json({
      message: "User account deleted successfully",
      ...result,
    });
  } catch (error) {
    if (error.message === "USER_NOT_FOUND") {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (error.message === "CAN_NOT_DELETE_ADMIN") {
      return res.status(403).json({
        message: "You cannot delete another admin",
      });
    }

    if (error.message === "CAN_NOT_DELETE_CEO") {
      return res.status(403).json({
        message: "CEO account cannot be deleted",
      });
    }

    console.error("Delete user by admin error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

const deletePostByAdmin = async (req, res) => {
  try {
    const deletedPost = await deletePostServices(req.user, req.params.postId);
    res.status(200).json(deletedPost);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const deleteCommentByAdmin = async (req, res) => {
  try {
    const result = await deleteCommentService(req);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = {
  makeAdmin,
  removeAdmin,
  deleteUserByAdmin,
  deletePostByAdmin,
  deleteCommentByAdmin,
  updatePostStatus
};
