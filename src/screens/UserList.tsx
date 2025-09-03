import { useEffect, useState } from "react";
import { AppUser, useUser } from "../context/UserContext";
import { Box, Button, Table } from "@mui/joy";
import FollowButton from "../components/FollowButton";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";
import { usersApi } from "../services/api";

export default function UserList() {

    const { user } = useUser();
    const [users, setUsers] = useState<AppUser[] | null>();

    useEffect(() => {
        usersApi.getAll().then(data => setUsers(data));
    }, [users]);

    return (
        <Box>
            {users ?
                <Table>
                    <thead>
                        <tr>
                            <th>UUID</th>
                            <th>Username</th>
                            <th>Profile Picture</th>
                            <th>Subscribe Button</th>
                        </tr>
                    </thead>
                    <tbody style={{ backgroundColor: "white", color: "black" }}>
                        {users?.map((_user, index) => (
                            <tr key={index} style={{ backgroundColor: _user.id === user?.id ? "lime" : "" }}>
                                <td>{_user.id}</td>
                                <td><Link to={`/user/${_user.username}/${_user.id}`}>{_user.username}</Link></td>
                                <td><img src={_user.pfp ?? "/placeholders/default_pfp.jpg"} style={{ width: "50px", height: "50px", borderRadius: "30px", border: "2px solid black" }}/></td>
                                <td>{_user.id !== user?.id ? (<FollowButton currentUserId={user!.id} targetUser={_user} />) : ''}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table> :
                <Loading/>
            }
        </Box>
    )
}