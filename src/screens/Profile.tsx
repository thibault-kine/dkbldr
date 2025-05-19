import React, { useState, useEffect, useRef, HTMLInputTypeAttribute } from "react";
import { User, useUser } from "../context/UserContext";
import { Input, Button, Box, Typography, Avatar, Table } from "@mui/joy";
import { getUserById, updateUser } from "../../db/users";
import Loading from "../components/Loading";
import { Add, Check, Edit } from "@mui/icons-material";
import { updateProfilePicture, uploadHeaderBgImage, uploadProfilePicture } from "../../db/storage";
import { useNavigate, useParams } from "react-router-dom";
import Page404 from "./404";
import { DeckList, Deck, getAllDecksFromUser } from "../../db/decks"
import { v4 as uuidv4 } from "uuid";

import "../style/Profile.css"
import ProfileAvatar from "../components/ProfileAvatar";


export default function Profile() {
    
    const { id } = useParams();
    const { user, refreshUser } = useUser();

    const [profile, setProfile] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [decks, setDecks] = useState<Deck[]>([]);

    // Uniquement si l'utilisateur est le propriétaire du profil
    const [newUsername, setNewUsername] = useState("");
    const [editing, setEditing] = useState(false);

    const isOwner = user && profile && user.id === profile.id;

    const navigate = useNavigate();


    useEffect(() => {
        async function fetchProfile() {
            if (!id) return;
            try {
                const userData = await getUserById(id);
                
                setProfile({
                    id: userData.id,
                    username: userData.username,
                    email: userData.email,
                    pfp: userData.pfp,
                    headerBg: userData.header_bg
                });

                setNewUsername(userData.username);
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
    }, [id, decks]);

    
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


    if (loading) return <Loading/>;
    if (!profile) return <Page404/>;
    

    return (
        <Box sx={{ display: "flex" }}>
            {profile ? (<>
                <Box className="profile">
                    <Box 
                        className="background-profile"
                        sx={{ 
                            backgroundImage: `url(${profile.headerBg || ""})`,
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
                        </Box>

                    </Box>
                    
                    <Box className="main-content">

                        <Box className="sep"></Box>

                        <Typography level="h4">Your decks</Typography>
                        <Button 
                            startDecorator={<Add sx={{ paddingRight: "10px" }}/>}
                            onClick={() => navigate(`/deck/${uuidv4()}/builder`)}
                        >
                            Create new deck
                        </Button>

                        {decks.length > 0 ? (
                            <Table className="profile-decks">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Commander</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {decks.map((d, i) => (
                                    <tr key={i} onClick={() => navigate(`/deck/${d.id}/details`)}>
                                        <td>{d.name}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
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
