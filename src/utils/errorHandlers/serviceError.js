/**
 * ServiceError
 * Thrown from the service layer using ONLY an error code.
 * The asyncHandler translates this code into a full AppError
 * (statusCode + message) using the relevant error map (e.g. followErrors.js).
 *
 * This keeps services decoupled from HTTP concerns (status codes, messages).
 */
class ServiceError extends Error {
  constructor(code) {
    super(code);
    this.name = this.constructor.name;
    this.code = code;
  }
}

module.exports = ServiceError;