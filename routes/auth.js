const express = require("express");
const router = express.Router();
const { body } = require('express-validator');
const {register, login, logout, isSignedIn} = require("../controllers/auth");

router.post("/register",
    body("name")
    .notEmpty().withMessage("Please enter your name")
    .isLength({min: 3, max: 32}).withMessage("Name must be between 3 to 32 characters"),
    body("email")
    .notEmpty().withMessage("Please enter your email address"),
    body("email")
    .isEmail().withMessage("Please enter a valid email address"),
    body("password")
    .notEmpty().withMessage("Please enter a password"),
    register);

router.post("/login",
    body("email")
    .notEmpty().withMessage("Please enter your email address"),
    body("email")
    .isEmail().withMessage("Please enter a valid email address"),
    body("password")
    .notEmpty().withMessage("Please enter your password"),
    login);

router.get("/logout", logout);

module.exports = router;