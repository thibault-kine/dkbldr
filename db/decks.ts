import { Card } from "scryfall-api";
import { supabase } from "./supabase";

export type DeckList = { 
    qty: number; 
    card: Card 
}[];

export type Deck = {
    name: string;
    deck: Card[];
}


export async function saveDeckToUser(userId: string, parsedDeck: DeckList, name?: string) {
    const { data, error } = await supabase
        .from("decks")
        .insert([{
            user_id: userId,
            name: name,
            decklist: parsedDeck,
        }]);

    if (error) throw error;
    return data;
}


export async function getAllDecksFromUser(userId: string) {
    const { data, error } = await supabase
        .from("decks")
        .select("*")
        .eq("user_id", userId);
    
    if (error) throw error;
    return data;
}
