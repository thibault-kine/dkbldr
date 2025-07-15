import { supabase } from "./supabase";


export type Archetype = {
    id: number;
    name: string;
}

export async function getAllArchetypes(): Promise<Archetype[]> {
    const { data, error } = await supabase
        .from("archetypes")
        .select("*");

    if (error || !data) {
        console.error("Erreur de récupération des archétypes :", error);
        return [];
    }

    return data;
}

export async function addArchetypesToDeck(deckId: string, archetypes: Archetype[]) {
    const entries = archetypes.map(a => ({ deck_id: deckId, archetype_id: a.id }));

    const { error } = await supabase
        .from("deck_archetype")
        .insert(entries);

    if (error) console.error("Erreur lors de l'ajout des archétypes :", error);
}

export async function getArchetypesForDeck(deckId: string): Promise<Archetype[] | null> {
    const { data, error } = await supabase
        .from("deck_archetype")
        .select("archetypes:archetype_id(id, name)") // alias pour récupérer les données liées
        .eq("deck_id", deckId)
        .single();

    if (error || !data) {
        console.error("Erreur de récupération des archétypes :", error);
        return [];
    }

    return data.archetypes;
}
