import { Avatar, Box, Button, Dropdown, IconButton, List, ListItem, ListItemDecorator, Menu, MenuButton, MenuItem, Switch, Typography } from "@mui/joy";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../db/supabase";
import "../style/Header.css"
import { Icon, Toolbar } from "@mui/material";
import { useUser } from "../context/UserContext";
import { ArrowDropDown, Home, Info, Login, Logout, Notifications, Person } from "@mui/icons-material";
import { BASE_ROUTE } from "../router/AppRouter";

export default function Header() {

    const { user, setUser, refreshUser } = useUser();
    
    const navigate = useNavigate();
    const location = useLocation();

    function getPageName() {

        const params = location.pathname.split("/");

        if (location.pathname === `${BASE_ROUTE}/`) return "Home";
        if (location.pathname === `${BASE_ROUTE}/login`) return "Login";
        if (location.pathname === `${BASE_ROUTE}/register`) return "Register";
        if (location.pathname === `${BASE_ROUTE}/about`) return "About";
        if (location.pathname === `${BASE_ROUTE}/builder`) return "Deck Builder";
        
        if (location.pathname.startsWith(`${BASE_ROUTE}/user`)) return `${params[2]}'s Profile`;
        
        return "";
    }

    return (
        <Box className="header">
            <img src="/icons/icon.png" className="logo" onClick={() => navigate(`${BASE_ROUTE}`)}/>

            <Typography>
                {getPageName()}
            </Typography>

            <IconButton className="logo">
                {/* <Notifications sx={{ color: "white" }}/> */}
            </IconButton>
        </Box>
    )
}