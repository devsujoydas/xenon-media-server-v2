const { default: mongoose } = require("mongoose");
const fetchPosts = require("../../utils/fetchPosts");
const {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} = require("../../utils/ImageUploads/uploadService");
const shuffleArray = require("../../utils/shuffleArray");
const User = require("../users/userModel");
const Comment = require("./commentModel");
const Post = require("./postModel");

const getPostsServices = async (req) => {
  const { author, status, search } = req.query;

  const filter = {};

  if (author) {
    if (!mongoose.Types.ObjectId.isValid(author)) {
      throw new Error("INVALID_AUTHOR_ID");
    }

    filter.author = author;
  }

  if (status) {
    filter.status = status;
  }

  if (search) {
    filter.$or = [
      {
        title: {
          $regex: search,
          $options: "i",
        },
      },
      {
        content: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  return fetchPosts(filter, {
    shuffle: true,
    userId: req.user?.id,
  });
};
const getMyPostsServices = async (req) => {
  const filter = { author: req.user.id };

  if (req.query.search) {
    filter.content = {
      $regex: req.query.search,
      $options: "i",
    };
  }

  return fetchPosts(filter);
};
const getUserPostsServices = async (req) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("INVALID_USER_ID");
  }

  const filter = {
    author: userId,
  };

  if (req.query.search) {
    filter.content = {
      $regex: req.query.search,
      $options: "i",
    };
  }

  return fetchPosts(filter);
};
const getPostServices = async (postId) => {
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new Error("INVALID_POST_ID");
  }

  const post = await Post.findById(postId)
    .select("-__v")
    .populate("author", "name username profileImage");

  if (!post) {
    throw new Error("POST_NOT_FOUND");
  }

  const commentCount = await Comment.countDocuments({
    post: post._id,
  });

  return {
    ...post.toObject(),
    commentCount,
  };
};
const getMySavedPostsService = async (req) => {
  const userId = req.user.id;

  const user = await User.findById(userId).select("savePosts");

  if (!user) throw new Error("USER_NOT_FOUND");

  if (user.savePosts?.length === 0) {
    return {
      totalPosts: 0,
      posts: [],
    };
  }

  return fetchPosts({
    _id: {
      $in: user.savePosts,
    },
  });
};

const createPostServices = async (req) => {
  const { title, content } = req.body;
  console.log("entered this page");

  if (!title || !content) throw new Error("ALL_FIELDS_REQUIRED");

  let image = { url: "", publicId: "" };

  if (req.file) {
    const result = await uploadImageToCloudinary(req.file.buffer, "posts");
    image = result;
  }

  const post = await Post.create({
    title,
    content,
    postImg: image,
    author: req.user.id,
  });
  return post;
};
const updatePostServices = async (req) => {
  const post = await Post.findById(req.params.postId);
  if (!post) throw new Error("POST_NOT_FOUND");

  if (!post.author.equals(req.user.id)) throw new Error("UNAUTHORIZED");

  if (req.body.title) post.title = req.body.title;
  if (req.body.content) post.content = req.body.content;

  //   if (req.file) {
  //     if (post.postImg?.publicId)
  //       await deleteImageFromCloudinary(post.postImg.publicId);
  //     const result = await uploadImageToCloudinary(req.file.buffer, "posts");
  //     post.postImg = result;
  //   }

  await post.save();
  return post;
};
const deletePostServices = async (user, postId) => {
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
  const userId = req.user.id;
  const postId = req.params?.id;

  const post = await Post.findById(postId);
  if (!post) throw new Error("POST_NOT_FOUND");

  const user = await User.findById(userId);
  if (!user) throw new Error("USER_NOT_FOUND");

  const alreadySaved = user.savePosts.some((id) => id.equals(postId));

  if (alreadySaved) {
    user.savePosts.pull(postId);
    await user.save();
    return { message: "Post Removed" };
  } else {
    user.savePosts.addToSet(postId);
    await user.save();
    return { message: "Post Saved" };
  }
};
// ---------------- REACT ----------------
const toggleReactService = async (req) => {
  const post = await Post.findById(req.params.postId);
  if (!post) throw new Error("POST_NOT_FOUND");

  let message;
  const exists = post.reacts.includes(req.user.id);

  if (exists) {
    post.reacts.pull(req.user.id);
    message = "Dislike";
  } else {
    post.reacts.addToSet(req.user.id);
    message = "Liked";
  }

  await post.save();
  return {
    message,
    reacted: !exists,
    reactCount: post.reacts.length,
    post,
  };
};

const getCommentsService = async (req) => {
  const { postId } = req.params;
  const { sort = "recent" } = req.query;
  const userId = req.user.id;

  let comments = await Comment.find({ postId })
    .populate("author", "name username profile.profilePhoto")
    .lean();

  comments = comments.map((c) => {
    const likes = c.likes.map((id) => id.toString());
    const disLikes = c.disLikes.map((id) => id.toString());

    const likedByMe = userId ? likes.includes(userId.toString()) : false;

    const dislikedByMe = userId ? disLikes.includes(userId.toString()) : false;

    return {
      ...c,
      likesCount: c.likes.length,
      dislikesCount: c.disLikes.length,
      likedByMe,
      dislikedByMe,
    };
  });

  if (sort === "recent") {
    comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  if (sort === "relevant") {
    comments.sort((a, b) => b.likesCount - a.likesCount);
  }

  return {
    comments,
  };
};
const createCommentService = async (req) => {
  const { text } = req.body;
  const { postId } = req.params;
  const userId = req.user.id;

  if (!text) throw new Error("TEXT_REQUIRED");

  if (!postId.match(/^[0-9a-fA-F]{24}$/)) throw new Error("INVALID_POST_ID");

  const post = await Post.findById(postId);
  if (!post) throw new Error("POST_NOT_FOUND");

  const newComment = await Comment.create({
    text,
    author: userId,
    postId,
  });

  return { newComment, message: "Comment created successfully" };
};
const updateCommentService = async (req) => {
  const { postId, commentId } = req.params;
  const { text } = req.body;
  const userId = req.user.id;
  const userRole = req.user.role;

  if (!postId || !commentId) throw new Error("POST_ID_AND_COMMENT_ID_REQUIRED");
  if (!text) throw new Error("TEXT_REQUIRED");

  const comment = await Comment.findById(commentId);
  if (!comment) throw new Error("COMMENT_NOT_FOUND");

  if (!comment.author.equals(userId) && userRole !== "admin") {
    throw new Error("UNAUTHORIZED_TO_UPDATE_COMMENT");
  }

  comment.text = text;
  await comment.save();

  await comment.populate("author", "name username profile.profilePhoto");

  return comment;
};
const deleteCommentService = async (req) => {
  const { postId, commentId } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  if (!postId || !commentId) {
    throw new Error("POST_ID_AND_COMMENT_ID_REQUIRED");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) throw new Error("COMMENT_NOT_FOUND");

  if (!comment.author.equals(userId) && userRole !== "admin") {
    throw new Error("UNAUTHORIZED_TO_DELETE_COMMENT");
  }

  await Comment.findByIdAndDelete(commentId);

  return {
    success: true,
    message: "Comment deleted successfully",
  };
};

const manageLikeService = async (req) => {
  const userId = req?.user.id;
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);
  if (!comment) throw new Error("COMMENT_NOT_FOUND");

  const likesArr = comment.likes.map((id) => id?.toString()).filter(Boolean);
  const dislikesArr = comment.disLikes
    .map((id) => id?.toString())
    .filter(Boolean);

  const liked = likesArr.includes(userId);
  const disliked = dislikesArr.includes(userId);

  if (liked) {
    comment.likes.pull(userId);
  } else {
    comment.likes.addToSet(userId);
    if (disliked) comment.disLikes.pull(userId);
  }

  await comment.save();

  return {
    message: liked ? "Unliked comment" : "Liked comment",
    likesCount: comment.likes.length,
    dislikesCount: comment.disLikes.length,
    likedByMe: !liked,
    dislikedByMe: false,
  };
};
const manageDislikeService = async (req) => {
  const userId = req?.user.id;
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);
  if (!comment) throw new Error("COMMENT_NOT_FOUND");

  const likesArr = comment.likes.map((id) => id?.toString()).filter(Boolean);
  const dislikesArr = comment.disLikes
    .map((id) => id?.toString())
    .filter(Boolean);

  const liked = likesArr.includes(userId);
  const disliked = dislikesArr.includes(userId);

  if (disliked) {
    comment.disLikes.pull(userId);
  } else {
    comment.disLikes.addToSet(userId);
    if (liked) comment.likes.pull(userId);
  }

  await comment.save();

  return {
    message: disliked ? "Removed dislike" : "Disliked comment",
    likesCount: comment.likes.length,
    dislikesCount: comment.disLikes.length,
    likedByMe: false,
    dislikedByMe: !disliked,
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
