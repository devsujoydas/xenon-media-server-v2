const express = require("express");
const router = express.Router();

const {
  requestPasswordReset,
  verifyResetToken,
  resetPassword,
} = require("./passController");

 
router.post("/forgot-password", requestPasswordReset);
router.get("/reset-password", verifyResetToken);
router.post("/reset-password", resetPassword);

module.exports = router;
