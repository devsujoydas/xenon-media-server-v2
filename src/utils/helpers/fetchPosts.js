const Comment = require("../../modules/posts/commentModel");
const Post = require("../../modules/posts/postModel");
const shuffleArray = require("./shuffleArray");

 
const fetchPosts = async (filter = {}, options = {}) => {
  const {
    populateAuthor = true,
    shuffle = false,
    sort = { createdAt: -1 },
    userId = null,
    page = null,
    limit = null,
  } = options;

  let query = Post.find(filter).select("-__v").sort(sort);

  if (populateAuthor) {
    query = query.populate("author", "name username profileImage");
  }

  if (page && limit) {
    query = query.skip((page - 1) * limit).limit(limit);
  }

  const posts = await query;

  if (posts.length === 0) {
    return { totalPosts: 0, posts: [] };
  }

  const postIds = posts.map((post) => post._id);

  const commentCounts = await Comment.aggregate([
    { $match: { post: { $in: postIds } } },
    { $group: { _id: "$post", count: { $sum: 1 } } },
  ]);

  const commentCountMap = new Map(
    commentCounts.map(({ _id, count }) => [_id.toString(), count]),
  );

  const postsWithCount = posts.map((post) => {
    const isReacted = userId
      ? post.reacts.some((id) => id.toString() === userId.toString())
      : false;

    return {
      ...post.toObject(),
      commentCount: commentCountMap.get(post._id.toString()) || 0,
      isReacted,
      reactCount: post.reacts.length,
    };
  });

  return {
    totalPosts: postsWithCount.length,
    posts: shuffle ? shuffleArray(postsWithCount) : postsWithCount,
  };
};

module.exports = fetchPosts;