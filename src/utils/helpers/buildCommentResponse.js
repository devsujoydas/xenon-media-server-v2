
const buildCommentResponse = (comment, userId = null) => {
  const data = comment.toObject ? comment.toObject() : comment;

  const likes = data.likes || [];
  const disLikes = data.disLikes || [];

  return {
    ...data,
    likesCount: likes.length,
    dislikesCount: disLikes.length,
    likedByMe: userId
      ? likes.some((id) => id.toString() === userId.toString())
      : false,
    dislikedByMe: userId
      ? disLikes.some((id) => id.toString() === userId.toString())
      : false,
  };
};

const populateComment = (query) =>
  query.populate("author", "name username profileImage");

module.exports = {
  buildCommentResponse,
  populateComment,
};