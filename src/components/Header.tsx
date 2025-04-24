import { Avatar, Box, Button, Dropdown, IconButton, List, ListItem, ListItemDecorator, Menu, MenuButton, MenuItem, Switch, Typography } from "@mui/joy";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../db/supabase";
import "../style/Header.css"
import { Icon, Toolbar } from "@mui/material";
import { useUser } from "../context/UserContext";
import { ArrowDropDown, Home, Info, Login, Logout, Notifications, Person } from "@mui/icons-material";

/*
export default function Header() {

    const { user, setUser, refreshUser } = useUser();
    
    const navigate = useNavigate();
    const location = useLocation();

    async function handleLogout() {
        await supabase.auth.signOut();
        setUser(null);
        navigate("/"); // Redirige vers la home après logout
    };


    function getPageName() {

        const params = location.pathname.split("/");

        if (location.pathname === "/") return "Home";
        if (location.pathname === "/login") return "Login";
        if (location.pathname === "/register") return "Register";
        if (location.pathname === "/about") return "About";
        if (location.pathname === "/builder") return "Deck Builder";
        
        if (location.pathname.startsWith("/user")) return `${params[2]}'s Profile`;
        
        return "";
    }


    return (
        <Box className="header">
            <Toolbar className="header-links">
                <Button 
                    className="header-btn" 
                    onClick={() => navigate("/")}
                    startDecorator={<Home/>}
                >Home</Button>
                <Button 
                    className="header-btn" 
                    onClick={() => navigate("/about")}
                    startDecorator={<Info/>}
                >About</Button>
            </Toolbar>

            <Typography>{getPageName()}</Typography>
            
            <Dropdown>
                <MenuButton className="header-profile-btn" startDecorator={<ArrowDropDown/>}>
                    {user ? 
                        user?.pfp ? ( <> 
                            <Typography sx={{ marginRight: "15px" }}>{user.username}</Typography>
                            <Avatar src={user.pfp}/>
                        </> ) : ( <>
                            <Typography sx={{ marginRight: "15px" }}>{user.username}</Typography>
                            <Avatar>{user?.username[0].toUpperCase()}</Avatar>
                        </> )
                        :
                        <Avatar />
                    }
                </MenuButton>
                <Menu>
                    {user ? (<>
                        <MenuItem onClick={() => navigate(`/user/${user?.username}/${user?.id}`)}>
                            <ListItemDecorator><Person/></ListItemDecorator>
                            Profile
                        </MenuItem>
                        <MenuItem onClick={() => navigate(`/user/${user?.username}/${user?.id}/decks`)}>
                            <ListItemDecorator><img src="/icons/other/card.png" width="15px" style={{borderRadius: "2px"}}/></ListItemDecorator>
                            My decks
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                            <ListItemDecorator><Logout/></ListItemDecorator>
                            Logout
                        </MenuItem>
                    </>) : (
                        <MenuItem onClick={() => navigate('/login')}>
                            <ListItemDecorator><Login/></ListItemDecorator>
                            Login
                        </MenuItem>
                    )}
                    </Menu>
            </Dropdown>

        </Box>
    );
}
*/

export default function Header() {

    const { user, setUser, refreshUser } = useUser();
    
    const navigate = useNavigate();
    const location = useLocation();

    function getPageName() {

        const params = location.pathname.split("/");

        if (location.pathname === "/") return "Home";
        if (location.pathname === "/login") return "Login";
        if (location.pathname === "/register") return "Register";
        if (location.pathname === "/about") return "About";
        if (location.pathname === "/builder") return "Deck Builder";
        
        if (location.pathname.startsWith("/user")) return `${params[2]}'s Profile`;
        
        return "";
    }

    return (
        <Box className="header">
            <img src="/icons/icon-512x512.png" className="logo" onClick={() => navigate("/")}/>

            <Typography>
                {getPageName()}
            </Typography>

            <IconButton className="logo">
                <Notifications sx={{ color: "white" }}/>
            </IconButton>
        </Box>
    )
}