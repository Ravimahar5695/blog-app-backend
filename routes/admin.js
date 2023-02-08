const express = require("express");
const router = express.Router();
const {getPostById} = require("../controllers/post");
const {getUserById} = require("../controllers/user");
const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth");
const {deletePost, deleteComment} = require("../controllers/admin");

router.param("postId", getPostById);

router.param("userId", getUserById);

router.delete("/admin/user/:userId/post/:postId/delete", isSignedIn, isAuthenticated, isAdmin, deletePost);

router.put("/admin/user/:userId/post/:postId/:commentId/delete", isSignedIn, isAuthenticated, isAdmin, deleteComment);

module.exports = router;