const mongoose = require("mongoose");
const fetchPosts = require("../../utils/helpers/fetchPosts");
const {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} = require("../../utils/ImageUploads/uploadService");
const User = require("../users/userModel");
const Comment = require("./commentModel");
const Post = require("./postModel");
const { buildCommentResponse } = require("../../utils/helpers/buildCommentResponse");


const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// ---------------- POSTS: read ----------------

const getPostsServices = async (req) => {
  const { author, status, search, page, limit } = req.query;

  const filter = {};

  if (author) {
    if (!isValidId(author)) throw new Error("INVALID_AUTHOR_ID");
    filter.author = author;
  }

  if (status) {
    filter.status = status;
  }

  if (search) {
    filter.$or = [{ content: { $regex: search, $options: "i" } }];
  }

  return fetchPosts(filter, {
    shuffle: true,
    userId: req.user?._id,
    page: page ? Number(page) : null,
    limit: limit ? Number(limit) : null,
  });
};

const getMyPostsServices = async (req) => {
  const filter = { author: req.user?._id };

  if (req.query.search) {
    filter.content = { $regex: req.query.search, $options: "i" };
  }

  return fetchPosts(filter, { userId: req.user?._id });
};

const getUserPostsServices = async (req) => {
  const { userId } = req.params;

  if (!isValidId(userId)) throw new Error("INVALID_USER_ID");

  const filter = { author: userId };

  if (req.query.search) {
    filter.content = { $regex: req.query.search, $options: "i" };
  }

  return fetchPosts(filter, { userId: req.user?._id });
};


const getPostServices = async (req) => {
  const userId = req.user?._id;
  const postId = req.params.postId;

  if (!isValidId(postId)) throw new Error("INVALID_POST_ID");

  const post = await Post.findById(postId)
    .select("-__v")
    .populate("author", "name username profileImage")
    .populate("reacts", "name username profileImage");

  if (!post) throw new Error("POST_NOT_FOUND");

  const commentCount = await Comment.countDocuments({ post: post._id });
  const reacted = userId
    ? post.reacts.some((u) => u._id.toString() === userId.toString())
    : false;

  return {
    ...post.toObject(),
    commentCount,
    reacted,
    reactCount: post.reacts.length,
  };
};

const getMySavedPostsService = async (req) => {
  const userId = req.user?._id;

  const user = await User.findById(userId).select("savePosts");
  if (!user) throw new Error("USER_NOT_FOUND");

  if (!user.savePosts || user.savePosts.length === 0) {
    return { totalPosts: 0, posts: [] };
  }

  return fetchPosts({ _id: { $in: user.savePosts } }, { userId });
};

// ---------------- POSTS: write ----------------

const createPostServices = async (req) => {
  const { content } = req.body;

  if (!content) throw new Error("ALL_FIELDS_REQUIRED");

  let image = {
    url: "",
    publicId: "",
  };

  if (req.file) {
    image = await uploadImageToCloudinary(req.file.buffer, "posts");
  }

  const createdPost = await Post.create({
    content,
    postImg: image,
    author: req.user?._id,
  });

  return {
    post: {
      ...createdPost.toObject(),
      author: {
        _id: req.user?._id,
        name: req.user.name,
        username: req.user.username,
        profileImage: req.user.profileImage,
      },
      commentCount: 0,
      reacted: false,
      reactCount: 0,
    },
  };
};

const updatePostServices = async (req) => {
  const { postId } = req.params;

  if (!isValidId(postId)) throw new Error("INVALID_POST_ID");

  const post = await Post.findById(postId);
  if (!post) throw new Error("POST_NOT_FOUND");

  if (!post.author.equals(req.user?._id)) throw new Error("UNAUTHORIZED");

  if (req.body.content) post.content = req.body.content;

  if (req.file) {
    if (post.postImg?.publicId) {
      await deleteImageFromCloudinary(post.postImg.publicId);
    }
    post.postImg = await uploadImageToCloudinary(req.file.buffer, "posts");
  }

  await post.save();
  return post;
};

const deletePostServices = async (req) => {
  const user = req.user;
  const postId = req.params.postId;

  if (!isValidId(postId)) throw new Error("INVALID_POST_ID");

  const post = await Post.findById(postId);
  if (!post) throw new Error("POST_NOT_FOUND");

  if (!post.author.equals(user.id) && user.role !== "admin") {
    throw new Error("UNAUTHORIZED");
  }

  if (post.postImg?.publicId) {
    await deleteImageFromCloudinary(post.postImg.publicId);
  }

  await Comment.deleteMany({ post: post._id });
  await Post.findByIdAndDelete(post._id);

  return { message: "Post deleted" };
};

const savePostServices = async (req) => {
  const userId = req.user?._id;
  const { postId } = req.params;

  if (!isValidId(postId)) throw new Error("INVALID_POST_ID");

  const post = await Post.findById(postId);
  if (!post) throw new Error("POST_NOT_FOUND");

  const user = await User.findById(userId);
  if (!user) throw new Error("USER_NOT_FOUND");

  const exists = user.savePosts?.some((id) => id.equals(postId));

  if (exists) {
    user.savePosts.pull(postId);
  } else {
    user.savePosts.addToSet(postId);
  }

  await user.save();

  return {
    message: exists ? "Post Removed" : "Post Saved",
    saved: !exists,
    totalSavedPosts: user.savePosts.length,
  };
};

// ---------------- REACT ----------------

const toggleReactService = async (req) => {
  const { postId } = req.params;

  if (!isValidId(postId)) throw new Error("INVALID_POST_ID");

  const post = await Post.findById(postId);
  if (!post) throw new Error("POST_NOT_FOUND");

  const exists = post.reacts.some(
    (id) => id.toString() === req.user?._id.toString(),
  );

  if (exists) {
    post.reacts.pull(req.user?._id);
  } else {
    post.reacts.addToSet(req.user?._id);
  }

  await post.save();

  return {
    message: exists ? "Disliked" : "Liked",
    reacted: !exists,
    reactCount: post.reacts.length,
  };
};

// ---------------- COMMENTS ----------------

const getCommentsService = async (req) => {
  const { postId } = req.params;
  const { sort = "recent" } = req.query;

  if (!isValidId(postId)) {
    throw new Error("INVALID_POST_ID");
  }

  let comments = await populateComment(Comment.find({ post: postId })).lean();

  comments = comments.map((comment) =>
    buildCommentResponse(comment, req.user?._id),
  );

  if (sort === "recent") {
    comments.sort((a, b) => b.createdAt - a.createdAt);
  }

  if (sort === "relevant") {
    comments.sort((a, b) => b.likesCount - a.likesCount);
  }

  return {
    totalComments: comments.length,
    comments,
  };
};

const createCommentService = async (req) => {
  const { text } = req.body;
  const { postId } = req.params;

  if (!text) throw new Error("TEXT_REQUIRED");
  if (!isValidId(postId)) throw new Error("INVALID_POST_ID");

  const post = await Post.findById(postId);

  if (!post) throw new Error("POST_NOT_FOUND");

  let comment = await Comment.create({
    text,
    author: req.user?._id,
    post: postId,
  });

  comment = await populateComment(comment);

  return {
    message: "Comment created successfully",
    comment: buildCommentResponse(comment, req.user?._id),
  };
};

const updateCommentService = async (req) => {
  const { commentId } = req.params;
  const { text } = req.body;

  if (!text) throw new Error("TEXT_REQUIRED");

  const comment = await Comment.findOne({ _id: commentId });

  if (!comment) throw new Error("COMMENT_NOT_FOUND");

  if (!comment.author.equals(req.user?._id) && req.user.role !== "admin") {
    throw new Error("UNAUTHORIZED");
  }

  comment.text = text;

  await comment.save();

  await populateComment(comment);

  return {
    message: "Comment updated successfully",
    comment: buildCommentResponse(comment, req.user?._id),
  };
};

const deleteCommentService = async (req) => {
  const { commentId } = req.params;

  const comment = await Comment.findOne({
    _id: commentId,
  });

  if (!comment) throw new Error("COMMENT_NOT_FOUND");

  if (!comment.author.equals(req.user?._id) && req.user.role !== "admin") {
    throw new Error("UNAUTHORIZED");
  }

  await comment.deleteOne();

  return {
    message: "Comment deleted successfully",
  };
};

// ---------------- COMMENT LIKE / DISLIKE ----------------

const manageLikeService = async (req) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);

  if (!comment) throw new Error("COMMENT_NOT_FOUND");

  const liked = comment.likes.some((id) => id.equals(req.user?._id));

  if (liked) {
    comment.likes.pull(req.user?._id);
  } else {
    comment.likes.addToSet(req.user?._id);
    comment.disLikes.pull(req.user?._id);
  }

  await comment.save();
  await populateComment(comment);

  return {
    message: liked ? "Unliked comment" : "Liked comment",
    comment: buildCommentResponse(comment, req.user?._id),
  };
};

const manageDislikeService = async (req) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);

  if (!comment) throw new Error("COMMENT_NOT_FOUND");

  const disliked = comment.disLikes.some((id) => id.equals(req.user?._id));

  if (disliked) {
    comment.disLikes.pull(req.user?._id);
  } else {
    comment.disLikes.addToSet(req.user?._id);
    comment.likes.pull(req.user?._id);
  }

  await comment.save();
  await populateComment(comment);

  return {
    message: disliked ? "Removed dislike" : "Disliked comment",
    comment: buildCommentResponse(comment, req.user?._id),
  };
};

module.exports = {
  getPostsServices,
  getUserPostsServices,
  getMyPostsServices,
  getMySavedPostsService,

  getPostServices,
  createPostServices,
  updatePostServices,
  deletePostServices,

  savePostServices,
  toggleReactService,

  getCommentsService,
  createCommentService,
  updateCommentService,
  deleteCommentService,

  manageLikeService,
  manageDislikeService,
};
