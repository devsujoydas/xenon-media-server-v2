const { getPostsServices, getPostServices, createPostServices, deletePostServices, updatePostServices, reactPostServices, getMyPostsServices, getUserPostsServices, savePostServices, getMySavedPostsService, deleteCommentService, createCommentService, getCommentsService, updateCommentService } = require("./postServices");





const getPosts = async (req, res) => {
    try {
        const { totalPosts, posts } = await getPostsServices(req);
        res.status(200).json({ totalPosts, posts });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Failed to fetch posts", error: error.message });
    }
};
const getMyPosts = async (req, res) => {
    try {
        const { totalPosts, posts } = await getMyPostsServices(req);

        res.status(200).json({ totalPosts, posts });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Failed to fetch posts", error: error.message });
    }
};
const getUserPosts = async (req, res) => {
    try {
        const { totalPosts, posts } = await getUserPostsServices(req);

        res.status(200).json({ totalPosts, posts });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Failed to fetch posts", error: error.message });
    }
};



const getPost = async (req, res) => {
    try {
        const post = await getPostServices(req);
        res.status(200).json({ post });
    } catch (error) {
        if (error.message === "POST_NOT_FOUND") {
            return res.status(404).json({ message: "Post not found" });
        }
        console.error("Error fetching post:", error);
        res.status(500).json({ message: "Failed to fetch post" });
    }
};

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
        res.json({ message: "Post updated successfully", post });
    } catch (error) {
        if (error.message === "POST_NOT_FOUND") {
            return res.status(400).json({ message: "Post not found" });
        }
        if (error.message === "INVALID_POST_AUTHOR") {
            return res.status(400).json({ message: "You are not the author of this post for update" });
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
        if (error.message === "INVALID_POST_AUTHOR") {
            return res.status(400).json({ message: "Admin & Post Author can delete this post" });
        }
        console.error("Error deleting post:", error);
        res.status(500).json({ message: "Failed to delete post" });
    }
}

const savePost = async (req, res) => {
    try {
        const { message } = await savePostServices(req)
        res.json({ message })
    } catch (error) {
        if (error.message === "POST_NOT_FOUND") {
            return res.status(400).json({ message: "Post not found" });
        }
        console.error("Error Saving post:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
const reactPost = async (req, res) => {
    try {
        const { message } = await reactPostServices(req)
        res.json({ message })
    } catch (error) {
        if (error.message === "POST_NOT_FOUND") {
            return res.status(400).json({ message: "Post not found" });
        }
        console.error("Error liking post:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getMySavedPosts = async (req, res) => {
    try {
        const { totalPosts, posts } = await getMySavedPostsService(req)
        res.json({ totalPosts, posts })
    } catch (error) {
        if (error.message === "POST_NOT_FOUND") {
            return res.status(400).json({ message: "Post not found" });
        }
        console.error("Error liking post:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}




// comments 
const getComments = async (req, res) => {
    try {
        const comments = await getCommentsService(req);
        res.status(200).json(comments);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}


const createComment = async (req, res) => {
    try {
        const comment = await createCommentService(req);
        res.status(201).json(comment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const updateComment = async (req, res) => {
    try {
        const updatedComment = await updateCommentService(req);
        res.status(200).json(updatedComment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteComment = async (req, res) => {
    try {
        const result = await deleteCommentService(req);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};




module.exports = {
    getPosts,
    getUserPosts,
    
    getMyPosts,
    getMySavedPosts,
    
    getPost,
    createPost,
    updatePost,
    deletePost,

    savePost,
    reactPost,

    getComments,
    createComment,
    updateComment,
    deleteComment,
}