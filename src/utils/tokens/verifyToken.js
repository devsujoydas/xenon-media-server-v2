const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../configs/config");
const User = require("../../modules/users/userModel");

const verifyToken = async (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return {
      error: {
        status: 401,
        message: "Unauthorized access, Please Sign In!",
      },
    };
  }

  try {
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id)
      .select("-password -refreshToken -passResetToken -__v")
      .lean();
      
    if (!user) {
      return {
        error: {
          status: 404,
          message: "Unauthorized access, Please Sign In!",
        },
      };
    }

    return { user };
  } catch (error) {
    return {
      error: {
        status: 401,
        message: "Unauthorized access, Please Sign In!",
      },
    };
  }
};

module.exports = verifyToken;
