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
  uploadProfilePhoto,
  uploadCoverPhoto,
} = require("./userController");
const isVerifyUser = require("../../middlewares/verifyUser");
const upload = require("../../utils/ImageUploads/multer");
const multerErrorHandler = require("../../utils/ImageUploads/multerErrorHandler");

router.get("/", isVerifyUser, getUsers);
router.get("/profile", isVerifyUser, getMyProfile);
router.get("/profile/:userId", isVerifyUser, getUsersProfile);

router.put(
  "/profile/profile-photo",
  isVerifyUser,
  upload.single("image"),
  multerErrorHandler,
  uploadProfilePhoto
);

router.put(
  "/profile/cover-photo",
  isVerifyUser,
  upload.single("image"),
  multerErrorHandler,
  uploadCoverPhoto
);

router.put("/profile", isVerifyUser, updateProfile);
router.delete("/profile", isVerifyUser, deleteProfile);

router.post("/active-status", isVerifyUser, activeStatus);

module.exports = router;
