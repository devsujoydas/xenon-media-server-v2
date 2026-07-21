const {
  getPostsServices,
  getPostServices,
  createPostServices,
  deletePostServices,
  updatePostServices,
  getMyPostsServices,
  getUserPostsServices,
  savePostServices,
  getMySavedPostsService,
  createCommentService,
  deleteCommentService,
  getCommentsService,
  updateCommentService,
  toggleReactService,
  manageCommentDislikeService,
  manageCommentLikeService,
} = require("./postServices");
 
const ERROR_MAP = {
  INVALID_AUTHOR_ID: [400, "Invalid author id"],
  INVALID_USER_ID: [400, "Invalid user id"],
  INVALID_POST_ID: [400, "Invalid post id"],
  INVALID_COMMENT_ID: [400, "Invalid comment id"],
  ALL_FIELDS_REQUIRED: [400, "Content are required"],
  TEXT_REQUIRED: [400, "Comment text is required"],
  POST_ID_AND_COMMENT_ID_REQUIRED: [400, "Post id and comment id are required"],

  POST_NOT_FOUND: [404, "Post not found"],
  USER_NOT_FOUND: [404, "User not found"],
  COMMENT_NOT_FOUND: [404, "Comment not found"],

  UNAUTHORIZED: [403, "You are not allowed to do this"],
  UNAUTHORIZED_TO_UPDATE_COMMENT: [403, "You are not allowed to update this comment"],
  UNAUTHORIZED_TO_DELETE_COMMENT: [403, "You are not allowed to delete this comment"],
};

const handlePostError = (res, error) => {
  console.error(error);

  const [status, message] = ERROR_MAP[error.message] || [500, "Internal server error"];
  return res.status(status).json({ message });
};

// ---------------- POSTS: read ----------------

const getPosts = async (req, res) => {
  try {
    const result = await getPostsServices(req);
    res.status(200).json(result);
  } catch (error) {
    handlePostError(res, error);
  }
};

const getMyPosts = async (req, res) => {
  try {
    const result = await getMyPostsServices(req);
    res.status(200).json(result);
  } catch (error) {
    handlePostError(res, error);
  }
};

const getUserPosts = async (req, res) => {
  try {
    const result = await getUserPostsServices(req);
    res.status(200).json(result);
  } catch (error) {
    handlePostError(res, error);
  }
};

const getPost = async (req, res) => {
  try {
    const post = await getPostServices(req);
    res.status(200).json({ post });
  } catch (error) {
    handlePostError(res, error);
  }
};

const getMySavedPosts = async (req, res) => {
  try {
    const result = await getMySavedPostsService(req);
    res.status(200).json(result);
  } catch (error) {
    handlePostError(res, error);
  }
};

// ---------------- POSTS: write ----------------

const createPost = async (req, res) => {
  try {
    const data = await createPostServices(req);
    res.status(201).json(data);
  } catch (error) {
    handlePostError(res, error);
  }
};

const updatePost = async (req, res) => {
  try {
    const data = await updatePostServices(req);
    res.status(200).json({ message: "Post updated", post: data });
  } catch (error) {
    handlePostError(res, error);
  }
};

const deletePost = async (req, res) => {
  try {
    const data = await deletePostServices(req);
    res.status(200).json(data);
  } catch (error) {
    handlePostError(res, error);
  }
};

const savePost = async (req, res) => {
  try {
    const { message } = await savePostServices(req);
    res.status(200).json({ message });
  } catch (error) {
    handlePostError(res, error);
  }
};

// ---------------- REACT ----------------

const toggleReact = async (req, res) => {
  try {
    const data = await toggleReactService(req);
    res.status(200).json(data);
  } catch (error) {
    handlePostError(res, error);
  }
};



const getComments = async (req, res) => {
  try {
    const comments = await getCommentsService(req);
    res.status(200).json(comments);
  } catch (error) {
    handlePostError(res, error);
  }
};

const createComment = async (req, res) => {
  try {
    const result = await createCommentService(req);
    res.status(201).json(result);
  } catch (error) {
    handlePostError(res, error);
  }
};

const updateComment = async (req, res) => {
  try {
    const updatedComment = await updateCommentService(req);
    res.status(200).json(updatedComment);
  } catch (error) {
    handlePostError(res, error);
  }
};

const deleteComment = async (req, res) => {
  try {
    const result = await deleteCommentService(req);
    res.status(200).json(result);
  } catch (error) {
    handlePostError(res, error);
  }
};

const manageCommentLike = async (req, res) => {
  try {
    const result = await manageCommentLikeService(req);
    res.status(200).json(result);
  } catch (error) {
    handlePostError(res, error);
  }
};

const manageCommentDislike = async (req, res) => {
  try {
    const result = await manageCommentDislikeService(req);
    res.status(200).json(result);
  } catch (error) {
    handlePostError(res, error);
  }
};

module.exports = {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  manageCommentLike,
  manageCommentDislike,
};

module.exports = {
  getPosts,
  getUserPosts,
  getMyPosts,
  getMySavedPosts,

  getPost,
  createPost,
  updatePost,
  deletePost,

  savePost,
  toggleReact,

  getComments,
  createComment,
  updateComment,
  deleteComment,

  manageCommentLike,
  manageCommentDislike,
};