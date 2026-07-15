const fetchPosts = async (filter = {}, options = {}) => {
  const {
    populateAuthor = true,
    shuffle = false,
    sort = { createdAt: -1 },
    userId = null,
  } = options;

  let query = Post.find(filter)
    .select("-__v")
    .sort(sort);

  if (populateAuthor) {
    query = query.populate("author", "name username profileImage");
  }

  const posts = await query;

  const postsWithCount = await Promise.all(
    posts.map(async (post) => {
      const commentCount = await Comment.countDocuments({
        post: post._id,
      });

      let reacted = false;

      if (userId) {
        reacted = post.reacts.some(
          (id) => id.toString() === userId.toString()
        );
      }

      return {
        ...post.toObject(),
        commentCount,
        reacted,
        reactCount: post.reacts.length,
      };
    })
  );

  return {
    totalPosts: postsWithCount.length,
    posts: shuffle ? shuffleArray(postsWithCount) : postsWithCount,
  };
};

module.exports = fetchPosts;