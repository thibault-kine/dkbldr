import React, { use, useEffect, useState } from "react";
import { Box, Button, Chip, IconButton, Input, LinearProgress, Option, Select, Tab, TabList, TabPanel, Tabs, Textarea, Typography } from "@mui/joy";
import { useNavigate, useParams } from "react-router-dom";
import "../style/DeckBuilder.css"
import BasicModal from "../components/BasicModal";
import { Add, CheckCircle, ContentPaste, LocalOfferOutlined, Man, MoreVert, Save, Settings, Tag, TagOutlined } from "@mui/icons-material";
import ExportDeck from "../components/ExportDeck";
import { Card, Cards } from "scryfall-api";
import DeckCardDisplay from "../components/DeckCardDisplay";
import Toast from "../components/Snackbar";
import { useDeckBuilder } from "../hooks/useDeckBuilder";
import { groupCardsByType } from "../../utils/deck";
import CardSearchbar from "../components/CardSearchbar";
import { getSupabase } from "../../db/supabase";
import { Archetype, archetypesApi, decksApi } from "../services/api";


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

        archetypes,
        setArchetypes,

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
    const [checkDeckExists, setCheckDeckExists] = useState(false);

    const [importedDeckToast, setImportedDeckToast] = useState(false);
    const [savedDeckToast, setSavedDeckToast] = useState(false);


    async function loadDeckFromDb(id: string) {
        try {
            const deck = await decksApi.getById(id);
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

    const [archetypeList, setArchetypeList] = useState<Archetype[]>();

    useEffect(() => {
        const init = async () => {
            if (deckId && !checkDeckExists) {
                setDeckId(deckId);
                const existingDeck = await decksApi.getById(deckId);
                if (existingDeck) {
                    setDeckName(existingDeck.name);
                    setMainboard(existingDeck.mainboard);
                    setSideboard(existingDeck.sideboard);
                } else {
                    // Si le deck n'existe pas en DB, ne pas lancer le chargement
                    // et laisser l'utilisateur commencer à builder son deck
                    console.log("Deck inexistant en base, démarrage d’un nouveau deck.");
                }

                setCheckDeckExists(true);
            }

            if (!deckId && user && deckName === "") {
                const name = await getNextUnnamedDeckName(user.id);
                setDeckName(name);
            }

            archetypesApi.getAll().then(archs => setArchetypeList(archs));

            if (pendingSaveAfterImport && mainboard.length > 0) {
                save();
                setPendingSaveAfterImport(false);
                setSavedDeckToast(true);
            }
        };

        init();
    }, [deckId, user, deckName, mainboard]);


    function addToDeck(card: Card) {
        if (!card) return;
        
        if (mainboard.find(entry => entry.card.name == card.name)) {
            mainboard.find(entry => entry.qty++);
        } else {
            setMainboard([{ qty: 1, card: card }, ...mainboard])
        }
    }

    async function handleSaveTags() {
        if (!deckId) return;

        const supabase = await getSupabase();

        // Étape 1 : Supprimer les anciens liens
        const { error: deleteError } = await supabase
            .from("deck_archetype")
            .delete()
            .eq("deck_id", deckId);

        if (deleteError) {
            console.error("Erreur lors de la suppression des anciens tags :", deleteError);
            return;
        }

        // Étape 2 : Insérer les nouveaux liens s'il y en a
        if (archetypes.length > 0) {
            const inserts = archetypes.map((archetype_id) => ({
                deck_id: deckId,
                archetype_id,
            }));

            const { error: insertError } = await supabase
                .from("deck_archetype")
                .insert(inserts);

            if (insertError) {
                console.error("Erreur lors de l'insertion des nouveaux tags :", insertError);
                return;
            }
        }

        console.log("Tags mis à jour avec succès !");
    }


    return (
        <Box>
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly" }}>
            
            <Input
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                sx={{ width: "100%" }}
                placeholder={deckName ?? "New Deck"}
            />

            <BasicModal icon={<Settings/>} title="">

                <Tabs>
                    <TabList>
                        <Tab>📋Import Deck</Tab>
                        <Tab>📤Export Deck</Tab>
                        <Tab>🏷️Tags</Tab>
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

                    <TabPanel value={2}>
                        <Typography>Set Tags & Archetypes</Typography>
                        <Select
                            multiple
                            value={archetypes}
                            onChange={(_, value) => setArchetypes(value)}
                            placeholder="Choose archetypes"
                            sx={{ mt: 1, mb: 2 }}
                            renderValue={(selected) => (
                                <Box sx={{ display: "flex", gap: "0.25rem", flexWrap: "wrap" }}>
                                    {selected.map((option, index) => {
                                        const entry = archetypeList?.find((a) => a.id === option.value.toString());
                                        return entry ? (
                                            <Chip key={entry.id} variant="soft" color="primary">
                                                {entry.name}
                                            </Chip>
                                        ) : null;
                                    })}
                                </Box>
                            )}
                        >
                            {archetypeList?.map((arch, i) => (
                                <Option key={i} value={arch.id}>{arch.name}</Option>
                            ))}
                        </Select>
                        <Button onClick={handleSaveTags} startDecorator={<LocalOfferOutlined/>}>
                            Save Tags
                        </Button>
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