const express = require("express");
const router = express.Router();
const { requestPasswordReset, verifyResetToken, resetPassword } = require("./passController");



router.post("/request-reset", requestPasswordReset);
router.get("/verify-reset-token", verifyResetToken);
router.post("/reset-password", resetPassword);

module.exports = router;
