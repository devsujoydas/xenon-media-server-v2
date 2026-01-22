const verifyToken = require("../utils/verifyToken");

const isVerifyAdmin = async (req, res, next) => {
  const { decoded, error } = await verifyToken(req);
  if (error) return res.status(error.status).json({ message: error.message });

  if (decoded.role !== "admin") {
    return res.status(403).json({ message: "Access denied! Admin access only." });
  }

  
  req.user = decoded;
  next();
};

module.exports = isVerifyAdmin;
