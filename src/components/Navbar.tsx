import React, { useState } from "react";
import "../style/Navbar.css"
import { useUser } from "../context/UserContext";
import { useLocation, useNavigate } from "react-router-dom";
import { Avatar, Box, Button, Drawer, Dropdown, IconButton, Link, ListItemDecorator, MenuButton, MenuItem, Typography } from "@mui/joy";
import { ArrowDropDown, Close, Login, Logout, Menu, Person } from "@mui/icons-material";
import { supabase } from "../../db/supabase";


export default function Navbar() {

    const { user, setUser, refreshUser } = useUser();

    const [open, setOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    async function handleLogout() {
        await supabase.auth.signOut();
        setUser(null);
        navigate("/");
    };


    return (
        <div className="navbar">
            <IconButton 
                className="open-icon" 
                onClick={() => setOpen(true)}
            >
                <Menu/>
            </IconButton>

            <Drawer open={open} onClose={() => setOpen(false)} anchor="bottom">
                <Box className="menu-box">

                    <Button
                        onClick={() => navigate("/")}
                        className="nav-btn"
                    >
                        Home
                    </Button>
                    <Button
                        onClick={() => navigate("/about")}
                        className="nav-btn"
                    >
                        About
                    </Button>


                    {user ?
                        (<Button
                            onClick={() => navigate(`/user/${user?.username}/${user?.id}`)}
                            className="nav-btn"
                        >
                            {user.username}
                        </Button>)
                        :
                        (<Button
                            onClick={() => navigate("/login")}
                            className="nav-btn"
                        >
                            Login
                        </Button>)
                    }


                    <IconButton onClick={() => setOpen(false)}>
                        <Close sx={{ color: "white"}}/>
                    </IconButton>

                </Box>
            </Drawer>
        </div>
    )
}