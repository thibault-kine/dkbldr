import { supabase } from "./supabase";


export type Archetype = {
    id: number;
    name: string;
}


export async function getArchetypesByDeckId(deckId: number) {
    const { data, error } = await supabase
        .from("decks")
        .select("archetypes")
        .eq("id", deckId);

    if (error) throw error;
    else return data;
}