const express = require("express");
const { getUsers, createUser, updateUser, deleteUser, followUser, unfollowUser, getFollowDecks, getRecommendedDecks } = require("../controllers/usersController");
const { getUserById } = require("../services/userService");

const router = express.Router();


router.post("/", createUser);

router.post("/follow", followUser);

router.post("/unfollow", unfollowUser);

router.get("/all", getUsers);

router.get("/:userId", getUserById);

router.patch("/:userId", updateUser);

router.delete("/:userId", deleteUser);

router.post("/followDecks", getFollowDecks);

router.get("/recommendedDecks/:userId", getRecommendedDecks);


module.exports = router;