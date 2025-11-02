const express = require("express");
const router = express.Router()

const authRoutes = require("./src/modules/auth/authRoutes");
const userRoutes = require("./src/modules/users/userRoutes");
const passRoutes = require("./src/modules/password/passRoutes");
const postRoutes = require("./src/modules/posts/postRoutes");
const friendRoutes = require("./src/modules/friends/friendRoutes");


router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/password", passRoutes);
router.use("/posts", postRoutes);
router.use("/friends", friendRoutes);




module.exports = router