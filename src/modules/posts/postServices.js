const postModel = require("./postModel");
const mongoose = require("mongoose");

const getPostsServices = async (query = {}) => {
  const filter = {};

  if (query.author) {
    filter.author = new mongoose.Types.ObjectId(query.author);
  }

  if (query.text) {
    filter["content.text"] = { $regex: query.text, $options: "i" };
  }

  const totalPosts = await postModel.countDocuments(filter);

  const posts = await postModel.aggregate([
    { $match: filter },
    { $sample: { size: totalPosts } } 
  ]);

  return { totalPosts, posts };
};

const getPostServices = async (req) => {
    const postId = req.params.id
    const post = await postModel.findById(postId)
    if (!post) { throw new Error("POST_NOT_FOUND") }
    return post
}


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
    post.content.text = req.body.text
    post.save()
    return post
}

const deletePostServices = async (req) => {
    const postId = req.params.id
    const post = await postModel.findById(postId)
    if (!post) { throw new Error("POST_NOT_FOUND") }
    const result = await postModel.findByIdAndDelete(postId)
    return result
}




module.exports = {
    getPostsServices,
    getPostServices,
    createPostServices,
    updatePostServices,
    deletePostServices
} 