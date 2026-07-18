const express = require("express");
const router = express.Router();
const {
  signUpUser,
  signInUser,
  logOutUser,
  refreshAccessToken,
  googleLogin,
} = require("./authController"); 
const authorizeRoles = require("../../middlewares/authorizeRoles");

router.post("/signup", signUpUser);
router.post("/signin", signInUser);
router.post("/logout", logOutUser);
router.get("/refresh", authorizeRoles(), refreshAccessToken);

router.post("/google", googleLogin);
module.exports = router;
