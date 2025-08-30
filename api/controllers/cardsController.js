const Cards = require("scryfall-api")


async function getRandomCard(req, res) {
    try {
        const result = await Cards.random();
        
        if (!result.ok) return res.status(result.status).json({ error: err.message });
        const card = await result.json();

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

        const result = await fetch("https://api.scryfall.com/cards/random?q=legal:edh is:commander -t:background -otag:synergy-sticker", {
            method: "GET", 
            headers: {
                "Content-Type": "application/json"
            }
        });
        
        if (!result.ok) return res.status(result.status).json({ error: result.text });
        const card = await result.json();

        console.log("🔵 getRandomCommander - 200");
        return res.status(200).json(card);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
}


async function searchCard(req, res) {
    try {
        const query = req.params.q;
        const result = await Cards.byName(query, true);
        
        if (!result) return res.status(404).json({ error: "Data not found" });
        const card = await result.json();
        
        console.log("🔵 searchCard - 200");
        return res.status(200).json(card);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
}


async function getCardById(req, res) {
    try {
        const cardId = req.params.cardId;
        const result = await Cards.byId(cardId.toString());
        
        if (!result) return res.status(404).json({ error: "Data not found" });
        const card = await result.json();
        
        console.log("🔵 getCardById - 200");
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
        console.log("🔵 getAllPrints - 200");
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