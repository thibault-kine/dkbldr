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
        <Box className="navbar">
            <IconButton 
                className="open-icon" 
                onClick={() => setOpen(true)}
            >
                <Menu/>
            </IconButton>

            <Drawer open={open} onClose={() => setOpen(false)} anchor="bottom">
                <Box className="menu-box">

                    <Box sx={{ width: "100%", height: "100%" }}>
                        <Button
                            onClick={() => {
                                navigate("/")
                                setOpen(false)
                            }}
                            className="nav-btn"
                        >
                            Home
                        </Button>

                        {user ? (<>
                            <Button
                                onClick={() => {
                                    navigate(`/user/${user?.username}/${user?.id}`)
                                    setOpen(false)
                                }}
                                className="nav-btn"
                            >
                                {user.username}
                            </Button>
                            <Button
                                onClick={handleLogout}
                                className="nav-btn"
                                sx={{ color: "red" }}
                            >
                                Logout
                            </Button>
                        </>) : (
                            <Button
                                onClick={() => {
                                    navigate("/login")
                                    setOpen(false)
                                }}
                                className="nav-btn"
                            >
                                Login
                            </Button>
                        )}

                    <Button
                        onClick={() => {
                            navigate("/about")
                            setOpen(false)
                        }}
                        className="nav-btn"
                        >
                        About
                    </Button>

                    </Box>

                    <IconButton onClick={() => setOpen(false)} sx={{ marginBottom: "10px", backgroundColor: "var(--purple)", borderRadius: "30px" }}>
                        <Close/>
                    </IconButton>

                </Box>
            </Drawer>
        </Box>
    )
}