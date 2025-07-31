const express = require("express");
const router = express.Router();
const { getDeckById, getAllDecksFromUser, updateDeckList, saveDeckToUser } = require("../controllers/decksController");


router.get("/:deckId", getDeckById);

router.get("/user/:userId", getAllDecksFromUser);

router.post("/user/:userId", saveDeckToUser);

router.patch("/:deckId", updateDeckList);


module.exports = router;