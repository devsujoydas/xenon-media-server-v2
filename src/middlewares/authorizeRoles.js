const verifyToken = require("../utils/tokens/verifyToken");

 

const authorizeRoles = (...roles) => {
  return async (req, res, next) => {
    const { user, error } = await verifyToken(req);

    if (error) {
      return res.status(error.status).json({
        message: error.message,
      });
    }

    // শুধু Login লাগলে
    if (roles.length === 0) {
      req.user = user;
      return next();
    }

    // Role Check
    if (!roles.includes(user.role)) {
      return res.status(403).json({
        message: "Access denied!",
      });
    }

    req.user = user;

    next();
  };
};

module.exports = authorizeRoles;