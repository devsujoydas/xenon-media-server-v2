const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    postImg: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },

    content: { type: String, required: true },

    reacts: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
shares: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true },
);

// Speeds up the $or text search used in getPostsServices
postSchema.index({ content: "text" });

const Post = mongoose.model("Post", postSchema);
module.exports = Post;