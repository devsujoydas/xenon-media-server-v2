const { deleteImageFromCloudinary } = require("./uploadService");

const deleteUserAssets = async (user) => {
  const images = [
    user.profileImage?.publicId,
    user.coverImage?.publicId,
  ].filter(Boolean);

  await Promise.all(
    images.map((publicId) => deleteImageFromCloudinary(publicId))
  );
};

module.exports = deleteUserAssets;