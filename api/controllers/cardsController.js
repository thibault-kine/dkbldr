const Scryfall = require("scryfall-api");


async function getRandomCard(req, res) {
    try {
        const card = await Scryfall.Cards.random();

        return res.status(200).json(card);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
}


async function getRandomCommander(req, res) {
    try {
        const tzOffset = 60;

        const now = new Date();
        now.setMinutes(now.getMinutes() + tzOffset);

        const result = await fetch("https://api.scryfall.com/cards/random?q=legal:edh+is:commander+-t:background", {
            method: "GET", 
            headers: {
                "Content-Type": "application/json"
            }
        });
        
        if (!result.ok) return res.status(result.status).json({ error: result.text });
        const card = await result.json();

        return res.status(200).json(card);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
}


async function searchCard(req, res) {
    try {
        const query = req.params.q;
        const card = await Scryfall.Cards.byName(query, true);

        return res.status(200).json(card);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
}


async function getCardById(req, res) {
    try {
        const cardId = req.params.cardId;
        const card = await Cards.byId(cardId.toString());
        
        return res.status(200).json(card);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
}


async function getAllPrints(req, res) {
    try {
        const cardId = req.params.cardId;
        const _card = Cards.byId(cardId);
        
        const result = await fetch(_card.prints_search_uri);
        
        if (!result.ok) return res.status(result.status).json({ error: result.text });
        
        const card = await result.json();
        return res.status(200).json(card);
    }
    catch(err) {
        return res.status(500).json({ error: err.message });
    }
}


module.exports = {
    getRandomCard,
    getRandomCommander,
    getAllPrints,
    getCardById,
    searchCard
}