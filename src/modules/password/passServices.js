const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendEmail = require("../../utils/sendEmail");
const passwordResetTemplate = require("../../utils/emailTemplates/passwordResetTemplate");
const User = require("../users/userModel");
const { FRONTEND_URL, JWT_SECRET } = require("../../configs/config");
const verifyPassResetToken = require("../../utils/verifyPassResetToken");



const requestPasswordResetService = async (email) => {
  if (!email) throw new Error("EMAIL_REQUIRED");

  const user = await User.findOne({ email });
  if (!user) return "If an account with that email exists, a reset link has been sent.";

  const resetToken = jwt.sign({ id: user._id, type: "reset" }, JWT_SECRET, { expiresIn: '5m' });
  const resetUrl = `${FRONTEND_URL}/reset-password?token=${resetToken}`;


  await sendEmail(email, "Password Reset Request", passwordResetTemplate(resetUrl));

  return "If an account with that email exists, a reset link has been sent.";
};

const verifyResetTokenService = async (req) => {

  const token = req.query.token
  if (!token) throw new Error("TOKEN_REQUIRED");

  const userId = verifyPassResetToken(token);

  const user = await User.findById(userId);
  if (!user) throw new Error("USER_NOT_FOUND");

  return "Reset link is valid";
};

const resetPasswordService = async (token, newPassword, confirmNewPassword) => {
  if (!token) throw new Error("TOKEN_REQUIRED");
  if (!newPassword || !confirmNewPassword || newPassword !== confirmNewPassword) {
    throw new Error("PASSWORDS_INVALID_OR_MISMATCH");
  }

  const userId = verifyPassResetToken(token);
  const user = await User.findById(userId);
  if (!user) throw new Error("USER_NOT_FOUND");

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  return "Password reset successful";
};



module.exports = {
  requestPasswordResetService,
  verifyResetTokenService,
  resetPasswordService, 
};
