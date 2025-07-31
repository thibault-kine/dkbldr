const express = require("express");
const { getRandomCard, getRandomCommander, searchCard, getCardById, getAllPrints } = require("../controllers/cardsController");
const router = express.Router();


router.get("/random", getRandomCard);

router.get("/random/edh", getRandomCommander);

router.post("/search/:q", searchCard);

router.get("/:cardId", getCardById);

router.get("/:cardId/prints", getAllPrints);


module.exports = router;