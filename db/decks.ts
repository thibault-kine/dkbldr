import { Card } from "scryfall-api";
import { supabase } from "./supabase";

export async function saveDeckToUser(userId: string, parsedDeck: { qty: number, card: Card }[]) {
    const { data, error } = await supabase
        .from("decks")
        .insert([
            {
                user_id: userId,
                decklist: parsedDeck, // Objet JSON complet
            }
        ]);

    if (error) throw error;
    return data;
}
