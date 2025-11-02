const {
  requestPasswordResetService,
  verifyResetTokenService,
  resetPasswordService
} = require('./passServices');


const requestPasswordReset = async (req, res) => {
  try {
    const frontendBaseUrl = process.env.FRONTEND_URL || 'https://localhost:5170/api';
    const message = await requestPasswordResetService(req.body.email, frontendBaseUrl);
    res.json({ success: true, message });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.query
    if (!token) throw new Error('Token missing');
    const message = await verifyResetTokenService(token);
    res.json({ success: true, message });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.query
    const { newPassword, confirmNewPassword } = req.body;

    const message = await resetPasswordService(token, newPassword, confirmNewPassword);
    res.json({ success: true, message });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = { requestPasswordReset, verifyResetToken, resetPassword };
