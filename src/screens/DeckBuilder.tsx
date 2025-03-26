import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Dropdown, IconButton, Input, List, ListItem, Menu, MenuButton, MenuItem, Tab, TabList, TabPanel, Tabs, Textarea, Typography } from "@mui/joy";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { saveDeckToUser } from "../../db/decks";
import "../style/DeckBuilder.css"
import BasicModal from "../components/BasicModal";
import { AutoAwesome, MoreVert, OpenInNew, SwapHoriz } from "@mui/icons-material";
import ExportDeck from "../components/ExportDeck";
import { getAllCards, searchCard } from "../../api/cards";
import { Card, Cards } from "scryfall-api";
import DeckCardDisplay from "../components/DeckCardDisplay";



export default function DeckBuilder({ user }) {

    const [deckList, setDeckList] = useState("");
    const [parsedDeck, setParsedDeck] = useState<{ card: Card; qty: number; }[]>([]);

    const inputRef = useRef<HTMLInputElement>(null);

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
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                        }}
                    >
                        {parsedDeck.map((entry, index) => (
                            <Dropdown>
                                <MenuButton sx={{ display: 'contents' }} key={index}>
                                    <DeckCardDisplay card={entry.card} quantity={entry.qty} />
                                </MenuButton>

                                <Menu>
                                    <MenuItem
                                        className="card-menu"
                                        onClick={() => window.open(entry.card.scryfall_uri, '_blank', 'noreferrer')}
                                    >
                                        See card on Scryfall <img src="/icons/other/scryfall.svg" width={25}/>
                                    </MenuItem>
                                    <MenuItem className="card-menu">Switch printing <AutoAwesome/></MenuItem>
                                    <MenuItem 
                                        className="card-menu"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        Change quantity
                                        <Input
                                            defaultValue={1}
                                            type="number"
                                            slotProps={{
                                                input: {
                                                    ref: inputRef,
                                                    min: 1,
                                                    max: 99,
                                                    step: 1
                                                }
                                            }}
                                        />
                                    </MenuItem>
                                    <MenuItem className="card-menu">Move to sideboard <SwapHoriz/></MenuItem>
                                </Menu>
                            </Dropdown>
                        ))}
                    </Box>
                </Box>
            )}
        </Box>
    )
}