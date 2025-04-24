import React, { use, useEffect, useState } from "react";
import { Box, Button, Tab, TabList, TabPanel, Tabs, Textarea, Typography } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import { saveDeckToUser } from "../../db/decks";
import "../style/DeckBuilder.css"
import BasicModal from "../components/BasicModal";
import { CheckCircle, ContentPaste, MoreVert, Save } from "@mui/icons-material";
import ExportDeck from "../components/ExportDeck";
import { Card, Cards } from "scryfall-api";
import DeckCardDisplay from "../components/DeckCardDisplay";
import Toast from "../components/Snackbar";


// TODO: Donner des noms aux decks et les sauvegarder sous un uuid 

type Deck = { qty: number; card: Card }[];


export default function DeckBuilder({ user }) {

    const [deckId, setDeckId] = useState<string | null>(null);
    const [deckList, setDeckList] = useState("");
    const [parsedDeck, setParsedDeck] = useState<{ qty: number; card: Card; }[]>([]);

    const navigate = useNavigate();


    async function fetchCardObjects(deck: { qty: number; name: string; }[]): Promise<{ qty: number; card: Card; }[]> {
        if (deck.length === 0) return [];
        
        try {
            const cardPromises = deck.map(entry => Cards.byName(entry.name).then(card => card ? { card, qty: entry.qty } : undefined));
            const fetchedCards = await Promise.all(cardPromises);
    
            return fetchedCards.filter((entry): entry is { card: Card; qty: number } => entry !== undefined);
        }
        catch (err) {
            console.error("Erreur lors de la récupération des cartes: ", err);
            return [];
        }
    }


    async function parseDecklist(text: string) {
        const lines = text.split("\n").map(line => line.trim()).filter(line => line);

        const deckEntries = lines.map((line) => {
            const match = line.match(/^(\d+)\s+(.+)$/);
            if (!match) return null;

            const [, qty, name] = match;
            return { qty: parseInt(qty, 10), name: name.trim() };
        }).filter(entry => entry !== null) as { qty: number; name: string }[];

        const fetchedCards = await fetchCardObjects(deckEntries);
        setParsedDeck(fetchedCards);
    }


    const CARD_TYPES = [
        "Commander", "Creature", "Artifact", 
        "Enchantment", "Instant", "Sorcery", 
        "Planeswalker", "Battle", "Land" 
    ];

    function groupCardsByType(deck: Deck) {
        const groups: Record<string, Deck> = {};
        for (const type of CARD_TYPES) {
            groups[type] = [];
        }

        deck.forEach((entry, index) => {
            const { card } = entry;
            const typeline = entry.card.card_faces?.[0].type_line ?? entry.card.type_line;
            const isCreature = typeline.includes("Creature");
            const isLand = typeline.includes("Land");

            let commanders: typeof deck = [];
            {
                const potentialCommanders = deck.slice(-2); // les 3 dernières cartes
    
                const isCommanderType = (card: Card) => {
                    const t = card.type_line;
                    return (
                        t.includes("Legendary") ||
                        t.includes("Background") ||
                        card.oracle_text?.includes("can be your commander")
                    );
                };
    
                const validCandidates = potentialCommanders.filter(entry => isCommanderType(entry.card));
    
                if (validCandidates.length === 1) {
                    commanders = [validCandidates[0]];
                } else if (validCandidates.length >= 2) {
                    const background = validCandidates.find(e => e.card.type_line.includes("Background"));
                    const creature = validCandidates.find(e => e.card.type_line.includes("Legendary Creature"));
    
                    if (background && creature) {
                        commanders = [creature, background];
                    } else {
                        // Par défaut, on prend la dernière carte légendaire/commandable
                        const last = [...validCandidates].reverse().find(e => isCommanderType(e.card));
                        if (last) commanders = [last];
                    }
                }
    
                groups.Commander = commanders;
            }

            if (isCreature && !commanders.includes(entry))
                groups.Creature.push(entry);
            else if (isLand)
                groups.Land.push(entry);
            else if (typeline.includes("Artifact"))      groups.Artifact.push(entry);
            else if (typeline.includes("Enchantment"))   groups.Enchantment.push(entry);
            else if (typeline.includes("Instant"))       groups.Instant.push(entry);
            else if (typeline.includes("Sorcery"))       groups.Sorcery.push(entry);
            else if (typeline.includes("Planeswalker"))  groups.Planeswalker.push(entry);
            else if (typeline.includes("Battle"))        groups.Battle.push(entry);
        })

        return groups;
    }
    

    const [savedDeckToast, setSavedDeckToast] = useState(false);

    async function handleSaveDeck() {
        if (!user) {
            navigate("/login");
            return;
        }

        try {
            const updatedDeckId = await saveDeckToUser(user?.id, parsedDeck);
            setDeckId(updatedDeckId);
            // navigate(`/user/${user?.username}/${user?.id}`);
            setSavedDeckToast(true);
        }
        catch (err) {
            console.error("Erreur de sauvegarde : ", err);
        }
    }


    function updateCardQuantity(cardName: string, newQty: number) {
        const newDeck = parsedDeck
            .map(entry => entry.card.name === cardName ? { ...entry, qty: newQty } : entry);
        setParsedDeck(newDeck);
    }


    useEffect(() => {
        const updatedDeckList = parsedDeck.map(entry => `${entry.qty} ${entry.card.name}`).join('\n');
        setDeckList(updatedDeckList);
    }, [parsedDeck]);

    

    return (
        <Box>
            <Typography level="h2">DeckBuilder</Typography>
            <BasicModal icon={<MoreVert/>} title="Deck Options">

                <Tabs>
                    <TabList>
                        <Tab>Import Deck</Tab>
                        <Tab>Export Deck</Tab>
                    </TabList>

                    <TabPanel value={0}>
                        <Textarea 
                            className="text-area"
                            value={deckList}
                            onChange={(e) => setDeckList(e.target.value)} 
                            placeholder={"Paste your deck here!"}
                            minRows={4}
                            maxRows={4}
                        />
                        <Button 
                            startDecorator={<ContentPaste/>}
                            disabled={deckList === ""}
                            onClick={() => parseDecklist(deckList)}
                        >
                            Import
                        </Button>
                        <Button 
                            startDecorator={<Save/>}
                            disabled={deckList === ""}
                            onClick={() => {
                                parseDecklist(deckList);
                                handleSaveDeck();
                            }}
                        >
                            Import & save
                        </Button>
                    </TabPanel>
                    
                    <TabPanel value={1}>
                        <ExportDeck decklist={deckList}/>
                    </TabPanel>
                </Tabs>

            </BasicModal>
            <Button onClick={handleSaveDeck}>Save deck</Button>

            {parsedDeck.length > 0 && (() => {
                const grouped = groupCardsByType(parsedDeck);
                const types = Object.keys(grouped).filter(type => grouped[type].length > 0);

                return (
                    <Tabs defaultValue={0} className="main-editor">
                        <TabList className="deckbuilder">
                            {types.map((type, index) => {
                            
                            let sum = 0;
                            grouped[type].forEach(c => sum += c.qty);

                            return sum > 0 && (
                                <Tab key={index} className="deckbuilder-tab">
                                    <img src={`/icons/other/${type}_symbol.svg`} height={15} style={{ filter: "invert(100%)" }}/> 
                                    <Typography>{sum}</Typography>
                                </Tab>
                            )})}
                        </TabList>

                        {types.map((type, index) => (
                            <TabPanel key={index} value={index}>
                                <Box>
                                    {grouped[type].map((entry, i) => (
                                        <DeckCardDisplay
                                            key={i}
                                            card={entry.card}
                                            quantity={entry.qty}
                                            onQuantityChange={(newQty) => updateCardQuantity(entry.card.name, newQty)}
                                        />
                                    ))}
                                </Box>
                            </TabPanel>
                        ))}
                    </Tabs>
                )
            })()}

            <Toast
                open={savedDeckToast}
                onClose={() => setSavedDeckToast(false)}
                position="bottom left"
            >
                <Typography startDecorator={<CheckCircle sx={{ color: "green" }}/>}>
                    Deck successfully saved! 👍
                </Typography>
            </Toast>
        </Box>
    )
}