const express = require("express");
const router = express.Router();
const {getUserById, getUser, getAllUsers, editProfile} = require("../controllers/user");
const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth");
const { body } = require('express-validator');

router.param("userId", getUserById);

router.get("/user/:userId", getUser);

router.get("/users", getAllUsers);

router.post("/user/:userId/profile/edit", isSignedIn, isAuthenticated, editProfile);

module.exports = router;