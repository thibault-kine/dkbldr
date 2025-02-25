import React, { useState } from "react";
import { getRandomCommander } from "../../api/cards";
import Searchbar from "../components/Searchbar";
import { Card } from "scryfall-api";
import { Button, Typography } from "@mui/joy";
import CardHeader from "../components/CardHeader";
import { FaCrown, FaDice, FaDiceD20, FaDiceD6, FaShield } from "react-icons/fa6";
import { FaShieldAlt } from "react-icons/fa";

export default function DeckBuilder() {

    const [commander, setCommander] = useState<Card>();
    const [card, setCard] = useState<Card[]>([]);
    

    async function onRandomCommander() {
        console.log("getting random commander");
        
        const random = await getRandomCommander();
        console.log("New commander: ", random.name);
        
        if (random) {
            setCommander(prev => {
                console.log("Previous commander: ", prev?.name);
                return random;
            });
        }
    }


    return (
        <div>
            <Typography level="h2"></Typography>
            <Searchbar onCardFound={setCard}/>
            
            <h2>or</h2>

            <Button
                onClick={onRandomCommander}
                startDecorator={<FaDiceD20/>}
                endDecorator={<FaShieldAlt/>}
                sx={{ color: "black", backgroundColor: "goldenrod", margin: "20px 0" }}
            >Get Random Commander</Button>
            
            {commander && <CardHeader key={commander.id} id={commander.id} />}
        </div>
    )
}