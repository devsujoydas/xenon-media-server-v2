const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const { getUser, activeStatus, updateUser, deleteUser } = require("./userController");
const isVerifyUser = require("../../middlewares/verifyUser");



router.get("/profile",isVerifyUser, getUser);
router.put("/profile",isVerifyUser, updateUser);
router.delete("/profile",isVerifyUser, deleteUser);

 


router.post("/activeStatus", activeStatus);




module.exports = router;