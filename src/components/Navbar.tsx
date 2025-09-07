import React, { useState } from "react";
import "../style/Navbar.css"
import { useUser } from "../context/UserContext";
import { useLocation, useNavigate } from "react-router-dom";
import { Avatar, Box, Button, Drawer, Dropdown, IconButton, Link, ListItemDecorator, MenuButton, MenuItem, Typography } from "@mui/joy";
import { ArrowDropDown, Close, Login, Logout, Menu, Person } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import LogoutButton from "./LogoutButton";


export default function Navbar() {

    const { user: profile, setUser, refreshUser } = useUser();
    const { user, loading } = useAuth();

    const [open, setOpen] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();
    

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

                    <Button
                        onClick={() => {
                            navigate("/explore")
                            setOpen(false)
                        }}
                        className="nav-btn"
                        >
                        Explore
                    </Button>

                    <Button
                        onClick={() => {
                            navigate("/about")
                            setOpen(false)
                        }}
                        className="nav-btn"
                        >
                        About
                    </Button>
                        
                    {user ? (<>
                        <Button
                            onClick={() => {
                                navigate(`/user/${profile?.username}/${user?.id}`)
                                setOpen(false)
                            }}
                            className="nav-btn"
                        >
                            {profile?.username}
                        </Button>
                        <LogoutButton/>
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

                    </Box>

                    <IconButton onClick={() => setOpen(false)} sx={{ marginBottom: "10px", backgroundColor: "var(--purple)", borderRadius: "30px" }}>
                        <Close/>
                    </IconButton>

                </Box>
            </Drawer>
        </Box>
    )
}