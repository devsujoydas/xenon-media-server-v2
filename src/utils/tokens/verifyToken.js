const jwt = require("jsonwebtoken");
const User = require("../../modules/users/userModel");
const { activeStatusServicess } = require("../../modules/users/userServices");

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

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

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

    activeStatusServicess(user._id).catch(console.error);
   

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
