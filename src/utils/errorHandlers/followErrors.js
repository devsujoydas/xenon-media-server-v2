
module.exports = {
  USER_ID_REQUIRED: {
    statusCode: 400,
    message: 'User ID is required.',
  },
  CURRENT_USER_NOT_FOUND: {
    statusCode: 404,
    message: 'Authenticated user could not be found.',
  },
  TARGET_USER_NOT_FOUND: {
    statusCode: 404,
    message: 'Target user could not be found.',
  },
  CAN_NOT_FOLLOW_SELF: {
    statusCode: 400,
    message: 'You cannot follow yourself.',
  },
  CAN_NOT_UNFOLLOW_SELF: {
    statusCode: 400,
    message: 'You cannot unfollow yourself.',
  },
  ALREADY_FOLLOWING: {
    statusCode: 409,
    message: 'You are already following this user.',
  },
  NOT_FOLLOWING: {
    statusCode: 409,
    message: 'You are not following this user.',
  },
};