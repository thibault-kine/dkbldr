import React, { use, useEffect, useState } from "react";
import { Box, Button, IconButton, Input, LinearProgress, Tab, TabList, TabPanel, Tabs, Textarea, Typography } from "@mui/joy";
import { useNavigate, useParams } from "react-router-dom";
import { DeckList, getAllDecksFromUser, getDeckById, saveDeckToUser } from "../../db/decks";
import "../style/DeckBuilder.css"
import BasicModal from "../components/BasicModal";
import { Add, CheckCircle, ContentPaste, Man, MoreVert, Save, Settings } from "@mui/icons-material";
import ExportDeck from "../components/ExportDeck";
import { Card, Cards } from "scryfall-api";
import DeckCardDisplay from "../components/DeckCardDisplay";
import Toast from "../components/Snackbar";
import { Deck } from "../../db/decks";
import { useDeckBuilder } from "../hooks/useDeckBuilder";
import { groupCardsByType } from "../../utils/deck";
import CardSearchbar from "../components/CardSearchbar";


export default function DeckBuilder({ user }) {

    const { id: deckId } = useParams();

    const {
        // deckId,
        setDeckId,

        deckName,
        setDeckName,
    
        deckListText,
        setDeckListText,

        getNextUnnamedDeckName,

        mainboard,
        setMainboard,

        sideboard,
        setSideboard,

        currentMBTab,
        setCurrentMBTab,

        currentSBTab,
        setCurrentSBTab,

        isImporting,
        importProgress,

        parseDeckList,
        updateCardQuantity,
        save
    } = useDeckBuilder(user, deckId);    

    const [pendingSaveAfterImport, setPendingSaveAfterImport] = useState(false);

    const [importedDeckToast, setImportedDeckToast] = useState(false);
    const [savedDeckToast, setSavedDeckToast] = useState(false);


    async function loadDeckFromDb(id: string) {
        try {
            const deck = await getDeckById(id);
            if (deck) {
                setDeckName(deck.name);
                setMainboard(deck.mainboard);
                setSideboard(deck.sideboard);
            }
        }
        catch (e) {
            return;
        }
    }


    useEffect(() => {

        if (deckId) {
            setDeckId(deckId);
            loadDeckFromDb(deckId);
        }

        if (!deckId && user && deckName === "") {
            getNextUnnamedDeckName(user.id).then(name => setDeckName(name));
        }

        if (pendingSaveAfterImport && mainboard.length > 0) {
            save();
            setPendingSaveAfterImport(false);
            setSavedDeckToast(true);
        }

    }, [deckId, user, deckName, mainboard])


    function addToDeck(card: Card) {
        if (!card) return;
        
        if (mainboard.find(entry => entry.card.name == card.name)) {
            mainboard.find(entry => entry.qty++);
        } else {
            setMainboard([{ qty: 1, card: card }, ...mainboard])
        }
    }


    return (
        <Box>
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly" }}>
            
            <Input
                // value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                sx={{ width: "100%" }}
                placeholder={deckName ?? "New Deck"}
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
                            onChange={(e) => setDeckListText(e.target.value)} 
                            placeholder={"Paste your deck here!"}
                            minRows={4} maxRows={4}
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
                                setPendingSaveAfterImport(true);
                                await parseDeckList(deckListText);
                                setSavedDeckToast(true);
                            }}
                        >
                            Import & save
                        </Button>

                        {isImporting && (
                            <Box sx={{ width: "100%", mt: 2 }}>
                                <LinearProgress determinate value={importProgress} />
                                <Typography textAlign="center" mt={0.5}>
                                    Importing deck... ({importProgress}%)
                                </Typography>
                            </Box>
                        )}
                    </TabPanel>
                    
                    <TabPanel value={1}>
                        <ExportDeck decklist={deckListText}/>
                    </TabPanel>
                </Tabs>

            </BasicModal>
            
            <Button 
                disabled={mainboard.length <= 0} 
                className="square-btn" 
                onClick={async () => {
                    await save();
                    setSavedDeckToast(true);
                }}
            >
                <Save/>
            </Button>
            </Box>

            <CardSearchbar 
                onSelected={(card) => addToDeck(card)}
                sx={{
                    width: "100%",
                    margin: "5px 0"
                }}    
            />

            <Tabs defaultValue={0}>
                <TabList tabFlex={1}>
                    <Tab className="deckbuilder-tab">
                        <Typography sx={{ fontWeight: "bold" }}>Mainboard</Typography>
                    </Tab>
                    <Tab className="deckbuilder-tab">
                        <Typography sx={{ fontWeight: "bold" }}>Sideboard</Typography>
                    </Tab>
                </TabList>

                <TabPanel value={0} sx={{ padding: "0" }}>
                    <Box sx={{ padding: "0" }}>
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
                                                        inSideboard={false}
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
                    </Box>
                </TabPanel>

                <TabPanel value={1} sx={{ padding: "0" }}>
                    {sideboard.length > 0 && (() => {
                            const grouped = groupCardsByType(sideboard);
                            const types = Object.keys(grouped).filter(type => grouped[type].length > 0);

                            return (
                                <Tabs defaultValue={currentSBTab} onChange={(_, val) => setCurrentMBTab(val as number)} className="main-editor">
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
                                                        inSideboard={true}
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
                </TabPanel>
            </Tabs>


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