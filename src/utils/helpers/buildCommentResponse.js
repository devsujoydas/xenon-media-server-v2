// helpers/comment.helper.js

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
    isEdited: data.createdAt && data.updatedAt
      ? new Date(data.updatedAt).getTime() - new Date(data.createdAt).getTime() > 1000
      : false,
  };
};

// async NOT deya — Query ba Document jai pass koro, seta chainable thakbe (.lean() shoho)
const populateComment = (docOrQuery) =>
  docOrQuery.populate("author", "name username profileImage");

module.exports = {
  buildCommentResponse,
  populateComment,
};