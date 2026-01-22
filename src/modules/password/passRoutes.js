const express = require("express");
const { requestPasswordReset, verifyResetToken, resetPassword } = require("./passController");


const router = express.Router();

router.post("/request-reset", requestPasswordReset);
router.get("/verify-reset-token", verifyResetToken);
router.post("/reset-password", resetPassword);

module.exports = router;
