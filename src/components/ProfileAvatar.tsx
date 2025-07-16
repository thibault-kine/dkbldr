import { Edit } from "@mui/icons-material";
import { Avatar, Box, Button, IconButton } from "@mui/joy";
import React, { useRef, useState } from "react";
import { User } from "../context/UserContext";
import { SxProps } from "@mui/joy/styles/types";

export default function ProfileAvatar({ 
    user, isOwner, onAvatarChange, sx
}: { 
    user: User; isOwner: boolean; onAvatarChange?: (event) => any ; sx?: SxProps
}) {

    const [hover, setHover] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    function handleAvatarClick() {
        fileInputRef.current?.click();
    }


    return (
        <div 
            className="avatar-profile"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <Avatar
                className="profile-avatar"
                src={user?.pfp || ""}
                sx={{ width: "100%", height: "100%" }}
            />

            {isOwner && (
                <>
                    <Button
                        className="edit-icon standard-btn"
                        sx={{ opacity: hover ? 1 : 0 }}
                        onClick={handleAvatarClick}
                    >
                        <Edit/>
                    </Button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={onAvatarChange}
                    />
                </>
            )}
        </div>
    )
}