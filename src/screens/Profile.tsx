import { useState, useEffect, useRef } from "react";
import { useUser } from "../context/UserContext";
import { Input, Button, Box, Typography, Skeleton } from "@mui/joy";
import { Add, Check, Edit } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import "../style/Profile.css"
import ProfileAvatar from "../components/ProfileAvatar";
import DeckPreviewCard from "../components/DeckPreviewCard";
import FollowButton from "../components/FollowButton";
import { AppUser, Deck, decksApi, storageApi, usersApi } from "../services/api";


export default function Profile() {

    const { id } = useParams();
    const { user, refreshUser } = useUser();

    const [profile, setProfile] = useState<AppUser | null>(null);
    const [decks, setDecks] = useState<Deck[]>([]);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [loadingDecks, setLoadingDecks] = useState(true);

    // Uniquement si l'utilisateur est le propriétaire du profil
    const [newUsername, setNewUsername] = useState("");
    const [editing, setEditing] = useState(false);
    const [description, setDescription] = useState("");

    const isOwner = user && profile && user.id === profile.id;

    const navigate = useNavigate();


    async function handleUsernameChange() {
        if (!user || !isOwner) return;

        try {
            await usersApi.update(user.id, { username: newUsername.trim() });
            await refreshUser();
            setEditing(false);
        } catch (error) {
            console.error("Erreur lors de la mise à jour :", error);
        }
    }


    const fileInputRef = useRef<HTMLInputElement>(null);

    function handleUploadClick() {
        fileInputRef.current?.click();
    }

    async function handleAvatarChange(event) {
        const file = event.target.files[0];
        if (!file || !user) return;

        try {
            const imageUrl = await storageApi.uploadAvatar(user.id, file);
            if (imageUrl) {
                await storageApi.updateAvatarUrl(user.id, imageUrl.url);
                await refreshUser().then(() => window.location.reload());
            }
        } catch (err) {
            console.error("Erreur lors du changement d'avatar : ", err);
        }
    }

    async function handleHeaderBgChange(event) {
        const file = event.target.files[0];
        if (!file || !user) return;

        try {
            const imageUrl = await storageApi.uploadHeader(user.id, file);
            await storageApi.updateHeaderUrl(user.id, imageUrl.url);
            await refreshUser().then(() => window.location.reload());
        } catch (err) {
            console.error("Erreur d'upload : ", err);
        }
    }


    useEffect(() => {
        if (!id) return;

        (async () => {
            try {
                const userData = await usersApi.getById(id);

                setProfile(userData);
                setNewUsername(userData?.username ?? "");
                setDescription(userData?.description ?? "");
            } catch (error) {
                console.error("Erreur lors de la récupération de l'utilisateur: ", error);
            } finally {
                setLoadingProfile(false);
            }
        })();

        (async () => {
            try {
                const userDecks = await decksApi.getAllFromUser(id);
                setDecks(userDecks);
            } catch (error) {
                console.error("Erreur lors de la récupération des decks de l'utilisateur: ", error);
            } finally {
                setLoadingDecks(false);
            }
        })();

    }, [id]);


    return (
        <Box className="profile">
            {loadingProfile ? (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Skeleton animation="wave" sx={{
                        width: "100%", height: "200px",
                    }}>
                        <img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" />
                    </Skeleton>
                    <Skeleton 
                        animation="wave" 
                        variant="circular"
                        sx={{
                            borderRadius: "50px",
                            width: "100px", height: "100px",
                            marginTop: "145px"
                        }}
                    >
                        <img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" />
                    </Skeleton>
                    <Skeleton animation="wave" sx={{
                        borderRadius: "30px",
                        width: "250px", height: "40px",
                        marginTop: "260px"
                    }}>
                        <img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" />
                    </Skeleton>

                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                        <Typography sx={{ marginTop: "70px" }}>
                            <Skeleton animation="wave">
                                X Followers
                            </Skeleton>
                        </Typography>
                        <Typography sx={{ marginTop: "70px", fontWeight: "bold", marginLeft: "3px", marginRight: "3px" }}>•</Typography>
                        <Typography sx={{ marginTop: "70px" }}>
                            <Skeleton animation="wave">
                                X Following
                            </Skeleton>
                        </Typography>
                    </Box>
                </Box>
            ) : (
                <Box
                    className="background-profile"
                    sx={{
                        backgroundImage: `url(${profile?.header_bg || ""})`,
                        backgroundSize: "cover",
                    }}
                >
                    <Box className="avatar-and-username">
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            accept="image/*"
                            onChange={handleHeaderBgChange}
                        />
                        <ProfileAvatar
                            user={profile!}
                            isOwner={profile?.id === user?.id}
                            onAvatarChange={handleAvatarChange}
                        />
                        {isOwner ? (<>
                            <Button className="edit-background-profile standard-btn" onClick={handleUploadClick}>
                                <Edit />
                            </Button>
                            <Input
                                className="username-input"
                                type="text"
                                value={editing ? "" : newUsername}
                                onChange={(e) => {
                                    setNewUsername(e.target.value);
                                    setEditing(true);
                                }}
                                endDecorator={
                                    <Button className="validate-username-btn standard-btn-sm" onClick={handleUsernameChange}>
                                        {editing ? <Check /> : <Edit />}
                                    </Button>
                                }
                            />
                        </>) : (
                            <Typography className="username-input">{profile?.username}</Typography>
                        )}

                        <Typography className="followers">
                            <Typography className="followers-count">{profile?.followers.length}</Typography> followers
                            •
                            <Typography className="followers-count"> {profile?.following.length}</Typography> following
                        </Typography>

                        {(profile && user) && (profile?.id !== user?.id) ? (
                            <FollowButton currentUserId={user.id} targetUser={profile} />
                        ) : ''}
                    </Box>

                </Box>
            )}

            {loadingDecks ? (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>

                <Box className="sep"></Box>

                <Typography>
                    <Skeleton animation="wave">
                        Username's decks
                    </Skeleton>
                </Typography>

                <Skeleton animation="wave" sx={{ width: "150px", height: "50px", marginTop: "100px" }}>
                    <img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" />
                </Skeleton>

                <Skeleton animation="wave" sx={{ width: "80%", height: "100px", marginTop: "180px", marginBottom: "10px" }}>
                    <img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" />
                </Skeleton>

                <Skeleton animation="wave" sx={{ width: "80%", height: "100px", marginTop: "290px", marginBottom: "10px" }}>
                    <img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" />
                </Skeleton>

                <Skeleton animation="wave" sx={{ width: "80%", height: "100px", marginTop: "400px", marginBottom: "10px" }}>
                    <img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" />
                </Skeleton>
            </Box>) 
            :
            (<Box className="main-content">
            
                <Box className="sep"></Box>

                <Typography className="subtitle">{profile?.username}'s decks</Typography>
                <Box sx={{ display: "flex", justifyContent: "center", width: "100%", marginBottom: "20px" }}>
                    {isOwner && <Button
                        startDecorator={<Add />}
                        // Redirects to a new URL with `uuidv4()`, which generates an UUID
                        onClick={() => navigate(`/deck/${uuidv4()}/builder`)}
                    >
                        Create a new deck
                    </Button>}
                </Box>

                <Box className="decks">
                    {decks.length > 0 ? (
                        decks.map((d, i) => (
                            <DeckPreviewCard deckId={d.id!} key={i} />
                        ))
                    ) : (
                        <Typography>No decks yet ☹️</Typography>
                    )}
                </Box>

            </Box>)}

        </Box>
    );
}
