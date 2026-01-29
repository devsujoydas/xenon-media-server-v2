const Comment = require("../modules/posts/commentModel");
const Post = require("../modules/posts/postModel"); 
const shuffleArray = require("./shuffleArray");

const fetchPosts = async (filter, userId) => {
    const posts = await Post
        .find(filter)
        .populate("author", "name username profile.profilePhoto")
        .populate("likes", "name username profile.profilePhoto");

    const shuffledPost = shuffleArray(posts);

    // use Promise.all to resolve async map
    const postsWithLikes = await Promise.all(
        shuffledPost.map(async (post) => {
            const commentCount = await Comment.countDocuments({ postId: post._id });
            const postObj = post.toObject();
            return {
                ...postObj,
                commentCount,
                likesCount: postObj.likes.length,
                likedByMe: userId
                    ? postObj.likes.some(u => u._id.equals(userId))
                    : false
            };
        })
    );

    return {
        totalPosts: posts.length,
        posts: postsWithLikes
    };
};

module.exports = fetchPosts;
