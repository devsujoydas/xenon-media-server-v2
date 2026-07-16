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
const upload = require("../../utils/ImageUploads/multer");
const multerErrorHandler = require("../../utils/ImageUploads/multerErrorHandler");
const authorizeRoles = require("../../middlewares/authorizeRoles");

router.get("/", authorizeRoles(), getUsers);
router.get("/profile", authorizeRoles(), getMyProfile);
router.get("/profile/:userId", authorizeRoles(), getUsersProfile);

router.put(
  "/profile/profile-photo",
  authorizeRoles(),
  upload.single("image"),
  multerErrorHandler,
  uploadProfilePhoto,
);

router.put(
  "/profile/cover-photo",
  authorizeRoles(),
  upload.single("image"),
  multerErrorHandler,
  uploadCoverPhoto,
);

router.put("/profile", authorizeRoles(), updateProfile);
router.delete("/profile", authorizeRoles(), deleteProfile);

router.post("/active-status", authorizeRoles(), activeStatus);

module.exports = router;
