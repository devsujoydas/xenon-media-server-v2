const Post = require("../modules/posts/postModel");

const fetchPosts = async (filter, userId) => {
    const posts = await Post
        .find(filter)
        .populate("author", "name username profile.profilePhoto")
        .populate("likes", "name username profile.profilePhoto")
        
    const postsWithLikes = posts.map(post => {
        const postObj = post.toObject();
        return {
            ...postObj,
            likesCount: postObj.likes.length,
            likedByMe: userId
                ? post.likes.find(u => u._id == userId)
                : false
        };
    });
    return {
        totalPosts: posts.length,
        posts: postsWithLikes
    };
};

module.exports = fetchPosts