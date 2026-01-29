const express = require("express");
const router = express.Router();
const { signUpUser, signInUser, logOutUser, refreshAccessToken, googleLogin } = require("./authController");
const isVerifyUser = require("../../middlewares/verifyUser");

router.post("/signup", signUpUser);
router.post("/signin", signInUser);
router.post("/logout",isVerifyUser, logOutUser);
router.get("/refresh",isVerifyUser, refreshAccessToken);

router.post("/google", googleLogin);
module.exports = router;
