const express = require("express");
const { getUserById, getUsers, createUser, updateUser, deleteUser, followUser, unfollowUser } = require("../controllers/usersController");
const router = express.Router();


router.post("/", createUser);

router.get("/:userId", getUserById);

router.get("/all", getUsers);

router.patch("/:userId", updateUser);

router.delete("/:userId", deleteUser);

router.post("/follow", followUser);

router.post("/unfollow", unfollowUser);


module.exports = router;