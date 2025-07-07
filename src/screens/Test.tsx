import React, { useState } from "react"
import { Autocomplete, Box, Button, Typography } from "@mui/joy"
import CardSearchbar from "../components/CardSearchbar"
import { Card, Cards } from "scryfall-api"
import { getRandomCommander } from "../../api/cards";

export default function Test() {

    const [randCmd, setRandCmd] = useState<Card | null>(null);

    return (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Button
                onClick={async () => {
                    const c = await getRandomCommander();
                    setRandCmd(c);
                    console.log(c.image_uris?.png)
                }}
            >GetRandomCmd</Button>
            <Typography>{randCmd?.name}</Typography>
            <img src={randCmd ? randCmd.image_uris?.png : "/placeholders/card_back.png"} width={300} />
        </Box>
    )
}