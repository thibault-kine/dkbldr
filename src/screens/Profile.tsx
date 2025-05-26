import React, { useState, useEffect, useRef, HTMLInputTypeAttribute, use } from "react";
import { User, useUser } from "../context/UserContext";
import { Input, Button, Box, Typography, Avatar, Table, Textarea } from "@mui/joy";
import { getUserById, updateUser } from "../../db/users";
import Loading from "../components/Loading";
import { Add, Check, Edit } from "@mui/icons-material";
import { updateProfilePicture, uploadHeaderBgImage, uploadProfilePicture } from "../../db/storage";
import { Link, useNavigate, useParams } from "react-router-dom";
import Page404 from "./404";
import { DeckList, Deck, getAllDecksFromUser } from "../../db/decks"
import { v4 as uuidv4 } from "uuid";

import "../style/Profile.css"
import ProfileAvatar from "../components/ProfileAvatar";
import { supabase } from "../../db/supabase";
import { Card, Cards, Set, Sets } from "scryfall-api";


export default function Profile() {
    
    const { id } = useParams();
    const { user, refreshUser } = useUser();

    const [profile, setProfile] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [decks, setDecks] = useState<Deck[]>([]);

    // Uniquement si l'utilisateur est le propriétaire du profil
    const [newUsername, setNewUsername] = useState("");
    const [editing, setEditing] = useState(false);
    const [description, setDescription] = useState("");
    const [favoriteCard, setFavoriteCard] = useState<Card | null>(null);
    const [favoriteSet, setFavoriteSet] = useState<Set | null>(null);

    const isOwner = user && profile && user.id === profile.id;

    const navigate = useNavigate();


    useEffect(() => {
        async function fetchProfile() {
            if (!id) return;
            try {
                const userData = await getUserById(id);
                
                setProfile(userData);

                setNewUsername(userData?.username ?? "");
            } catch (error) {
                console.error("Erreur lors de la récupération de l'utilisateur: ", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();

        async function fetchDecks() {
            if (!id) return;
            try {
                const userDecks = await getAllDecksFromUser(id);
                setDecks(userDecks);
            } catch (error) {
                console.error("Erreur lors de la récupération des decks de l'utilisateur: ", error);
            } finally {
                setLoading(false);
            }
        }
        fetchDecks();

        getFavoriteCard();
        getFavoriteSet();

    }, [id, decks, favoriteCard, favoriteSet]);

    
    async function handleUsernameChange() {
        if (!user || !isOwner) return;

        try {
            await updateUser(user.id, { username: newUsername.trim() });
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
            const imageUrl = await uploadProfilePicture(file, user.id);
            if (imageUrl) {
                await updateProfilePicture(user.id, imageUrl);
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
            const imageUrl = await uploadHeaderBgImage(user.id, file);
            await updateUser(user.id, { header_bg: imageUrl })
            await refreshUser().then(() => window.location.reload());
        } catch (err) {
            console.error("Erreur d'upload : ", err);
        }
    }

    async function handleDescriptionChange() {
        if (!user || !isOwner) return;
        
        try {
            await updateUser(user.id, { description: description });
            await refreshUser();
            setEditing(false);
        } catch (error) {
            console.error("Erreur lors de la mise à jour :", error);
        }
    }


    async function getFavoriteCard() {
        try {
            if (!user?.favorite_card) return;
            const res = await Cards.byName(user?.favorite_card);
            setFavoriteCard(res!);
        }
        catch (error) {
            console.error(error);
        }
    }


    async function getFavoriteSet() {
        try {
            if (!user?.favorite_set) return;
            const res = await Sets.byCode(user.favorite_set);
            setFavoriteSet(res!);    
        }
        catch (error) {
            console.error(error);
        }
    }


    if (loading) return <Loading/>;
    if (!profile) return <Page404/>;
    

    return (
        <Box sx={{ display: "flex" }}>
            {profile ? (<>
                <Box className="profile">
                    <Box 
                        className="background-profile"
                        sx={{ 
                            backgroundImage: `url(${profile.header_bg || ""})`,
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
                                user={profile}
                                isOwner={profile.id === user?.id}
                                onAvatarChange={handleAvatarChange}
                            /> 
                            {isOwner ? (<>
                                <Button className="edit-background-profile standard-btn" onClick={handleUploadClick}>
                                    <Edit/>
                                </Button>
                                <Input
                                    className="username-input"
                                    type="text"
                                    value={newUsername}
                                    onChange={(e) => {
                                        setNewUsername(e.target.value);
                                        setEditing(true);
                                    }}
                                    endDecorator={
                                        <Button className="validate-username-btn standard-btn-sm" onClick={handleUsernameChange}>
                                            {editing ? <Check/> : <Edit/>}
                                        </Button>
                                    }
                                />
                            </>) : (
                                <Typography className="username-input">{profile.username}</Typography>
                            )}

                            <Typography className="followers">
                                <Typography className="followers-count">{profile.followers && "0"}</Typography> followers
                                •
                                <Typography className="followers-count"> {profile.following && "0"}</Typography> following
                            </Typography>
                        </Box>

                    </Box>
                    
                    <Box className="main-content">

                        <Box className="sep"></Box>
                        <Typography className="subtitle">About {user?.username}</Typography>
                        
                        {isOwner ? (
                            <Textarea
                                placeholder="Write something interesting about you..."
                                minRows={0}
                                maxRows={5}
                                value={user.description}
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                    setEditing(true);
                                }}
                                endDecorator={
                                    <Box>
                                        <Button className="validate-desc-btn standard-btn-sm" onClick={handleDescriptionChange}>
                                            {editing ? <Check/> : <Edit/>}
                                        </Button> 
                                    </Box>
                                }
                            />
                        ) : (
                            <Box>
                                <Typography>
                                    {user?.description ?? "No description..."}
                                </Typography>
                            </Box>
                        )}

                        <Box>
                            <Box>
                                <Typography>Favorite Colors:</Typography>
                                <Box>
                                    {user?.favorite_colors?.map((color, i) => (
                                        <img key={i} src={`/icons/mana/${color}.svg`} width={20} height={20}/>
                                    ))}
                                </Box>
                            </Box>

                            <Box>
                                <Typography>Favorite Card:</Typography>
                                <Link style={{ color: "var(--purple)" }} to={{ pathname: user?.favorite_card }}>{favoriteCard?.name}</Link>
                            </Box>

                            <Box>
                                <Typography>Favorite Set:</Typography>
                                <Link style={{ color: "var(--purple)" }} to={{ pathname: user?.favorite_set }}>
                                    <img src={favoriteSet?.icon_svg_uri} color="var(--purple)" height={20}/>
                                    <Typography sx={{ color: "var(--purple)" }}>{favoriteSet?.code.toUpperCase()}</Typography>
                                </Link>
                            </Box>
                        </Box>

                        <Box className="sep"></Box>

                        <Typography className="subtitle">{user?.username}'s decks</Typography>
                        <Button 
                            startDecorator={<Add sx={{ paddingRight: "10px" }}/>}
                            onClick={() => navigate(`/deck/${uuidv4()}/builder`)}
                        >
                            Create new deck
                        </Button>

                        {decks.length > 0 ? (
                            <Box sx={{ width: "100%", display: "flex", flexDirection: "column", paddingTop: "30px" }}>
                                {decks.map((deck, i) => (
                                    <Link key={i} to={`/deck/${deck.id}/${isOwner ? 'builder' : 'details'}`} style={{ color: "var(--purple)" }}>
                                        {deck.name}
                                    </Link>
                                ))}
                            </Box>
                        ) : (
                            <Typography>No decks yet :/</Typography>
                        )}

                    </Box>

                </Box>
            </>) : (
                <Loading/>
            )}
        </Box>
    );
}
