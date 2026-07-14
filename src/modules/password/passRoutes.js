const express = require("express");
const router = express.Router();
const {
  requestPasswordReset,
  verifyResetToken,
  resetPassword,
  changePassword,
} = require("./passController");
const isVerifyUser = require("../../middlewares/verifyUser");


// const rateLimit = require("express-rate-limit");
// const resetLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 5,
//   message: "Too many requests, try again later",
// });

router.post("/request-reset",  requestPasswordReset);
router.get("/verify-reset-token", verifyResetToken);
router.post("/reset-password", resetPassword);

router.put("/change-password", isVerifyUser, changePassword);
module.exports = router;
