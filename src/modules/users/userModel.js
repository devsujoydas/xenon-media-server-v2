const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true, minlength: 3, maxlength: 30, match: /^[a-zA-Z0-9_.]+$/, },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, },
    password: { type: String, required: true, minlength: 6, select: false, },
    role: { type: String, enum: ["user", "admin", "ceo"], default: "user", },

    isVerified: { type: Boolean, default: false, },

    refreshToken: { type: String, default: "", select: false, },
    passResetToken: { type: String, default: "", select: false, },

    profileImage: { url: { type: String, default: "/default_profile.webp", },
      publicId: { type: String, default: "", },
    },
    coverImage: {
      url: { type: String, default: "/default_cover.webp", },
      publicId: { type: String, default: "", },
    },

    bio: { type: String, default: "", },

    activeStatus: { online: { type: Boolean, default: false, },
    lastActiveAt: { type: Date, default: Date.now, }, },

    contactInfo: { phone: { type: String, default: "", },
      website: { type: String, default: "", },
      facebook: { type: String, default: "", },
      github: { type: String, default: "", },
      linkedin: { type: String, default: "", },
      twitter: { type: String, default: "", },
      instagram: { type: String, default: "", },
      youtube: { type: String, default: "", },
    },

    location: {
      from: { type: String, default: "", },
      livesIn: { type: String, default: "", },
    },

    savedPosts: [ { type: mongoose.Schema.Types.ObjectId, ref: "Post", }, ],

    followers: [ { type: mongoose.Schema.Types.ObjectId, ref: "User", }, ],
    following: [ { type: mongoose.Schema.Types.ObjectId, ref: "User", }, ],
  },
  {
    timestamps: true,
  },
);


userSchema.index({
  name: "text",
  username: "text",
});



const User = mongoose.model("User", userSchema);

module.exports = User;
