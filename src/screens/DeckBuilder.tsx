import React, { use, useEffect, useState } from "react";
import { Box, Button, Tab, TabList, TabPanel, Tabs, Textarea, Typography } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import { saveDeckToUser } from "../../db/decks";
import "../style/DeckBuilder.css"
import BasicModal from "../components/BasicModal";
import { ContentPaste, MoreVert, Save } from "@mui/icons-material";
import ExportDeck from "../components/ExportDeck";
import { Card, Cards } from "scryfall-api";
import DeckCardDisplay from "../components/DeckCardDisplay";



export default function DeckBuilder({ user }) {

    const [deckId, setDeckId] = useState<string | null>(null);
    const [deckList, setDeckList] = useState("");
    const [parsedDeck, setParsedDeck] = useState<{ card: Card; qty: number; }[]>([]);

    const navigate = useNavigate();


    async function fetchCardObjects(deck: { name: string; qty: number; }[]): Promise<{ card: Card; qty: number }[]> {
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
        const cardNames: string[] = [];

        const deckEntries = lines.map((line) => {
            const match = line.match(/^(\d+)\s+(.+)$/);
            // const match = line.match(/^(\d+)\s+(.+?)(?:\s+\((\w+)\)\s+(\d+))?$/);
            if (!match) return null;

            const [, qty, name] = match;
            return { name: name.trim(), qty: parseInt(qty, 10) };
        }).filter(entry => entry !== null) as { name: string; qty: number }[];

        const fetchedCards = await fetchCardObjects(deckEntries);
        setParsedDeck(fetchedCards);
        console.log(fetchedCards);
    }
    

    async function handleSaveDeck() {
        if (!user) {
            navigate("/login");
            return;
        }

        try {
            const updatedDeckId = await saveDeckToUser(user?.id, deckId, deckList);
            setDeckId(updatedDeckId);
            // navigate(`/user/${user?.username}/${user?.id}`);
        }
        catch (err) {
            console.error("Erreur de sauvegarde : ", err);
        }
    }

    function updateCardQuantity(cardName: string, newQty: number) {
        const newDeck = parsedDeck
            .map(entry => entry.card.name === cardName ? { ...entry, qty: newQty } : entry)
            .filter(entry => entry.qty > 0);
        setParsedDeck(newDeck);
    }


    useEffect(() => {
        const updatedDeckList = parsedDeck.map(entry => `${entry.qty} ${entry.card.name}`).join('\n');
        setDeckList(updatedDeckList);
        console.log("Updated decklist : " + updatedDeckList);
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

            {parsedDeck.length > 0 && (
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                    }}
                >
                    {parsedDeck.map((entry, index) => (
                        <DeckCardDisplay 
                            key={index} 
                            card={entry.card} 
                            quantity={entry.qty} 
                            onQuantityChange={(newQty) => updateCardQuantity(entry.card.name, newQty)}
                        />
                    ))}
                </Box>
            )}
        </Box>
    )
}