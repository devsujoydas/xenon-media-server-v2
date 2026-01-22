const verifyToken = require("../utils/verifyToken");

const isVerifyUser = async (req, res, next) => {

  const { decoded, error } = await verifyToken(req);
  if (error) return res.status(error.status).json({ message: error.message });

  req.user = decoded;
  next();
};

module.exports = isVerifyUser;
