import { useEffect, useState } from "react";
import { AppUser } from "../context/UserContext";
import { Button } from "@mui/joy";
import { Add, Remove } from "@mui/icons-material";
import { usersApi } from "../services/api";

export default function FollowButton({ currentUserId, targetUser }: { currentUserId: string, targetUser: AppUser }) {
    
    const [loading, setLoading] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);

    async function handleClick() {
        setLoading(true);
        if (isFollowing) {
            await usersApi.unfollow(targetUser.id);
            window.location.reload();
        } else {
            await usersApi.follow(currentUserId, targetUser.id);
            window.location.reload();
        }
        setLoading(false);
    }

    useEffect(() => {
        const follow = targetUser.followers.includes(currentUserId);
        setIsFollowing(follow);
    }, [isFollowing]);

    return (
        <Button 
            onClick={handleClick}
            disabled={loading}
            startDecorator={
                isFollowing ?
                    <Remove/> :
                    <Add/>
            }
            color={
                isFollowing ?
                    "danger" :
                    "primary"
            }
        >
            {isFollowing ? "Unfollow" : "Follow"}
        </Button> 
    )
}