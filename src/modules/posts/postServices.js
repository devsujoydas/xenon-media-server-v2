const shuffleArray = require("../../utils/shuffleArray");
const User = require("../users/userModel");
const Post = require("./postModel");

const fetchPosts = async (filter, userId) => {
    const posts = await Post
        .find(filter)
        .populate("author", "name username profile.profilePhoto")
        .populate("likes", "name username profile.profilePhoto");

    const postsWithLikes = posts.map(post => {
        const postObj = post.toObject();
        return {
            ...postObj,
            likesCount: postObj.likes.length,
            likedByMe: userId
                ? post.likes.some(u => u._id.equals(userId))
                : false
        };
    });

    return {
        totalPosts: posts.length,
        posts: postsWithLikes
    };
};


const getPostsServices = async (req) => {
    const userId = req?.user?._id;
    const filter = {};

    if (req.query.search) {
        filter["content.text"] = {
            $regex: req.query.search,
            $options: "i"
        };
    }

    return fetchPosts(filter, userId);
};

const getMyPostsServices = async (req) => {
    const userId = req.user._id;

    const filter = {
        author: userId
    };

    if (req.query.search) {
        filter["content.text"] = {
            $regex: req.query.search,
            $options: "i"
        };
    }

    return fetchPosts(filter, userId);
};

const getUserPostsServices = async (req) => {
    const viewerId = req?.user?._id;
    const profileUserId = req.params.userId;

    const filter = { author: profileUserId };

    if (req.query.search) {
        filter["content.text"] = {
            $regex: req.query.search,
            $options: "i"
        };
    }

    return fetchPosts(filter, viewerId);
};


const getPostServices = async (req) => {
    const postId = req.params.postid;

    const post = await Post
        .findById(postId)
        .populate("author", "name username profile.profilePhoto")
        .populate("likes", "name username profile.profilePhoto");



    if (!post) throw new Error("POST_NOT_FOUND");

    const postObj = post.toObject();
    console.log(post)
    return {
        ...postObj,
        likesCount: postObj.likes.length,
        likedByMe: req.user
            ? postObj.likes.some((u) => u._id.equals(req.user._id))
            : false,
    };
};

const createPostServices = async (req) => {
    const author = req.user._id;
    const { imageUrl, text } = req.body;
    if (!text && !imageUrl) { throw new Error("CONTENT_REQUIRED"); }
    const existingPost = await Post.findOne({
        author,
        "content.imageUrl": imageUrl
    });
    if (existingPost) { throw new Error("POST_ALREADY_EXISTS") }
    const post = await Post.create({
        author,
        content: {
            imageUrl,
            text
        }
    });
    await post.populate("author", "name username");
    return post;
}

const updatePostServices = async (req) => {
    const postId = req.params.id
    const post = await Post.findById(postId)
    if (!post) { throw new Error("POST_NOT_FOUND") }

    if (!post.author.equals(req.user._id)) {
        throw new Error("INVALID_POST_AUTHOR");
    }

    post.content.text = req.body.text
    post.save()
    return post
}

const deletePostServices = async (req) => {
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) throw new Error("POST_NOT_FOUND");

    if (!post.author.equals(req.user._id) && req.user.role !== "admin") {
        throw new Error("INVALID_POST_AUTHOR");
    }

    await User.updateMany(
        { savePosts: postId },
        { $pull: { savePosts: postId } }
    );

    const result = await Post.findByIdAndDelete(postId);
    return result;
};

const savePostServices = async (req) => {
    const userId = req.user._id;
    const postId = req.params?.id;

    const post = await Post.findById(postId);
    if (!post) throw new Error("POST_NOT_FOUND")

    const user = await User.findById(userId)
    if (!user) throw new Error("USER_NOT_FOUND")

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
}

const reactPostServices = async (req) => {

    const userId = req.user._id;
    const postId = req.params?.id;

    const post = await Post.findById(postId);
    if (!post) { throw new Error("POST_NOT_FOUND") }


    const alreadyLiked = post.likes.some(
        (id) => id.equals(userId)
    );

    if (alreadyLiked) {
        post.likes.pull(userId);
        await post.save();
        return { message: "Disliked" };
    } else {
        post.likes.addToSet(userId);
        await post.save();
        return { message: "Liked" };
    }

}


module.exports = {
    getPostsServices,
    getMyPostsServices,
    getUserPostsServices,
    getPostServices,
    createPostServices,
    updatePostServices,
    deletePostServices,
    savePostServices,
    reactPostServices,
} 