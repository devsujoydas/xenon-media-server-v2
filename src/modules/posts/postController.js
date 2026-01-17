const { getPostsServices, getPostServices, createPostServices, deletePostServices, updatePostServices } = require("./postServices");

const getPosts = async (req, res) => {
  try {
    const query = {}; 

    if (req.user?._id) query.author = req.user._id; 
    if (req.query.text) query.text = req.query.text;

    const { totalPosts, posts } = await getPostsServices(query);

    res.status(200).json({ totalPosts, posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Failed to fetch posts", error: error.message });
  }
};


const getPost = async (req, res) => {
    try {
        const post = await getPostServices(req);
        res.json({ post });
    } catch (error) {
        if (error.message === "POST_NOT_FOUND") {
            return res.status(400).json({ message: "Post not found" });
        }
        res.status(500).json({ message: "Failed to fetch post" });
    }
}
const createPost = async (req, res) => {
    try {
        const post = await createPostServices(req);
        res.status(201).json({ message: "Post created successfully", post });
    } catch (error) {
        if (error.message === "CONTENT_REQUIRED") {
            return res.status(400).json({ message: "Post content is required" });
        }
        if (error.message === "POST_ALREADY_EXISTS") {
            return res.status(409).json({ message: "This post already exists" });
        }
        res.status(500).json({ message: "Failed to create post" });
    }
};

const updatePost = async (req, res) => {
    try {
        const post = await updatePostServices(req);
        res.json({ message: "Post update successfully", post });
    } catch (error) {
        if (error.message === "POST_NOT_FOUND") {
            return res.status(400).json({ message: "Post not found" });
        }
        console.error("Error updating post:", error);
        res.status(500).json({ message: "Failed to update post" });
    }
}

const deletePost = async (req, res) => {
    try {
        const result = await deletePostServices(req);
        res.json({ message: "Post delele successfully" });
    } catch (error) {
        if (error.message === "POST_NOT_FOUND") {
            return res.status(400).json({ message: "Post not found" });
        }
        console.error("Error deleting post:", error);
        res.status(500).json({ message: "Failed to delete post" });
    }
}





module.exports = { getPosts, getPost, createPost, updatePost, deletePost }