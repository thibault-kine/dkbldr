const express = require("express");
const router = express.Router();
const { getAllArchetypes, getArchetypesForDeck, addArchetypesToDeck } = require("../controllers/archetypesController");


router.get("/all", getAllArchetypes);

router.get("/decks/:deckId", getArchetypesForDeck);

router.post("/deck/:deckId", addArchetypesToDeck);


module.exports = router;