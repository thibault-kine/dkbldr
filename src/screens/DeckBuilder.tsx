import React, { use, useEffect, useState } from "react";
import { Box, Button, Input, Tab, TabList, TabPanel, Tabs, Textarea, Typography } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import { DeckList, getAllDecksFromUser, saveDeckToUser } from "../../db/decks";
import "../style/DeckBuilder.css"
import BasicModal from "../components/BasicModal";
import { CheckCircle, ContentPaste, MoreVert, Save, Settings } from "@mui/icons-material";
import ExportDeck from "../components/ExportDeck";
import { Card, Cards } from "scryfall-api";
import DeckCardDisplay from "../components/DeckCardDisplay";
import Toast from "../components/Snackbar";
import { Deck } from "../../db/decks";
import { useDeckBuilder } from "../hooks/useDeckBuilder";
import { groupCardsByType } from "../../utils/deck";


export default function DeckBuilder({ user }) {

    const navigate = useNavigate();

    const {
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
    } = useDeckBuilder(user);    

    const [importedDeckToast, setImportedDeckToast] = useState(false);
    const [savedDeckToast, setSavedDeckToast] = useState(false);

    async function handleSaveDeck() {
        if (!user) {
            navigate("/login");
            return;
        }

        try {
            save();
            setSavedDeckToast(true);
        }
        catch (err) {
            console.error("Erreur de sauvegarde : ", err);
        }
    }


    return (
        <Box>
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly" }}>
            
            <Input
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                sx={{ width: "100%" }}
                placeholder="New Deck"
            />

            <BasicModal icon={<Settings/>} title="">

                <Tabs>
                    <TabList>
                        <Tab>Import Deck</Tab>
                        <Tab>Export Deck</Tab>
                    </TabList>

                    <TabPanel value={0}>
                        <Textarea 
                            className="text-area"
                            value={deckListText}
                            onChange={(e) => setDeckListText(e.target.value)} 
                            placeholder={"Paste your deck here!"}
                            minRows={4}
                            maxRows={4}
                        />
                        <Button 
                            startDecorator={<ContentPaste/>}
                            disabled={deckListText === ""}
                            onClick={async () => {
                                await parseDeckList(deckListText)
                                setImportedDeckToast(true);
                            }}
                        >
                            Import
                        </Button>
                        <Button 
                            startDecorator={<Save/>}
                            disabled={deckListText === ""}
                            onClick={async () => {
                                await parseDeckList(deckListText);
                                handleSaveDeck();
                            }}
                        >
                            Import & save
                        </Button>
                    </TabPanel>
                    
                    <TabPanel value={1}>
                        <ExportDeck decklist={deckListText}/>
                    </TabPanel>
                </Tabs>

            </BasicModal>
            <Button className="square-btn" onClick={handleSaveDeck}><Save/></Button>
            </Box>

            {mainboard.length > 0 && (() => {
                const grouped = groupCardsByType(mainboard);
                const types = Object.keys(grouped).filter(type => grouped[type].length > 0);

                return (
                    <Tabs defaultValue={currentMBTab} onChange={(_, val) => setCurrentMBTab(val as number)} className="main-editor">
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
                                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
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

            <Toast
                open={importedDeckToast}
                onClose={() => setImportedDeckToast(false)}
                position="bottom left"
            >
                <Typography startDecorator={<CheckCircle sx={{ color: "green" }}/>}>
                    Deck successfully imported! 👍
                </Typography>
            </Toast>
        </Box>
    )
}