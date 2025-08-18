const express = require("express");
const { getUsers, createUser, updateUser, deleteUser, followUser, unfollowUser } = require("../controllers/usersController");
const { getUserById } = require("../services/userService");

const router = express.Router();


router.post("/", createUser);

router.post("/follow", followUser);

router.post("/unfollow", unfollowUser);

router.get("/all", getUsers);

router.get("/:userId", getUserById);

router.patch("/:userId", updateUser);

router.delete("/:userId", deleteUser);


module.exports = router;