
const jwt = require("jsonwebtoken");
const { JWT_SECRET, ACCESS_TOKEN_EXPIRESIN, REFRESH_TOKEN_EXPIRESIN } = require("../configs/config");


const createTokens = (res, user) => {
    const accessToken = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "15m", });
    const refreshToken = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d", });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken, refreshToken };
};

module.exports = createTokens;