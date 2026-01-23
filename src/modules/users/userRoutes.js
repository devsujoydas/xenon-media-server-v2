const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
    getUsers,
    getMyProfile,
    updateProfile,
    deleteProfile,
    activeStatus,
    getUsersProfile,
} = require("./userController");
const isVerifyUser = require("../../middlewares/verifyUser");


router.get("/", isVerifyUser, getUsers);
router.get("/profile", isVerifyUser, getMyProfile);

router.get("/:userId", isVerifyUser, getUsersProfile);

router.put("/profile", isVerifyUser, updateProfile);
router.delete("/profile", isVerifyUser, deleteProfile);



router.post("/active-status", isVerifyUser, activeStatus);


module.exports = router;