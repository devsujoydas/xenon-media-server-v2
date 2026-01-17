const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const createTokens = require("../../utils/createTokens");
const User = require("../users/userModel");
const { JWT_SECRET, ACCESS_TOKEN_EXPIRESIN } = require("../../configs/config");


const signUpUserService = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) { throw new Error("Email already exists") }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name, email,
    password: hashedPassword,
  });

  const username = email.split("@")[0].split("+")[0];
  const { accessToken, refreshToken } = createTokens(res, user);

  user.username = username;
  user.refreshToken = refreshToken;
  await user.save();

  return {
    message: "User registered successfully",
    user,
    accessToken,
  };
};

const signInUserService = async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const { accessToken, refreshToken } = createTokens(res, user);

  user.refreshToken = refreshToken;
  await user.save();

  return {
    message: "Login successful",
    user,
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

const refreshAccessTokenService = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(400).json({ message: "No refresh token found" });
  }

  jwt.verify(refreshToken, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = jwt.sign(
      { id: decoded.id, email: decoded.email, role: decoded.role },
      JWT_SECRET,
      { expiresIn: `${ACCESS_TOKEN_EXPIRESIN}` }
    );
    return res.status(200).json({ accessToken: newAccessToken });
  });
};
 


module.exports = {
  signUpUserService,
  signInUserService,
  logOutUserService,
  refreshAccessTokenService,
};
