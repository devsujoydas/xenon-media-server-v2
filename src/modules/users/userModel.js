const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  username: { type: String, unique: true, lowercase: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true, },
  role: { type: String, enum: ["user", "admin"], default: "user", index: true, },

  onlineStatus: { type: Boolean, default: false },
  refreshToken: { type: String },

  password: { type: String, required: true, minlength: 6 },
  passwordReset: {
    token: { type: String },
    expires: { type: Date },
  },

  profile: {
    bio: { type: String, default: "" },
    profilePhoto: { type: String, default: "/default.jpg" },
    coverPhoto: { type: String, default: "/default-cover.jpg" },
  },

  contactInfo: {
    phone: { type: String, default: "" },
    website: { type: String, default: "" },
    facebook: { type: String, default: "" },
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    twitter: { type: String, default: "" },
    instagram: { type: String, default: "" },
    youtube: { type: String, default: "" },
  },
  location: {
    from: { type: String, default: "" },
    livesIn: { type: String, default: "" }
  },

  savePosts: [{
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" }
  }],

  friendRequests: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    requestedAt: { type: Date, default: Date.now }
  }],
  sentRequests: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    requestedAt: { type: Date, default: Date.now }
  }],
  myFriends: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    since: { type: Date, default: Date.now }
  }],

},
  { timestamps: true }
);

userSchema.index({ name: "text", email: "text", role: "text" });

const User = mongoose.model("User", userSchema);
module.exports = User;