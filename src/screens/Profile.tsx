import { useUser } from "../context/UserContext";
import React, { useState, useEffect } from "react";
import { Input, Button, Box, Typography, Avatar } from "@mui/joy";
import { updateUser } from "../../db/users";
import Loading from "../components/Loading";
import "../style/Profile.css"
import { Edit } from "@mui/icons-material";


export default function Profile() {
    const { user, setUser, refreshUser } = useUser();
    
    const [newUsername, setNewUsername] = useState(user?.username || "");
    const [isUsernameOk, setIsUsernameOk] = useState(false);

    
    useEffect(() => {
        if (user) {
            setNewUsername(user.username);
        }
    }, [user]);

    
    async function handleUsernameChange() {
        if (!user || !newUsername.trim()) return;

        try {
            await updateUser(user.id, newUsername.trim());
            await refreshUser();
            setIsUsernameOk(true);

            setTimeout(() => setIsUsernameOk(false), 2000);
        } catch (error) {
            console.error("Erreur lors de la mise à jour :", error);
            setIsUsernameOk(false);
        }
    }


    return (
        <Box sx={{ display: "flex" }}>
            {user ? (
                <Box className="profile">
                    <Box className="background-profile">
                        <Button className="edit-background-profile standard-btn">
                            <Edit/>
                        </Button>
                        {isUsernameOk && <Typography className="msg-ok">Username successfully changed!</Typography>}
                        <Input
                            className="username-input"
                            type="text"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            endDecorator={
                                <Button className="validate-username-btn standard-btn" onClick={handleUsernameChange}>
                                    <Edit/>
                                </Button>
                            }
                        />
                        <Avatar src={user.pfp || ""} className="profile-avatar" />
                    </Box>
                </Box>
            ) : (
                <Loading/>
            )}
        </Box>
    );
}
