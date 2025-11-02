const verifyTokenAndGetUser = require("../utils/verifyToken");

const isVerifyAdmin = async (req, res, next) => {
  const { user, error } = await verifyTokenAndGetUser(req);
  if (error) return res.status(error.status).json({ message: error.message });

  if (user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }

  req.user = user;
  next();
};

module.exports = isVerifyAdmin;
