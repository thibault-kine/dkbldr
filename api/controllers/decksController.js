const { supabase } = require("../services/supabase");


async function getAllDecksFromUser(req, res) {
    const userId = req.params.userId;

    const { data, error } = await supabase
        .from("decks")
        .select("*")
        .eq("user_id", userId);

    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json(data);
}

async function updateDeckList(req, res) {
    try {
        const id = req.params.deckId;
        const { mainboard, sideboard } = req.body;
    
        const { data, error } = await supabase
            .from("decks")
            .update({
                mainboard: mainboard,
                sideboard: sideboard
            })
            .eq("id", id)
            .select();
    
        if (error) return res.status(500).json({ error: error.message });
        
        return res.status(200).json(data);
    } catch(err) {
        return res.status(500).json({ error: err.message });
    }
}

async function saveDeckToUser(req, res) {
    try {
        const user_id = req.params.userId;
        
        const { id, name, color_identity, commanders, mainboard, sideboard } = req.body;
        const { data, error } = await supabase
            .from("decks")
            .insert([{
                id,
                name,
                commanders,
                color_identity,
                mainboard,
                sideboard,
                user_id,
            }]);
        
        if (error) return res.status(500).json({ error: error.message });
    
        return res.status(200).json(data);
    } catch(err) {
        return res.status(500).json({ error: err.message });
    }
}

async function deleteDeck(req, res) {
    try {
        const deckId = req.params.deckId;
        
        const { data, error } = await supabase
        .from("decks")
        .delete()
        .eq("id", deckId)
        .select();
        
        if (error) return res.status(500).json({ error: error.message });
        
        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}


module.exports = {
    getAllDecksFromUser,
    updateDeckList,
    saveDeckToUser,
    deleteDeck
}