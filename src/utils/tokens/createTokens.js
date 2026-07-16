const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_EXPIRESIN, JWT_SECRET, REFRESH_TOKEN_EXPIRESIN } = require("../../configs/config");



const createTokens = (res, user) => {
  const payload = {
    id: user._id,
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRESIN,
  });

  const refreshToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRESIN,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return {
    accessToken,
    refreshToken,
  };
};

module.exports = createTokens;