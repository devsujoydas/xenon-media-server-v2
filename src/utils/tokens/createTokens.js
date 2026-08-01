const jwt = require("jsonwebtoken");



const createTokens = (res, user) => {
  const payload = {
    id: user._id,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET , {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRESIN,
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET , {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRESIN,
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