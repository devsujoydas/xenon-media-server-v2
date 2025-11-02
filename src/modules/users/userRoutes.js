const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();



const { getProfile, activeStatus, updateUser, updateUserName, deleteUser } = require("./userController");
const isVerifyUser = require("../../middlewares/verifyUser");

router.post("/activeStatus", activeStatus);
router.get("/profile",isVerifyUser, getProfile);

router.put("/profile/update",isVerifyUser, updateUser);

router.put("/updateUsername", updateUserName);
router.delete("/profile/delete/:email", deleteUser);


module.exports = router;