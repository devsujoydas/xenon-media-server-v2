const multerErrorHandler = (err, req, res, next) => {
  if (!err) return next();

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      message: "Image size cannot exceed 5MB.",
    });
  }

  return res.status(400).json({
    success: false,
    message: err.message,
  });
};

module.exports = multerErrorHandler;