const { signUpUserService, signInUserService, logOutUserService, refreshAccessTokenService, } = require("./authServices");


const signUpUser = async (req, res) => {  
  try {
    const result = await signUpUserService(req, res);
    res.status(201).json(result);
  } catch (error) {
    if (error.message === "Email already exists") {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

const signInUser = async (req, res) => {
  try {
    const result = await signInUserService(req, res);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logOutUser = async (req, res) => {
  try {
    await logOutUserService(req.cookies?.refreshToken);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return res.status(200).json({ message: "Logged out successfully" });

  } catch (error) {
    if (error.message === "NO_REFRESH_TOKEN") {
      return res.status(400).json({ message: "No refresh token found" });
    }

    return res.status(500).json({ message: "Logout failed" });
  }
};

const refreshAccessToken = (req, res) => {
  try {
    const result = refreshAccessTokenService(req, res);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  signUpUser,
  signInUser,
  logOutUser,
  refreshAccessToken,
};




