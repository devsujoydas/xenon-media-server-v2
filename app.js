const express = require("express");
const router = express.Router()

const authRoutes = require("./src/modules/auth/authRoutes");
const userRoutes = require("./src/modules/users/userRoutes");
const passRoutes = require("./src/modules/password/passRoutes");
const postRoutes = require("./src/modules/posts/postRoutes");
const adminRoutes = require("./src/modules/admin/adminRoutes");
const followRoutes = require("./src/modules/follow/followRoutes");


router.use("/auth", authRoutes);
router.use("/users", userRoutes);

router.use("/posts", postRoutes);
router.use("/password", passRoutes); 
router.use("/admin", adminRoutes);

router.use("/follow", followRoutes);




module.exports = router