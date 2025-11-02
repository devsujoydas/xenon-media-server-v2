const verifyTokenAndGetUser = require("../utils/verifyToken");

const isVerifyUser = async (req, res, next) => {
  const { user, error } = await verifyTokenAndGetUser(req);
  if (error) return res.status(error.status).json({ message: error.message });

  req.user = user;
  next();
};

module.exports = isVerifyUser;
