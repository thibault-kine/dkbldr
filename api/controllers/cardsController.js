const Scryfall = require("scryfall-api");


async function getRandomCard(req, res) {
    try {
        const card = await Scryfall.Cards.random();
        console.log("card: ", card);
        return res.status(200).json(card);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

async function getRandomCommander(req, res) {
    try {
        const query = encodeURIComponent(
            "legal:edh is:commander -t:background"
        );

        const response = await fetch(
            `https://api.scryfall.com/cards/random?q=${query}`
        );

        if (!response.ok) {
            return res.status(response.status).json({
                error: "Scryfall API error"
            });
        }

        const card = await response.json();

        return res.status(200).json(card);
    }
    catch (err) {
        console.error(err);

        return res.status(500).json({
            error: err.message
        });
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