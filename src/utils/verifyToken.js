const jwt = require("jsonwebtoken");  
const User = require("../modules/users/userModel");
const { JWT_SECRET } = require("../configs/config");
 
const verifyToken = async (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return { error: { status: 401, message: "Unauthorized access, Please Sign In!" } };
  }
  
  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET); 

    const user = await User.findById(decoded.id).select("-password -refreshToken");
    if (!user) {
      return { error: { status: 404, message: "User not found" } };
    }

    return { decoded };
  } catch (error) {
    return { error: { status: 403, message: "Unauthorized access, Please Sign In!" } };
  }
};

module.exports = verifyToken;
