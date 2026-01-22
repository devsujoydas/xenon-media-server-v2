const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const sendEmail = require('../../utils/sendEmail');
const passwordResetTemplate = require('../../utils/emailTemplates/passwordResetTemplate');
const User = require('../users/userModel');
const { FRONTEND_URL } = require('../../configs/config');



const createHash = (str) => {
  return crypto.createHash("sha256").update(str).digest("hex");
};


const requestPasswordResetService = async (email) => {
  if (!email) throw new Error("EMAIL_REQUIRED");

  const user = await User.findOne({ email });
  if (!user) {
    return "If an account with that email exists, a reset link has been sent.";
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = createHash(rawToken);

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; 
  await user.save();

  const resetUrl = `${FRONTEND_URL}/reset-password?token=${rawToken}`;

  await sendEmail(
    email,
    "Password Reset Request",
    passwordResetTemplate(resetUrl)
  );

  return "If an account with that email exists, a reset link has been sent.";
};

const verifyResetTokenService = async (token) => {
  if (!token) throw new Error("INVALID_TOKEN");

  const hashedToken = createHash(token);

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) throw new Error("INVALID_OR_EXPIRED_RESET_LINK");

  return "Reset link is valid";
};

const resetPasswordService = async (token, newPassword, confirmNewPassword) => {
  if (!token) throw new Error("TOKEN_REQUIRED");
  if (!newPassword || !confirmNewPassword || newPassword !== confirmNewPassword) {
    throw new Error("PASSWORDS_INVALID_OR_MISMATCH");
  }

  const hashedToken = createHash(token);

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) throw new Error("INVALID_OR_EXPIRED_RESET_LINK");

  user.password = await bcrypt.hash(newPassword, 10); 
  user.passwordResetToken = null;
  user.passwordResetExpires = null;

  await user.save();

  return "Password reset successful";
};


module.exports = {
  requestPasswordResetService,
  verifyResetTokenService,
  resetPasswordService
};
