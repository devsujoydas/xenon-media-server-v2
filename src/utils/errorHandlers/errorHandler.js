const AppError = require('../errors/AppError');

/**
 * Global error handler.
 * Register this LAST, after all routes: app.use(errorHandler)
 */
const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      code: err.code,
      message: err.message,
    });
  }

  // Unexpected / programmer error — log it, never leak internals to the client
  console.error('[UNHANDLED ERROR]', err);

  return res.status(500).json({
    success: false,
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Something went wrong. Please try again later.',
  });
};

module.exports = errorHandler;