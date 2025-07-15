import { useEffect, useState } from "react";
import { Card } from "scryfall-api";
import { User, useUser } from "../context/UserContext";
import { Deck, getDeckById } from "../../db/decks";
import { getUserById } from "../../db/users";
import { Box, Link, Typography } from "@mui/joy";
import "../style/DeckPreviewCard.css";
import { Favorite, FavoriteBorder, FavoriteOutlined } from "@mui/icons-material";
import numberShortener from "number-shortener";


export default function DeckPreviewCard({ deckId }: { deckId: string }) {

    const { user, refreshUser } = useUser();
    const [authorId, setAuthorId] = useState<string>();
 
    const [commander, setCommander] = useState<Card | null>();
    const [name, setName] = useState("");
    const [colors, setColors] = useState<string[]>([]);
    const [author, setAuthor] = useState<string>();
    const [createdAt, setCreatedAt] = useState<Date>();
    const [likes, setLikes] = useState(0);


    useEffect(() => {
        getDeckById(deckId).then(d => {
            setCommander(d!.commanders[0]);
            setColors(d!.color_identity);
            setName(d!.name);
            setCreatedAt(new Date(d!.created_at!));
            setLikes(d!.likes);
            
            if (d!.user_id) {
                setAuthorId(d?.user_id);
                getUserById(d!.user_id).then(u => setAuthor(u?.username));
            }
        });
    }, [deckId]);



    return (
        <Box 
            className="container"
            sx={{ backgroundImage: `url(${commander?.image_uris?.art_crop})`, backgroundSize: "cover", backgroundPositionY: "20%" }}
        >
        <Link href={`/deck/${deckId}/${user?.id === authorId ? "builder" : "details"}`} className="deck-link">
            <Box className="background-gradient">
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Box sx={{ display: "flex", "flexDirection": "row", alignItems: "center", justifyContent: "space-between" }}>
                        <Typography sx={{ fontWeight: "bold", fontSize: 22 }}>{name}</Typography>
                        <Box>
                        {colors ? colors.map((c, i) => (
                            <img key={i} src={`/icons/mana/${c}.svg`} width={20} height={20} style={{ filter: "drop-shadow(0 0 3px black)", marginLeft: "2px" }}/>
                        )) : (
                            <img src="/icons/mana/C.svg" width={20} height={20} style={{ filter: "drop-shadow(0 0 3px black)" }}/>
                        )}
                        </Box>
                    </Box>

                    <Typography sx={{ fontStyle: "italic", color: "grey", alignSelf: "start" }}>by {author}</Typography>
                </Box>

                <Box sx={{ display: "flex", "flexDirection": "row", alignItems: "center", justifyContent: "space-between", paddingBottom: "2px" }}>
                    <Typography sx={{ fontStyle: "italic", color: "grey" }}>created at {createdAt?.toLocaleDateString()}</Typography>
                    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <Typography sx={{ textShadow: "0 0 3px black", color: "white", fontWeight: "normal" }}>{numberShortener(likes)}</Typography>
                        <FavoriteBorder sx={{ marginLeft: "2px", filter: "drop-shadow(0 0 3px black)" }}/>
                    </Box>
                </Box>
            </Box>
        </Link>
        </Box>
    )
}