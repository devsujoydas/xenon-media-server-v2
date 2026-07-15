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
  deleteCommentService,
  createCommentService,
  getCommentsService,
  updateCommentService,
  manageDislikeService,
  manageLikeService,
  toggleReactService,
} = require("./postServices");

const handlePostError = (res, error) => {
  console.error(error);

  switch (error.message) {
    case "INVALID_AUTHOR_ID":
      return res.status(400).json({
        message: "Invalid author id",
      });

    case "INVALID_USER_ID":
      return res.status(400).json({
        message: "Invalid user id",
      });

    case "INVALID_POST_ID":
      return res.status(400).json({
        message: "Invalid post id",
      });

    case "POST_NOT_FOUND":
      return res.status(404).json({
        message: "Post not found",
      });

    default:
      return res.status(500).json({
        message: "Internal server error",
      });
  }
};

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
    const post = await getPostServices(req.params.postId);

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
    console.error("Error fetching saved posts:", error);

    if (error.message === "USER_NOT_FOUND") {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const createPost = async (req, res) => {
  try {
    const data = await createPostServices(req);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const updatePost = async (req, res) => {
  try {
    const data = await updatePostServices(req);
    res.json({ message: "Post updated", post: data });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const deletePost = async (req, res) => {
  try {
    const data = await deletePostServices(req.user, req.params.postId);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const savePost = async (req, res) => {
  try {
    const { message } = await savePostServices(req);
    res.json({ message });
  } catch (error) {
    if (error.message === "POST_NOT_FOUND") {
      return res.status(400).json({ message: "Post not found" });
    }
    console.error("Error Saving post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// REACT
const toggleReact = async (req, res) => {
  try {
    const data = await toggleReactService(req);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// comments
const getComments = async (req, res) => {
  try {
    const comments = await getCommentsService(req);
    res.status(200).json(comments);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const createComment = async (req, res) => {
  try {
    const result = await createCommentService(req);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const updateComment = async (req, res) => {
  try {
    const updatedComment = await updateCommentService(req);
    res.status(200).json(updatedComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const deleteComment = async (req, res) => {
  try {
    const result = await deleteCommentService(req);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const manageLike = async (req, res) => {
  try {
    const result = await manageLikeService(req);
    res.json(result);
  } catch (error) {
    if (error.message === "POST_NOT_FOUND") {
      return res.status(400).json({ message: "Post not found" });
    }
    console.error("Error liking post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const manageDislike = async (req, res) => {
  try {
    const result = await manageDislikeService(req);
    res.json(result);
  } catch (error) {
    if (error.message === "POST_NOT_FOUND") {
      return res.status(400).json({ message: "Post not found" });
    }
    console.error("Error liking post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
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

  manageLike,
  manageDislike,
};
