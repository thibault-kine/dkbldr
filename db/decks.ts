import { Card } from "scryfall-api";
import { supabase } from "./supabase";


export type DeckList = { 
    qty: number; 
    card: Card 
}[];


export type Deck = {
    id: string;
    name: string;
    colorIdentity: string[];
    commanders: Card[];
    
    mainboard: DeckList;
    sideboard: DeckList;

    createdAt?: string;
}


export async function saveDeckToUser(userId: string, mainboard: DeckList, sideboard: DeckList, name?: string) {
    const { data, error } = await supabase
        .from("decks")
        .insert([{
            user_id: userId,
            name: name,
            mainboard: mainboard,
            sideboard: sideboard,
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


export async function getDeckById(id: string) {
    const { data, error } = await supabase
        .from("decks")
        .select("*")
        .eq("id", id)
        .single();
    
    if (error) throw error;
    return data;
}


export async function updateDeckList(id: string, mainboard: DeckList, sideboard: DeckList) {
    const { data, error } = await supabase
        .from("decks")
        .update({
            mainboard: mainboard,
            sideboard: sideboard
        })
        .eq("id", id);

    if (error) throw error;
    return data;    
}
