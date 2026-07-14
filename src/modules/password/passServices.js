const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendEmail = require("../../utils/sendEmail");
const passwordResetTemplate = require("../../utils/emailTemplates/passwordResetTemplate");
const User = require("../users/userModel");
const { FRONTEND_URL, JWT_SECRET } = require("../../configs/config");
const verifyPassResetToken = require("../../utils/verifyPassResetToken");

const requestPasswordResetService = async (email) => {
  console.log("hit this route")
  if (!email) throw new Error("EMAIL_REQUIRED");

  const user = await User.findOne({ email });
  if (!user) return "If an account with that email exists, a reset link has been sent.";
  
  const resetToken = jwt.sign( { id: user._id, type: "reset", }, JWT_SECRET, { expiresIn: "10m", }, );
  const resetLink = `${FRONTEND_URL}/reset-password?token=${resetToken}`;

  await sendEmail({
    to: user.email,
    subject: "🔐 Reset Your Xenly Password",
    html: passwordResetTemplate(user.name, resetLink),
  });

  return "If an account with that email exists, a reset link has been sent.";
};

const verifyResetTokenService = async (req) => {
  const token = req.query.token;
  if (!token) throw new Error("TOKEN_REQUIRED");

  const userId = verifyPassResetToken(token);

  const user = await User.findById(userId);
  if (!user) throw new Error("USER_NOT_FOUND");

  return "Reset link is valid";
};

const resetPasswordService = async (token, newPassword, confirmNewPassword) => {
  if (!token) throw new Error("TOKEN_REQUIRED");
  if (
    !newPassword ||
    !confirmNewPassword ||
    newPassword !== confirmNewPassword
  ) {
    throw new Error("PASSWORDS_INVALID_OR_MISMATCH");
  }

  const userId = verifyPassResetToken(token);
  const user = await User.findById(userId);
  if (!user) throw new Error("USER_NOT_FOUND");

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  return "Password reset successful";
};

const changePasswordService = async (req) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  const current = currentPassword?.trim();
  const np = newPassword?.trim();
  const confirm = confirmNewPassword?.trim();

  // basic check only
  if (!current || !np || !confirm) {
    throw new Error("ALL_FIELDS_REQUIRED");
  }

  if (np !== confirm) {
    throw new Error("PASSWORD_MISMATCH");
  }

  if (np.length < 8) {
    throw new Error("PASSWORD_TOO_SHORT");
  }

  const user = await User.findById(req.user.id).select("+password");
  if (!user) throw new Error("USER_NOT_FOUND");

  const isMatch = await bcrypt.compare(current, user.password);
  if (!isMatch) throw new Error("CURRENT_PASSWORD_INCORRECT");

  const isSame = await bcrypt.compare(np, user.password);
  if (isSame) throw new Error("NEW_PASSWORD_MUST_BE_DIFFERENT");

  user.password = await bcrypt.hash(np, 10);
  await user.save();

  return "Password updated successfully";
};

module.exports = {
  requestPasswordResetService,
  verifyResetTokenService,
  resetPasswordService,
  changePasswordService,
};
