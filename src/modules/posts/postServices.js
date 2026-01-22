const fetchPosts = require("../../utils/fetchPosts");
const shuffleArray = require("../../utils/shuffleArray");
const User = require("../users/userModel");
const Comment = require("./commentModel");
const Post = require("./postModel");




const getPostsServices = async (req) => {
    const userId = req?.user?.id;
    const filter = {};

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
    return fetchPosts(filter, viewerId);
};

const getMyPostsServices = async (req) => {
    const userId = req.user.id;

    const filter = { author: userId };

    if (req.query.search) {
        filter["content.text"] = {
            $regex: req.query.search,
            $options: "i"
        };
    }

    return fetchPosts(filter, userId);
};

const getMySavedPostsService = async (req) => {
    const userId = req.user.id;

    const user = await User.findById(userId).select("savePosts");
    if (!user) throw new Error("USER_NOT_FOUND");

    if (!user.savePosts || user.savePosts.length === 0) {
        return { totalPosts: 0, posts: [] };
    }

    const filter = { _id: { $in: user.savePosts } };

    return fetchPosts(filter, userId);
};



const getPostServices = async (req) => {
    const postId = req.params.postid;

    const post = await Post
        .findById(postId)
        .populate("author", "name username profile.profilePhoto")
        .populate("likes", "name username profile.profilePhoto")

    if (!post) throw new Error("POST_NOT_FOUND");

    const postObj = post.toObject();
    return {
        ...postObj,
        likesCount: postObj.likes.length,
        likedByMe: req.user
            ? postObj.likes.some((u) => u._id.equals(req.user.id))
            : false,
    };
};


const createPostServices = async (req) => {
    const author = req.user.id;
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

    if (!post.author.equals(req.user.id)) {
        throw new Error("INVALID_POST_AUTHOR");
    }

    post.content.text = req.body.text
    post.save()
    return post
}

const deletePostServices = async (req) => {
    const postId = req.params.postId;
    const userId = req.user.id;
    const userRole = req.user.role;

    const post = await Post.findById(postId);
    if (!post) throw new Error("POST_NOT_FOUND");

    if (!post.author.equals(userId) && userRole !== "admin") {
        throw new Error("UNAUTHORIZED_TO_DELETE_POST");
    }

    await User.updateMany(
        { savePosts: postId },
        { $pull: { savePosts: postId } }
    );

    const deletedPost = await Post.findByIdAndDelete(postId);

    return {
        success: true,
        message: "Post deleted successfully",
        data: deletedPost,
    };
};

const savePostServices = async (req) => {
    const userId = req.user.id;
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

    const userId = req.user.id;
    const postId = req.params?.id;

    const post = await Post.findById(postId);
    if (!post) { throw new Error("POST_NOT_FOUND") }


    const alreadyLiked = post.likes.find((id) => id == userId);

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




const getCommentsService = async (req) => {
    const postId = req.params.postId;

    const post = await Post.findById(postId);
    if (!post) throw new Error("POST_NOT_FOUND");

    const comments = await Comment.find({ postId })
        .sort({ createdAt: -1 })
        .populate("author", "name username profile.profilePhoto");

    return { totalComments: comments.length, comments };
};


const createCommentService = async (req) => {
    const text = req.body.text;
    const postId = req.params.postId;
    const userId = req.user.id;

    if (!text) throw new Error("TEXT_REQUIRED");

    const post = await Post.findById(postId);
    if (!post) throw new Error("POST_NOT_FOUND");

    const newComment = await Comment.create({
        text,
        author: userId,
        postId,
    });

    return newComment;
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
    reactPostServices,

    getCommentsService,
    createCommentService,
    updateCommentService,
    deleteCommentService,
} 