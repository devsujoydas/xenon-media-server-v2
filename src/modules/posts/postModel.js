const mongoose = require("mongoose");



const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true, required: true },
    content: {
      imageUrl: { type: String, default: "" },
      text: { type: String, default: "" },
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    shares: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);


const Post = mongoose.model("Post", postSchema)
module.exports = Post;



