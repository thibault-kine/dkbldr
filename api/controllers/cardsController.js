const headers = {
    "User-Agent": "Dkbldr/1.0",
    "Accept": "application/json"
};

async function getRandomCard(req, res) {
    try {
        const response = await fetch("https://api.scryfall.com/cards/random", { headers });

        console.log("Status: ", response.status);
        const body = await response.text();
        console.log("Body: ", body);

        if (!response.ok) {
            return res.status(response.status).json({
                error: "Failed to fetch card from Scryfall"
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

async function getRandomCommander(req, res) {
    try {
        const query = encodeURIComponent("legal:edh is:commander -t:background");

        const response = await fetch(`https://api.scryfall.com/cards/random?q=${query}`, { headers });

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
        const query = encodeURIComponent(req.params.q);
        const response = await fetch(`https://api.scryfall.com/cards/random?q=${query}`, { headers });

        if (!response.ok) {
            return res.status(response.status).json({
                error: "Scryfall API error"
            });
        }

        const card = await response.json();

        return res.status(200).json(card);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
}


async function getCardById(req, res) {
    try {
        const cardId = req.params.cardId;
        const response = await fetch(`https://api.scryfall.com/cards/${cardId}`, { headers });

        const card = await response.json();

        return res.status(200).json(card);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
}


async function getAllPrints(req, res) {
    try {
        const _card = await getCardById(req, res);
        const result = await fetch(_card.prints_search_uri, { headers });
        
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