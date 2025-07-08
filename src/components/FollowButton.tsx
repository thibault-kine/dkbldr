import { useEffect, useState } from "react";
import { User } from "../context/UserContext";
import { followUser, getUserById, unfollowUser } from "../../db/users";
import { Button } from "@mui/joy";
import { Add, Remove } from "@mui/icons-material";

export default function FollowButton({ currentUserId, targetUser }: { currentUserId: string, targetUser: User }) {
    
    const [loading, setLoading] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);

    async function handleClick() {
        setLoading(true);
        if (isFollowing) {
            await unfollowUser(targetUser.id);
            window.location.reload();
        } else {
            await followUser(currentUserId, targetUser.id);
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