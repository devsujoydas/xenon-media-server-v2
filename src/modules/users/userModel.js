const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  username: { type: String, unique: true, lowercase: true, trim: true, default: "" },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true, },
  role: { type: String, enum: ["user", "admin"], default: "user", index: true, },

  activeStatus: {
    online: { type: Boolean, default: false },
    lastActiveAt: { type: Date, default: Date.now },
  },

  refreshToken: { type: String, select: false },

  password: { type: String, required: true, minlength: 6, select: false },

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

userSchema.index({
  name: "text",
  email: "text",
  role: "text",
  "passwordReset.token": 1,
  "passwordReset.expires": 1
});

const User = mongoose.model("User", userSchema);
module.exports = User;