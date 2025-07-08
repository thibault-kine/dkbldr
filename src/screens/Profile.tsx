import React, { useState, useEffect, useRef, HTMLInputTypeAttribute, use } from "react";
import { User, useUser } from "../context/UserContext";
import { Input, Button, Box, Typography, Avatar, Table, Textarea } from "@mui/joy";
import { getUserById, updateUser } from "../../db/users";
import Loading from "../components/Loading";
import { Add, Check, Edit, FavoriteBorder } from "@mui/icons-material";
import { updateProfilePicture, uploadHeaderBgImage, uploadProfilePicture } from "../../db/storage";
import { Link, useNavigate, useParams } from "react-router-dom";
import Page404 from "./404";
import { DeckList, Deck, getAllDecksFromUser } from "../../db/decks"
import { v4 as uuidv4 } from "uuid";

import "../style/Profile.css"
import ProfileAvatar from "../components/ProfileAvatar";
import { supabase } from "../../db/supabase";
import { Card, Cards, Set, Sets } from "scryfall-api";
import { Icon } from "@mui/material";
import numberShortener from "number-shortener";
import DeckPreviewCard from "../components/DeckPreviewCard";


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


    // async function getFavoriteCard() {
    //     try {
    //         if (!user?.favorite_card) return;
    //         const res = await Cards.byName(user?.favorite_card);
    //         setFavoriteCard(res!);
    //     }
    //     catch (error) {
    //         console.error(error);
    //     }
    // }


    // async function getFavoriteSet() {
    //     try {
    //         if (!user?.favorite_set) return;
    //         const res = await Sets.byCode(user.favorite_set);
    //         setFavoriteSet(res!);    
    //     }
    //     catch (error) {
    //         console.error(error);
    //     }
    // }


    useEffect(() => {
        (async () => {
            if (!id) return;
            try {
                const userData = await getUserById(id);
                
                setProfile(userData);
                setNewUsername(userData?.username ?? "");
                setDescription(userData?.description ?? "");
            } catch (error) {
                console.error("Erreur lors de la récupération de l'utilisateur: ", error);
            } finally {
                setLoading(false);
            }
        })();

        (async () => {
            if (!id) return;
            try {
                const userDecks = await getAllDecksFromUser(id);
                setDecks(userDecks);
            } catch (error) {
                console.error("Erreur lors de la récupération des decks de l'utilisateur: ", error);
            } finally {
                setLoading(false);
            }
        })();

        // getFavoriteCard();
        // getFavoriteSet();

    }, [id, decks, profile /*favoriteCard, favoriteSet*/]);


    if (loading) return <Loading/>;
    if (!profile) return <Page404/>;
    

    return (
        <Box>
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
                                    value={editing ? "" : newUsername}
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
                                <Typography className="followers-count">{profile.followers.length}</Typography> followers
                                •
                                <Typography className="followers-count"> {profile.following.length}</Typography> following
                            </Typography>
                        </Box>

                    </Box>
                    
                    <Box className="main-content">

                        <Box className="sep"></Box>

                        <Typography className="subtitle">{user?.username}'s decks</Typography>
                        <Box sx={{ display: "flex", justifyContent: "center", width: "100%", marginBottom: "20px" }}>
                        {isOwner && <Button 
                            startDecorator={<Add/>}
                            // Redirects to a new URL with `uuidv4()`, which generates an UUID
                            onClick={() => navigate(`/deck/${uuidv4()}/builder`)}
                        >
                            Create a new deck
                        </Button>}
                        </Box>

                        <Box className="decks">
                            {decks.length > 0 ? (
                                decks.map((d, i) => (
                                    <DeckPreviewCard deckId={d.id!} key={i}/>
                                ))
                            ) : (
                                <Typography>No decks yet ☹️</Typography>
                            )}
                        </Box>

                    </Box>

                </Box>
            </>) : (
                <Loading/>
            )}
        </Box>
    );
}
