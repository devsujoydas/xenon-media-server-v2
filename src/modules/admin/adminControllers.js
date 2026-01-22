const { deletePostServices, deleteCommentService } = require("../posts/postServices");
const {
    makeAdminService,
    removeAdminService,
    deleteUserByAdminService,
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

        return res.status(200).json({
            success: true,
            message: "User promoted to admin successfully",
            data: result,
        });

    } catch (error) {
        return handleAdminError(res, error, "make admin");
    }
};

const removeAdmin = async (req, res) => {
    try {
        const result = await removeAdminService(req);

        return res.status(200).json({
            success: true,
            message: "Admin role removed successfully",
            data: result,
        });

    } catch (error) {
        return handleAdminError(res, error, "remove admin");
    }
};

const deleteUserByAdmin = async (req, res) => {
    try {
        const { userId } = req.params;
        const adminUser = req.user;

        const result = await deleteUserByAdminService(userId, adminUser);

        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: result,
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to delete user",
        });
    }
};

const deletePostByAdmin = async (req, res) => {
    try {
        const deletedPost = await deletePostServices(req);
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
    deleteCommentByAdmin
};
