const express = require("express");
const router = express.Router();
const { body } = require('express-validator');
const {contact, getAllContacts, deleteContact} = require("../controllers/contact");
const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth");
const {getUserById} = require("../controllers/user");

router.param("userId", getUserById);

router.post("/contact",
    body("name")
    .notEmpty().withMessage("Please enter your name"),
    body("email")
    .notEmpty().withMessage("Please enter your email address"),
    body("email")
    .isEmail().withMessage("Please enter a valid email address"),
    body("message")
    .notEmpty().withMessage("Please write a message"),
contact);

router.get("/user/:userId/contacts", isSignedIn, isAuthenticated, isAdmin, getAllContacts);

router.delete("/user/:userId/contact/:contactId/delete", isSignedIn, isAuthenticated, isAdmin, deleteContact);

module.exports = router;