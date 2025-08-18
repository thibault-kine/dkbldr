import { Card } from "scryfall-api";
import { supabase } from "./supabase";
import { Archetype } from "./archetypes";


export type DeckList = { 
    qty: number; 
    card: Card 
}[];


export type Deck = {
    id?: string;
    user_id: string;
    name: string;
    color_identity: string[];
    commanders: Card[];
    
    mainboard: DeckList;
    sideboard: DeckList;

    created_at?: string;
    archetypes: number[];
    likes: number;

    is_test: boolean;
}


export async function saveDeckToUser(deck: Deck, is_test: boolean = false) {
    const { user_id, name, color_identity: colorIdentity, commanders, mainboard, sideboard } = deck;
    const { data, error } = await supabase
        .from("decks")
        .insert([{
            id: deck.id,
            name,
            commanders,
            color_identity: colorIdentity,
            mainboard,
            sideboard,
            user_id,
            is_test
        }]);

    console.log(deck);

    if (error) throw error;
    return data;
}


export async function getAllDecksFromUser(userId: string): Promise<Deck[]> {
    const { data, error } = await supabase
        .from("decks")
        .select("*")
        .eq("user_id", userId);
    
    if (error) throw error;
    return data;
}


export async function getDeckById(id: string): Promise<Deck | null> {
    const { data, error } = await supabase
        .from('decks')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        return null;
    }

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


export async function deleteDeck(id: string) {
    const { data, error } = await supabase
        .from("decks")
        .delete()
        .eq("id", id)
        .select();

    if (error) throw error;
    return data;
}