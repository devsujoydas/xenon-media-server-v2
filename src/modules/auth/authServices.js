const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); 
const User = require("../users/userModel");
const { JWT_SECRET, ACCESS_TOKEN_EXPIRESIN } = require("../../configs/config");
const createTokens = require("../../utils/tokens/createTokens");

const signUpUserService = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    throw new Error("USER_ALREADY_EXIST");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const username = email.split("@")[0].split("+")[0];

  const user = await User.create({
    name,
    email,
    username,
    password: hashedPassword,
  });

  const { accessToken, refreshToken } = createTokens(res, user);
  user.refreshToken = refreshToken;
  await user.save();

  const userObj = user.toObject();

  delete userObj.password;
  delete userObj.refreshToken;
  delete userObj.passResetToken;
  delete userObj.__v;

  return {
    message: "User registered successfully",
    user: userObj,
    accessToken,
  };
};

const signInUserService = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new Error("Invalid email or password");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid email or password");

  const { accessToken, refreshToken } = createTokens(res, user);

  user.refreshToken = refreshToken;
  await user.save();

  const userObj = user.toObject();

  delete userObj.password;
  delete userObj.refreshToken;
  delete userObj.passResetToken;
  delete userObj.__v;

  return {
    message: "Login successfull",
    user: userObj,
    accessToken,
  };
};

const logOutUserService = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error("NO_REFRESH_TOKEN");
  }

  const user = await User.findOne({ refreshToken });
  if (user) {
    user.refreshToken = null;
    await user.save();
  }

  return true;
};

const refreshAccessTokenService = (req) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new Error("NO_REFRESH_TOKEN");
  }

  const decoded = jwt.verify(refreshToken, JWT_SECRET);

  const newAccessToken = jwt.sign(
    {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      username: decoded.username,
      profileImage: decoded.profileImage,
      isVerified: decoded.isVerified,
    },
    JWT_SECRET,
    {
      expiresIn: ACCESS_TOKEN_EXPIRESIN,
    },
  );

  return {
    accessToken: newAccessToken,
  };
};

module.exports = {
  signUpUserService,
  signInUserService,
  logOutUserService,
  refreshAccessTokenService,
};
