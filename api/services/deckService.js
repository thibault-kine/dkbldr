const { supabase } = require("./supabase")


async function getDeckById(deckId) {
    const { data, error } = await supabase
        .from("decks")
        .select("*")
        .eq("id", deckId)
        .single();

    if (error) throw new Error(error.message);

    return data;
}


module.exports = {
    getDeckById
}