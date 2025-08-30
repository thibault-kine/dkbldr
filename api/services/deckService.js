const { supabase } = require("./supabase")


async function getDeckById(req, res) {
    try {
        const deckId = req.params.deckId;

        const { data, error } = await supabase
        .from("decks")
        .select("*")
        .eq("id", deckId)
        .single();
        
        if (error) return res.status(500).json({ error: error.message });
        
        console.log("🔵 getDeckById - 200");
        return res.status(200).json(data);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
}


module.exports = {
    getDeckById
}