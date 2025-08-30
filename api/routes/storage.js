const express = require("express");
const router = express.Router();
const { uploadProfilePicture, updateProfilePicture, uploadHeaderBgImage, updateHeaderBgImage } = require("../controllers/storageController");


router.post("/avatar/:userId", uploadProfilePicture);

router.patch("/avatar/:userId", updateProfilePicture);

router.post("/header/:userId", uploadHeaderBgImage);

router.patch("/header/:userId", updateHeaderBgImage);


module.exports = router;