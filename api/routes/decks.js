const express = require("express");
const router = express.Router();
const { getAllDecksFromUser, updateDeckList, saveDeckToUser, deleteDeck } = require("../controllers/decksController");
const { getDeckById } = require("../services/deckService");


router.get("/:deckId", getDeckById);

router.get("/user/:userId", getAllDecksFromUser);

router.post("/user/:userId", saveDeckToUser);

router.patch("/:deckId", updateDeckList);

router.delete("/:deckId", deleteDeck);


module.exports = router;