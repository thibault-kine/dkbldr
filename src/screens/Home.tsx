import { useEffect, useState, lazy, Suspense } from "react";
import { Box, Link, Skeleton, Typography } from "@mui/joy"
import { useUser } from "../context/UserContext";
import { Card } from "scryfall-api";
import Loading from "../components/Loading";
import "../style/Home.css"
import { supabase } from "../../db/supabase";
import { cardsApi, Deck } from "../services/api";

export default function Home() {

    const { user, setUser } = useUser();

    const [loading, setLoading] = useState(false);

    
    const [cotd, setCotd] = useState<Card | null>();
    async function getDailyCommander(): Promise<Card | null> {
        setLoading(true);
        const now = new Date();
        now.setMinutes(now.getMinutes() + 60); // UTC+1

        const dateKey = now.toISOString().split("T")[0];
        const storageKey = `commander-${dateKey}`;

        const cached = localStorage.getItem(storageKey);
        if (cached) {
            setLoading(false);
            return JSON.parse(cached) as Card;
        }

        const card = await cardsApi.getRandomCommander();
        if (card) {
            localStorage.setItem(storageKey, JSON.stringify(card));
        }
        
        setLoading(false);
        return card;
    }

    
    const [followDecks, setFollowDecks] = useState<Deck[] | []>();
    async function getFollowDecks() {
        setLoading(true);
        if (user?.following.length === 0) {
            setFollowDecks([]);
            setLoading(false);
            return;
        }

        const { data, error } = await supabase
            .from("decks")
            .select("*")
            .in("user_id", user?.following!)
            .order("created_at", { ascending: false })
            .limit(3);

        if (error) {
            setFollowDecks([]);
            throw new Error("Erreur lors de la récupération des decks suivis :", error);
        } else {
            setFollowDecks(data)
        }

        setLoading(false);
    }


    const [recommendedDecks, setRecommendedDecks] = useState<Deck[] | []>();
    async function getRecommendedDecks() {
        const { data, error } = await supabase
            .rpc("get_recommended_decks", { user_uuid: user?.id });

        if (error) console.error(error);
        else setRecommendedDecks(data);
    }

    
    const [currentCol, setCurrentCol] = useState("W");
    useEffect(() => {
        setLoading(true);

        getDailyCommander().then(c => setCotd(c));

        const colors = ["W", "U", "B", "R", "G", "C"];
        let index = 0;

        const interval = setInterval(() => {
            setCurrentCol(colors[index]);
            index = (index + 1) % colors.length;
        }, 1500);

        if (user) {
            getFollowDecks();
            getRecommendedDecks();
        }
        
        setLoading(false);

        return () => clearInterval(interval);
    }, [user]);
    

    const DeckPreview = lazy(() => import("../components/DeckPreviewCard"));
    
    return (
        <Box>
            <section style={{ padding: "40px 0" }}>
                <Typography className="headline">Welcome home, {user ? user.username : "player"}!</Typography>
                
                <Typography sx={{ fontSize: 28, fontWeight: "bold", textAlign: "center" }}>
                    <Link href="/explore">START EXPL<img src={`/icons/mana/${currentCol}.svg`} width={26}/>RING!</Link>
                </Typography>
            </section>

            <section style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "var(--bg-color-lighter)",
                padding: "40px 0"
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
            
            {user && (<>
                <section style={{ padding: "40px 0" }}>
                    <Typography className="headline">Latest decks from people you follow</Typography>
                    {followDecks?.length! > 0 ? followDecks?.map((deck, index) => (
                        <DeckPreview key={index} deckId={deck.id} />
                    )) : (
                        <Typography sx={{ textAlign: "center" }}>{"Seems like your friends haven't made anything in a while."}</Typography>
                    )}
                </section>

                <section 
                    style={{
                        backgroundColor: "var(--bg-color-lighter)",
                        padding: "40px 0"
                    }}
                >
                    <Typography className="headline">These decks look interesting</Typography>
                    {recommendedDecks?.length! > 0 ? recommendedDecks?.map((deck, index) => (
                        <DeckPreview key={index} deckId={deck.id} />
                    )) : (
                        <Typography sx={{ textAlign: "center" }}>No recommended decks. Try building a few with 🏷️Tags!</Typography>
                    )}
                </section>
            </>)}
        </Box>
    )

}