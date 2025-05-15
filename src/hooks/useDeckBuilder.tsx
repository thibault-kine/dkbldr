import { useEffect, useState } from "react";
import { DeckList, getAllDecksFromUser, saveDeckToUser } from "../../db/decks";
import { User } from "@supabase/supabase-js";
import { Card, Cards } from "scryfall-api";

export function useDeckBuilder(user: User) {

    const [deckId, setDeckId] = useState<string | null>(null);
    const [deckName, setDeckName] = useState("");
    const [deckListText, setDeckListText] = useState("");

    const [mainboard, setMainboard] = useState<DeckList>([]);
    const [sideboard, setSideboard] = useState<DeckList>([]);

    const [currentMBTab, setCurrentMBTab] = useState(0);
    const [currentSBTab, setCurrentSBTab] = useState(0);


    useEffect(() => {
        const updatedDeckList = mainboard.map(entry => `${entry.qty} ${entry.card.name}`).join("\n");
        setDeckListText(updatedDeckList);
    }, [mainboard]);


    async function getDeckName(): Promise<string> {
        // Si le deck est nommé, on renvoie son nom
        if (deckName.trim()) return deckName.trim();

        // Sinon on l'appelle "Unnamed Deck <n++>"
        const unnamedDecks = await getAllDecksFromUser(user.id);
        const count = unnamedDecks.filter(d => d.name?.startsWith("Unnamed Deck")).length;
        
        return `Unnamed Deck ${count + 1}`;
    }


    async function fetchCardObjects(deck: { qty: number; name: string }[]): Promise<DeckList> {
        const cardPromises = deck.map(entry =>
            Cards.byName(entry.name).then(card => card ? { card, qty: entry.qty } : undefined)
        );
        const results = await Promise.all(cardPromises);

        return results.filter((e): e is { card: Card; qty: number } => !!e);
    }


    async function parseDeckList(text: string) {
        const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
        const entries = lines
            .map(line => {
                const match = line.match(/^(\d+)\s+(.+)$/);
                if (!match) return null;

                const [, qty, name] = match;
                return { qty: parseInt(qty), name };
            })
            .filter((e): e is { qty: number; name: string } => !!e);

        const fetchedCards = await fetchCardObjects(entries);
        setMainboard(fetchedCards);
    }


    function updateCardQuantity(cardName: string, newQty: number) {
        setMainboard(deck => 
            deck.map(entry => 
                entry.card.name === cardName ? { ...entry, qty: newQty } : entry
            )
        );
    }


    async function save() {
        const nameToSave = await getDeckName();
        const updatedDeckId = await saveDeckToUser(user.id, mainboard, sideboard, nameToSave);
        setDeckId(updatedDeckId);
        return updatedDeckId;
    }


    return {
        deckId,

        deckName,
        setDeckName,
    
        deckListText,
        setDeckListText,

        mainboard,
        setMainboard,

        sideboard,
        setSideboard,

        currentMBTab,
        setCurrentMBTab,

        currentSBTab,
        setCurrentSBTab,

        parseDeckList,
        updateCardQuantity,
        save
    };
}