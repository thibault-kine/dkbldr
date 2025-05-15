import { useEffect, useState } from "react";
import { Deck, DeckList, getAllDecksFromUser, saveDeckToUser } from "../../db/decks";
import { User } from "@supabase/supabase-js";
import { Card, Cards } from "scryfall-api";
import { groupCardsByType } from "../../utils/deck";

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


    function delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    async function fetchCardObjects(deck: { qty: number; name: string }[]): Promise<DeckList> {

        const results: DeckList = [];

        for (const entry of deck) {
            try {
                const card = await Cards.byName(entry.name);
                if (card) {
                    results.push({ card, qty: entry.qty });
                    console.log(`Fetched ${entry.name}`);
                }
                else {
                    console.warn(`Card not found: ${entry.name}`);
                }
            }
            catch (err) {
                console.error(`Error fetching ${entry.name}: ${err}`);
            }

            await delay(50);
        }

        return results;
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
        const commanders = groupCardsByType(mainboard).Commander.map(e => e.card);
        const colorIdentity = commanders
            .flatMap(c => c.color_identity)
            .filter((val, i, self) => self.indexOf(val) === i);

        const newDeck: Deck = {
            id: "",
            userId: user.id,
            name: nameToSave,
            colorIdentity: colorIdentity,
            commanders: commanders,
            
            mainboard: mainboard,
            sideboard: sideboard,
        }

        const updatedDeckId = await saveDeckToUser(newDeck);
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