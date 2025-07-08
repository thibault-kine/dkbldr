import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Link, Typography } from "@mui/joy"
import { useUser } from "../context/UserContext";
import { Card, Cards } from "scryfall-api";
import { getRandomCommander } from "../../api/cards";
import { getSeedFromDate, seededRandom } from "../../utils/utils";
import DeckCardDisplay from "../components/DeckCardDisplay";
import Loading from "../components/Loading";
import "../style/Home.css"
import DeckPreview from "../components/DeckPreviewCard";

export default function Home() {

    const navigate = useNavigate();
    const { user, refreshUser } = useUser();

    const [cotd, setCotd] = useState<Card | null>();

    async function getDailyCommander(): Promise<Card | null> {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 60); // UTC+1

        const dateKey = now.toISOString().split("T")[0];
        const storageKey = `commander-${dateKey}`;

        const cached = localStorage.getItem(storageKey);
        if (cached) {
            return JSON.parse(cached) as Card;
        }

        const card = await getRandomCommander();
        if (card) {
            localStorage.setItem(storageKey, JSON.stringify(card));
        }
        return card;
    }

    const [currentCol, setCurrentCol] = useState("W");


    useEffect(() => {
        getDailyCommander().then(c => setCotd(c));

        const colors = ["W", "U", "B", "R", "G", "C"];
        let index = 0;

        const interval = setInterval(() => {
            setCurrentCol(colors[index]);
            index = (index + 1) % colors.length;
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    return (
        <Box>
            <section>
                <Typography className="headline">Welcome home, {user?.username}!</Typography>
            </section>

            <section>
                <Typography sx={{ fontSize: 36, fontWeight: "bold", textAlign: "center" }}>
                    <Link>START EXPL<img src={`/icons/mana/${currentCol}.svg`} width={26}/>RING!</Link>
                </Typography>
            </section>

            <section style={{
                display: "flex",
                flexDirection: "column"
            }}>
                <Typography className="headline">Commander of the day</Typography>
                {cotd ? (
                    <Link className="daily-commander" href={cotd.scryfall_uri} target="_blank">
                        <img src={cotd.image_uris?.png} style={{ margin: "auto", width: "100%" }}/>
                    </Link>
                ) : (
                    <Loading/>
                )}
            </section>

            <section>
                <Typography className="headline">Latest decks from people you follow</Typography>
            </section>

            <section>
                <Typography className="headline">These decks look interesting</Typography>
            </section>
        </Box>
    )

}