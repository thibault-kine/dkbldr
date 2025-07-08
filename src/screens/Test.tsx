import React, { useState } from "react"
import { Autocomplete, Box, Button, Typography } from "@mui/joy"
import CardSearchbar from "../components/CardSearchbar"
import { Card, Cards } from "scryfall-api"
import { getRandomCommander } from "../../api/cards";
import UserList from "./UserList";
import DeckPreview from "../components/DeckPreviewCard";

export default function Test() {
    return (
        <DeckPreview deckId="0737286d-4051-4495-b511-a04b146ed0ec" />
    )
}