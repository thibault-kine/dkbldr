import { supabase } from "./supabase";

export async function saveDeckToUser(userId, decklist) {
    const { data, error } = await supabase
        .from("decks")
        .insert([{ user_id: userId, decklist }]);

    if (error) throw error;
    return data;
}