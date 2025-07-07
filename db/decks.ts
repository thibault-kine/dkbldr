import { Card } from "scryfall-api";
import { supabase } from "./supabase";
import { Archetype } from "./archetypes";


export type DeckList = { 
    qty: number; 
    card: Card 
}[];


export type Deck = {
    id?: string;
    userId: string;
    name: string;
    colorIdentity: string[];
    commanders: Card[];
    
    mainboard: DeckList;
    sideboard: DeckList;

    createdAt?: string;
    likes: number;
}


export async function saveDeckToUser(deck: Deck) {
    const { userId, name, colorIdentity, commanders, mainboard, sideboard } = deck;
    const { data, error } = await supabase
        .from("decks")
        .insert([{
            id: deck.id ?? "",
            name,
            commanders,
            color_identity: colorIdentity,
            mainboard,
            sideboard,
            user_id: userId,
        }]);

    // console.log(deck);

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
