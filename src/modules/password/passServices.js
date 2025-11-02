const crypto = require('crypto');
const bcrypt = require('bcryptjs'); 
const sendEmail = require('../../utils/sendEmail');
const passwordResetTemplate = require('../../utils/emailTemplates/passwordResetTemplate');
const User = require('../users/userModel');

const createHash = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

const requestPasswordResetService = async (email, frontendBaseUrl) => {
  const user = await User.findOne({ email });
  if (!user) {
    return "If an account with that email exists, a reset link has been sent.";
  }

  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = createHash(rawToken);

  user.passwordReset = {
    token: hashedToken,
    expires: Date.now() + 10 * 60 * 1000
  };
  await user.save();

  const resetUrl = `${frontendBaseUrl}/reset-password?token=${rawToken}`;

  await sendEmail(
    email,
    "Password Reset Request",
    passwordResetTemplate(resetUrl)
  );

  return "If an account with that email exists, a reset link has been sent.";
};

const verifyResetTokenService = async (rawToken) => {
  const hashedToken = createHash(rawToken);

  const user = await User.findOne({
    'passwordReset.token': hashedToken,
    'passwordReset.expires': { $gt: Date.now() }
  });

  if (!user) throw new Error('Invalid or expired reset link');
  return 'Reset link valid';
};

const resetPasswordService = async (token, newPassword, confirmNewPassword) => {

  if (!token) throw new Error("Token is required");

  if (!newPassword || !confirmNewPassword) throw new Error("Both newPassword and confirmNewPassword are required");

  if (newPassword !== confirmNewPassword) throw new Error("Passwords do not match");

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    "passwordReset.token": hashedToken,
    "passwordReset.expires": { $gt: Date.now() },
  });

  if (!user) throw new Error("Invalid or expired reset link");

  user.password = await bcrypt.hash(newPassword, 10);
  user.passwordReset = { token: null, expires: null };
  await user.save();

  return "Password reset successful";
};

module.exports = {
  requestPasswordResetService,
  verifyResetTokenService,
  resetPasswordService
};
