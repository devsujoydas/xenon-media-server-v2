const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const {
    getUsers,
    getProfile,
    updateProfile,
    deleteProfile,
    activeStatus,
} = require("./userController");
const isVerifyUser = require("../../middlewares/verifyUser");


router.get("/", isVerifyUser, getUsers);

router.get("/profile", isVerifyUser, getProfile);
router.put("/profile", isVerifyUser, updateProfile);
router.delete("/profile", isVerifyUser, deleteProfile);



router.post("/active-status", isVerifyUser, activeStatus);


module.exports = router;