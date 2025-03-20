import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Input, List, ListItem, Tab, TabList, TabPanel, Tabs, Textarea, Typography } from "@mui/joy";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { saveDeckToUser } from "../../db/decks";
import "../style/DeckBuilder.css"
import BasicModal from "../components/BasicModal";
import { MoreVert } from "@mui/icons-material";
import ExportDeck from "../components/ExportDeck";
import { searchCard } from "../../api/cards";


export interface CardEntry {
    quantity: number;
    name: string;
    setCode?: string | null;
    collecNum?: string | null;
}


export default function DeckBuilder({ user }) {

    const [deckList, setDeckList] = useState("");
    const [parsedDeck, setParsedDeck] = useState<CardEntry[]>([]);

    const navigate = useNavigate();


    function parseDecklist(text: string) {
        const lines = text.split("\n");
        const deck: CardEntry[] = [];

        lines.forEach((line) => {
            const match = line.match(/^(\d+)\s+(.+?)(?:\s+\((\w+)\)\s+(\d+))?$/);
            if (match) {
                const [, qty, name, setCode, collecNum] = match;
                deck.push({
                    quantity: parseInt(qty, 10),
                    name: name.trim(),
                    setCode: setCode || null,
                    collecNum: collecNum || null,
                });
            }
        });

        setParsedDeck(deck);
        console.table(deck);
    }
    

    async function handleSaveDeck() {
        if (!user) {
            navigate("/login");
        }

        try {
            await saveDeckToUser(user?.id, parsedDeck);
            navigate(`/user/${user?.username}/${user?.id}`);
        }
        catch (err) {
            console.error("Erreur de sauvegarde : ", err);
        }
    }
    

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
                            disabled={deckList === undefined}
                            onClick={() => parseDecklist(deckList)}
                        >Import</Button>
                        <Button 
                            disabled={deckList === undefined}
                            onClick={() => {
                                parseDecklist(deckList);
                                handleSaveDeck();
                            }}
                        >Import & save</Button>
                    </TabPanel>
                    
                    <TabPanel value={1}>
                        <ExportDeck decklist={deckList}/>
                    </TabPanel>
                </Tabs>

            </BasicModal>

            {parsedDeck.length > 0 && (
                <Box>
                    <Typography>Deck Preview:</Typography>
                    <List>
                        {parsedDeck.map((card, index) => (
                            <ListItem key={index}>
                                {card.quantity}x {card.name} {card.setCode ? `(${card.setCode}) ${card.collecNum || ""}` : ""}
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}
        </Box>
    )
}