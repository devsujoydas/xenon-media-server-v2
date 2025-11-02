const User = require("./userModel");

const getProfileServices = (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user;
    return user
}

const updateUserServices = async (email, data) => {
  const { name, profile, socialLinks, location } = data;

  if (!email) throw new Error("User email not found");

  const updateFields = {};

  if (name) updateFields.name = name;

  if (profile) {
    for (const key in profile) {
      if (profile[key] !== "") {
        updateFields[`profile.${key}`] = profile[key];
      }
    }
  }

  if (socialLinks) {
    for (const key in socialLinks) {
      if (socialLinks[key] !== "") {
        updateFields[`socialLinks.${key}`] = socialLinks[key];
      }
    }
  }

  if (location) {
    for (const key in location) {
      if (location[key] !== "") {
        updateFields[`location.${key}`] = location[key];
      }
    }
  }

  const updatedUser = await User.findOneAndUpdate(
    { email },
    { $set: updateFields },
    { new: true }
  );

  if (!updatedUser) throw new Error("User not found");

  return updatedUser;
};

module.exports = { updateUserServices };




module.exports = { getProfileServices, updateUserServices }