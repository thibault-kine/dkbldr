import React, { useState } from "react";
import "../style/Navbar.css"
import { useUser } from "../context/UserContext";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Drawer, IconButton } from "@mui/joy";
import { Close, Menu } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import LogoutButton from "./LogoutButton";
import { BASE_ROUTE } from "../router/AppRouter";


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
                                navigate(`${BASE_ROUTE}`)
                                setOpen(false)
                            }}
                            className="nav-btn"
                        >
                            Home
                        </Button>

                    <Button
                        onClick={() => {
                            navigate(`${BASE_ROUTE}/explore`)
                            setOpen(false)
                        }}
                        className="nav-btn"
                        >
                        Explore
                    </Button>

                    <Button
                        onClick={() => {
                            navigate(`${BASE_ROUTE}/about`)
                            setOpen(false)
                        }}
                        className="nav-btn"
                        >
                        About
                    </Button>
                        
                    {user ? (<>
                        <Button
                            onClick={() => {
                                navigate(`${BASE_ROUTE}/user/${profile?.username}/${user?.id}`)
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
                                navigate(`${BASE_ROUTE}/login`)
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