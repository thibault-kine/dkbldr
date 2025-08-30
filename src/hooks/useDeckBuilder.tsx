import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { Card, Cards } from "scryfall-api";
import { groupCardsByType } from "../../utils/deck";
import { Archetype, Deck, DeckList, decksApi } from "../services/api";

export function useDeckBuilder(user: User, initialId?: string) {

    const [deckId, setDeckId] = useState<string | null>(null);
    const [deckName, setDeckName] = useState("");
    const [deckListText, setDeckListText] = useState("");

    const [mainboard, setMainboard] = useState<DeckList>([]);
    const [sideboard, setSideboard] = useState<DeckList>([]);

    const [archetypes, setArchetypes] = useState<Archetype[]>([]);

    const [deck, setDeck] = useState<Deck>({
        id: initialId ?? undefined,
        name: "",
        user_id: user?.id,
        color_identity: [],
        commanders: [],
        mainboard: [],
        sideboard: [],
        archetypes: [],
        likes: 0
    });

    const [currentMBTab, setCurrentMBTab] = useState(0);
    const [currentSBTab, setCurrentSBTab] = useState(0);

    const [isImporting, setIsImporting] = useState(false);
    const [importProgress, setImportProgress] = useState(0);


    useEffect(() => {
        const updatedDeckList = mainboard.map(entry => `${entry.qty} ${entry.card.name}`).join("\n");
        setDeckListText(updatedDeckList);
    }, [mainboard]);


    async function getNextUnnamedDeckName(userId: string): Promise<string> {
        const decks = await decksApi.getAllFromUser(userId);
        const unnamedNumbers = decks
            .map(deck => {
                const match = deck.name.match(/^Unnamed Deck (\d+)$/);
                return match ? parseInt(match[1]) : 0;
            }).filter(n => n > 0);
        
        const max = unnamedNumbers.length > 0 ? Math.max(...unnamedNumbers) : 0;
        return `Unnamed Deck ${max + 1}`;
    }


    async function getDeckName(): Promise<string> {
        // Si le deck est nommé, on renvoie son nom
        if (deckName.trim()) return deckName.trim();

        // Sinon on l'appelle "Unnamed Deck <n++>"
        const unnamedDecks = await decksApi.getAllFromUser(user.id);
        const count = unnamedDecks.filter(d => d.name?.startsWith("Unnamed Deck")).length;
        
        return `Unnamed Deck ${count + 1}`;
    }


    async function fetchCardObjects(deck: { qty: number; name: string }[]): Promise<DeckList> {
        const results: DeckList = [];
        setIsImporting(true);
        setImportProgress(0);

        for (let i = 0; i < deck.length; i++) {
            const entry = deck[i];
            
            const card = await Cards.byName(entry.name).catch(() => null);
            if (card) results.push({ card, qty: entry.qty });

            const progress = Math.round(((i + 1) / deck.length) * 100);
            setImportProgress(progress);
            await new Promise(r => setTimeout(r, 70));
        }

        setIsImporting(false);
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
        return fetchedCards;
    }


    function updateCardQuantity(cardName: string, newQty: number) {
        setMainboard(deck => 
            deck.map(entry => 
                entry.card.name === cardName ? { ...entry, qty: newQty } : entry
            )
        );
    }


    async function save() {
        const nameToSave = deckName ?? await getNextUnnamedDeckName(user.id);
        const commanders = groupCardsByType(mainboard).Commander.map(e => e.card);
        const colorIdentity = commanders
            .flatMap(c => c.color_identity)
            .filter((val, i, self) => self.indexOf(val) === i);

        const newDeck: Deck = {
            id: deckId ?? "",
            user_id: user.id,
            name: nameToSave,
            color_identity: colorIdentity,
            commanders: commanders,
            
            mainboard: mainboard,
            sideboard: sideboard,

            archetypes: archetypes,
            likes: 0,
        }

        const updatedDeck = await decksApi.create(user.id, newDeck);
        setDeckId(updatedDeck.id!);
        return updatedDeck;
    }


    return {
        deckId, setDeckId,

        deck, setDeck,

        deckName,
        getNextUnnamedDeckName,
        getDeckName,
        setDeckName,
    
        deckListText,
        setDeckListText,

        mainboard,
        setMainboard,

        sideboard,
        setSideboard,

        archetypes,
        setArchetypes,

        currentMBTab,
        setCurrentMBTab,

        currentSBTab,
        setCurrentSBTab,

        isImporting,
        importProgress,

        parseDeckList,
        updateCardQuantity,
        save
    };
}