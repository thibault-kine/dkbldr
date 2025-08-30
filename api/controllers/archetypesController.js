const { supabase } = require("../services/supabase");


async function getAllArchetypes(req, res) {
    try {
        const { data, error } = await supabase
            .from('archetypes')
            .select("*");
        
        if (error) return res.status(500).json({ error: error.message });
        
        console.log("🔵 getAllArchetypes - 200");
        return res.status(200).json(data);
    } catch(err) {
        return res.status(500).json({ error: err.message });
    }
}

async function addArchetypesToDeck(req, res) {
    try {
        const deckId = req.params.deckId;
        const archetypes = req.body.archetypes;
        
        const entries = archetypes.map(a => ({ deck_id: deckId, archetype_id: a.id }));
        
        const { error } = await supabase
        .from("deck_archetype")
        .insert(entries);
        
        if (error) return res.status(500).json({ error: error.message });
        
        console.log("🔵 addArchetypesToDeck - 200");
        return res.status(200);
    } catch(err) {
        return res.status(500).json({ error: err.message });
    }
}

async function getArchetypesForDeck(req, res) {
    try {
        const deckId = req.params.deckId;
        
        const { data, error } = await supabase
        .from("deck_archetype")
        .select("archetypes:archetype_id(id, name)") // alias pour récupérer les données liées
        .eq("deck_id", deckId)
        .single();
        
        if (error) return res.status(500).json({ error: error.message });
        
        console.log("🔵 getArchetypesForDeck - 200");
        return res.status(200).json(data.archetypes);
    } catch(err) {
        return res.status(500).json({ error: err.message });
    }
}


module.exports = {
    getAllArchetypes,
    getArchetypesForDeck,
    addArchetypesToDeck
}