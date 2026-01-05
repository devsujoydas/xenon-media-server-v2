const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  username: { type: String, unique: true, lowercase: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true, },
  role: { type: String, enum: ["user", "admin"], default: "user", index: true, },
  
  refreshToken: { type: String },
  
  password: { type: String, required: true, minlength: 6 },
  passwordReset: {
    token: { type: String },
    expires: { type: Date },
  },

  profile: {
    profilePhoto: { type: String, default: "/default.jpg" },
    coverPhoto: { type: String, default: "/default-cover.jpg" },
    bio: { type: String, default: "" },
  },
  
  contactInfo: {
    phone: { type: String, default: "" },
    website: { type: String, default: "" },
    facebook: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    twitter: { type: String, default: "" },
    instagram: { type: String, default: "" },
    github: { type: String, default: "" },
    youtube: { type: String, default: "" },
  },
  location: {
    from: { type: String, default: "" },
    livesIn: { type: String, default: "" }
  },

  friendRequests: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    requestedAt: { type: Date, default: Date.now }
  }],
  sentRequests: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    requestedAt: { type: Date, default: Date.now }
  }],
  myFriends: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    since: { type: Date, default: Date.now }
  }],

  onlineStatus: { type: Boolean, default: false },
},
  { timestamps: true }
);

userSchema.index({ name: "text", email: "text", role: "text" });

const User = mongoose.model("User", userSchema);
module.exports = User;