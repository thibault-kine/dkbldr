import { useEffect, useState } from "react";
import { Card } from "scryfall-api";
import { User, useUser } from "../context/UserContext";
import { Deck, getDeckById } from "../../db/decks";
import { getUserById } from "../../db/users";
import { Avatar, Box, Link, Typography } from "@mui/joy";
import "../style/DeckPreviewCard.css";
import { Favorite, FavoriteBorder, FavoriteOutlined } from "@mui/icons-material";
import numberShortener from "number-shortener";
import { format, formatDistanceToNow, isToday, isYesterday, differenceInDays, differenceInMonths } from 'date-fns';
import ProfileAvatar from "./ProfileAvatar";


export default function UserPreviewCard({ userId }: { userId: string }) {
    
    const [profile, setProfile] = useState<User>();

    useEffect(() => {
        getUserById(userId).then(u => setProfile(u!));
    }, [userId]);


    return (
        <Box 
            className="container"
            sx={{ backgroundImage: `url(${profile?.header_bg})`, backgroundSize: "cover", backgroundPositionY: "20%" }}
        >
        <Link href={`/user/${profile?.username}/${userId}`} className="deck-link">
            <Box className="background-gradient">
                <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <Box sx={{ display: "flex", "flexDirection": "row", alignItems: "center" }}>
                        <Avatar
                            src={profile?.pfp}
                            sx={{ width: "50px", height: "50px", marginRight: "10px" }}
                        />
                        <Typography sx={{ fontWeight: "bold", fontSize: 22 }}>{profile?.username}</Typography>
                    </Box>

                    <Typography className="followers">
                        <Typography className="followers-count">{profile?.followers.length}</Typography> followers
                        •
                        <Typography className="followers-count"> {profile?.following.length}</Typography> following
                    </Typography>
                </Box>
            </Box>
        </Link>
        </Box>
    )
}