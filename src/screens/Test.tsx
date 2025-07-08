import React, { useState } from "react"
import { Autocomplete, Box, Button, Typography } from "@mui/joy"
import CardSearchbar from "../components/CardSearchbar"
import { Card, Cards } from "scryfall-api"
import { getRandomCommander } from "../../api/cards";
import UserList from "./UserList";

export default function Test() {
    return (
        <UserList/>
    )
}