const { requestPasswordResetService, verifyResetTokenService, resetPasswordService } = require("./passServices");


const requestPasswordReset = async (req, res) => {
  try {
    const message = await requestPasswordResetService(req.body.email);
    res.status(200).json({ message });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const verifyResetToken = async (req, res) => {
  try {
    const message = await verifyResetTokenService(req);
    res.status(200).json({ message });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const resetPassword = async (req, res) => { 
  try {
    const { token } = req.query;
    const { newPassword, confirmNewPassword } = req.body;
    const message = await resetPasswordService(token, newPassword, confirmNewPassword);
    res.status(200).json({ message });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


module.exports = {
  requestPasswordReset,
  verifyResetToken,
  resetPassword
}