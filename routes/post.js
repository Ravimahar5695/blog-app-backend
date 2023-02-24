const express = require("express");
const router = express.Router();
const {body} = require("express-validator");
const {getUserById} = require("../controllers/user");
const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth");
const {getPostById, getPost, getAllPosts, getPostsByCategoryId, getPostsByUserId, createPost, updatePost, deletePost, comment, getAllComments} = require("../controllers/post");


router.param("userId", getUserById);

router.param("postId", getPostById);

router.get("/post/:postId", getPost);

router.get("/posts/:pageNumber/:limit", getAllPosts);

router.get("/category/:categoryId/posts", getPostsByCategoryId);

router.get("/user/:userId/posts", getPostsByUserId);

router.post("/user/:userId/post/create", isSignedIn, isAuthenticated, createPost);

router.post("/user/:userId/post/:postId/update", isSignedIn, isAuthenticated, updatePost);

router.delete("/user/:userId/post/:postId/delete", isSignedIn, isAuthenticated, deletePost);

router.put("/post/:postId/comment",
    body("name").notEmpty().withMessage("Please enter your name"),
    body("email").notEmpty().withMessage("Please enter your email address"),
    body("email").isEmail().withMessage("Please enter a valid email address"),
    body("comment").notEmpty().withMessage("Please write a comment"),
comment);

module.exports = router;