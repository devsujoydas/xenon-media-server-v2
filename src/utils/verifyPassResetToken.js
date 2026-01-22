const { JWT_SECRET } = require("../configs/config");
const jwt = require("jsonwebtoken")

const verifyPassResetToken = (token) => { 

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.type !== "reset") throw new Error("INVALID_TOKEN_TYPE"); 
    return decoded.id;
  } catch (err) {
    throw new Error("INVALID_OR_EXPIRED_RESET_LINK");
  }
};

module.exports = verifyPassResetToken