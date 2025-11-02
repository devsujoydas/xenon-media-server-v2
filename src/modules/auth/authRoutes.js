const express = require("express");
const router = express.Router();
const { signUpUser, signInUser, signInWithGoogle, logOutUser, refreshAccessToken } = require("./authController");

router.post("/signup", signUpUser);
router.post("/signin", signInUser);
router.post("/signInWithGoogle", signInWithGoogle);

router.post("/logout", logOutUser);
router.get("/refresh", refreshAccessToken);


module.exports = router;
