const express = require("express");
const router = express.Router();
const {getUserById, getUser, getAllUsers} = require("../controllers/user");

router.param("userId", getUserById);

router.get("/user/:userId", getUser);

router.get("/users", getAllUsers);

module.exports = router;