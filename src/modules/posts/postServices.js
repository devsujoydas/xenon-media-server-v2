const shuffleArray = require("../../utils/shuffleArray");
const postModel = require("./postModel");
const mongoose = require("mongoose");




const getPostsServices = async (req) => {
  const userId = req?.user?._id;
  const filter = {};

  if (req.query.author) filter.author = req.query.author;
  if (req.query.search) filter["content.text"] = { $regex: req.query.search, $options: "i" };

  const posts = await postModel
    .find(filter)
    .populate("author", "name username profile.profilePhoto")
    .populate({
      path: "likes",
      select: "name username profile.profilePhoto",
      options: { limit: 10 } // only preview
    });

  // const shuffledPosts = shuffleArray(posts);

  const postsWithLikes = posts.map(post => {
    const postObj = post.toObject();
 
    const likedByMe = userId
      ? post.likes.some(u => u._id.equals(userId))
      : false;

    return {
      ...postObj,
      likesCount: postObj.likes.length,
      likedByMe
    };
  });

  return {
    totalPosts: posts.length,
    posts: postsWithLikes
  };
};

const getPostServices = async (req) => {
    const postId = req.params.id;

    const post = await postModel
        .findById(postId)
        .populate("author", "name username profile.profilePhoto")
        .populate({
            path: "likes",
            select: "name username profile.profilePhoto",
            options: { limit: 10 }
        });

    if (!post) throw new Error("POST_NOT_FOUND");

    const postObj = post.toObject();

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
    const existingPost = await postModel.findOne({
        author,
        "content.imageUrl": imageUrl
    });
    if (existingPost) { throw new Error("POST_ALREADY_EXISTS") }
    const post = await postModel.create({
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
    const post = await postModel.findById(postId)
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

    const post = await postModel.findById(postId);
    if (!post) throw new Error("POST_NOT_FOUND");

    if (!post.author.equals(req.user._id) && req.user.role !== "admin") {
        throw new Error("INVALID_POST_AUTHOR");
    }

    const result = await postModel.findByIdAndDelete(postId);
    return result;
};





const reactPostServices = async (req) => {

    const userId = req.user._id;
    const postId = req.params?.id;

    const post = await postModel.findById(postId);
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
    getPostServices,
    createPostServices,
    updatePostServices,
    deletePostServices,
    reactPostServices,
} 