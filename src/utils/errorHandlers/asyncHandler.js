const AppError = require("./appError");
const ServiceError = require("./serviceError");


const asyncHandler = (serviceFn, errorMap = {}) => {
  return async (req, res, next) => {
    try {
      const result = await serviceFn(req);

      return res.status(result.statusCode || 200).json({
        success: true,
        message: result.message,
        data: result.data ?? null,
      });
    } catch (error) {
      if (error instanceof ServiceError && errorMap[error.code]) {
        const { statusCode, message } = errorMap[error.code];
        return next(new AppError(message, statusCode, error.code));
      }

      return next(error);
    }
  };
};

module.exports = asyncHandler;