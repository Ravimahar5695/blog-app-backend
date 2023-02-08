const express = require("express");
const router = express.Router();
const { body } = require('express-validator');
const {getCategoryById, getCategory, getAllCategory, createCategory, updateCategory, deleteCategory} = require("../controllers/category");
const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth");
const {getUserById} = require("../controllers/user");

router.param("categoryId", getCategoryById);

router.param("userId", getUserById);

router.get("/category/:categoryId", getCategory);

router.get("/categories", getAllCategory);

router.post("/user/:userId/category/create",
    body("name").notEmpty().withMessage("Please enter category name"),
isSignedIn, isAuthenticated, isAdmin, createCategory);

router.put("/user/:userId/category/:categoryId/update",
    body("name").notEmpty().withMessage("Please enter category name"),
isSignedIn, isAuthenticated, isAdmin, updateCategory);

router.delete("/user/:userId/category/:categoryId/delete", isSignedIn, isAuthenticated, isAdmin, deleteCategory);

module.exports = router;