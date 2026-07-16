/**
 * AppError
 * Generic, operational error thrown/mapped for API responses.
 * Anything thrown as AppError is considered "safe" (expected, client-facing).
 */
class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_SERVER_ERROR') {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;