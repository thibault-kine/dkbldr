import { Avatar, Box, Button, Dropdown, IconButton, List, ListItem, ListItemDecorator, Menu, MenuButton, MenuItem, Switch, Typography } from "@mui/joy";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import "../style/Header.css"
import { Icon, Toolbar } from "@mui/material";
import { useUser } from "../context/UserContext";
import { ArrowDropDown, Home, Info, Login, Logout, Notifications, Person } from "@mui/icons-material";

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
            <img src="/icons/icon.png" className="logo" onClick={() => navigate("/")}/>

            <Typography>
                {getPageName()}
            </Typography>

            <IconButton className="logo">
                {/* <Notifications sx={{ color: "white" }}/> */}
            </IconButton>
        </Box>
    )
}