import { supabase } from "./supabase";

export async function saveDeckToUser(userId, deckId, decklist) {
    
    // Le deck n'existe pas encore, on le créé
    if (!deckId) {
        const { data, error } = await supabase
            .from("decks")
            .insert([{ user_id: userId, decklist }])
            .select("id");
    
        if (error) throw error;
        console.log(`deck saved (id = ${data?.[0].id})`);
        return data?.[0].id;
    }
    // Le deck existe déjà, on le met à jour
    else {
        const { error } = await supabase
            .from("decks")
            .update({ decklist })
            .eq("id", deckId)
            .eq("user_id", userId);

        if (error) throw error;
        console.log(`deck saved (id = ${deckId})`);
        return deckId;
    }
}