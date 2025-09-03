import { useEffect, useState } from "react";
import { Box, Tab, TabList, TabPanel, Tabs, Typography } from "@mui/joy";
import { useParams } from "react-router-dom";
import "../style/DeckBuilder.css"
import DeckCardDisplay from "../components/DeckCardDisplay";
import { groupCardsByType } from "../../utils/deck";
import { Deck, decksApi } from "../services/api";
import { BASE_ROUTE } from "../router/AppRouter";


export default function DeckDetails() {

    const { id: deckId } = useParams(); 

    const [deck, setDeck] = useState<Deck | null>(null);

    useEffect(() => {
        async function fetchDeck() {
            if (!deckId) return;
            try {
                const deckData = await decksApi.getById(deckId);
                
                setDeck({ ...deckData });
            } catch (error) {
                console.error("Erreur lors de la récupération du deck: ", error);
            }
        }
        fetchDeck();
    }, [deck])

    return (
        <Box>
            <Typography sx={{ textAlign: "center", fontSize: "26px", fontWeight: "bold" }}>{deck?.name}</Typography>

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
                        {(deck && deck?.mainboard.length > 0) && (() => {
                            const grouped = groupCardsByType(deck?.mainboard);
                            const types = Object.keys(grouped).filter(type => grouped[type].length > 0);

                            return (
                                <Tabs defaultValue={0} className="main-editor">
                                    <TabList className="deckbuilder">
                                        {types.map((type, index) => {
                                        
                                        let sum = 0;
                                        grouped[type].forEach(c => sum += c.qty);

                                        return sum > 0 && (
                                            <Tab key={index} className="deckbuilder-tab">
                                                <img src={`${BASE_ROUTE}/icons/other/${type}_symbol.svg`} height={15} style={{ filter: "invert(100%)" }}/> 
                                                <Typography>{sum}</Typography>
                                            </Tab>
                                        )})}
                                    </TabList>

                                    {types.map((type, index) => (
                                        <TabPanel key={index} value={index}>
                                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                {grouped[type].map((entry, i) => (
                                                    <DeckCardDisplay
                                                        isAuthor={false}
                                                        key={i}
                                                        card={entry.card}
                                                        inSideboard={false}
                                                        quantity={entry.qty}
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
                    {(deck && deck?.sideboard.length > 0) && (() => {
                            const grouped = groupCardsByType(deck?.sideboard);
                            const types = Object.keys(grouped).filter(type => grouped[type].length > 0);

                            return (
                                <Tabs defaultValue={0} className="main-editor">
                                    <TabList className="deckbuilder">
                                        {types.map((type, index) => {
                                        
                                        let sum = 0;
                                        grouped[type].forEach(c => sum += c.qty);

                                        return sum > 0 && (
                                            <Tab key={index} className="deckbuilder-tab">
                                                <img src={`${BASE_ROUTE}/icons/other/${type}_symbol.svg`} height={15} style={{ filter: "invert(100%)" }}/> 
                                                <Typography>{sum}</Typography>
                                            </Tab>
                                        )})}
                                    </TabList>

                                    {types.map((type, index) => (
                                        <TabPanel key={index} value={index}>
                                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                {grouped[type].map((entry, i) => (
                                                    <DeckCardDisplay
                                                        isAuthor={false}
                                                        key={i}
                                                        card={entry.card}
                                                        inSideboard={true}
                                                        quantity={entry.qty}
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
        </Box>
    )
}