import React, { useState } from "react";
import { getRandomCommander } from "../../api/cards";
import Searchbar from "../components/Searchbar";
import { Card } from "scryfall-api";

export default function DeckBuilder() {

    const [commander, setCommander] = useState<Card>();
    const [card, setCard] = useState<Card[]>([]);
    

    async function onRandomCommander() {
        const random = await getRandomCommander();
        if (random) {
            setCommander(random);
        }
    }


    return (
        <div>
            <Searchbar onCardFound={setCard}/>
            
            <h2>or</h2>

            <button onClick={onRandomCommander}>getRandomCommander</button>
            
            {commander && (
                <div>
                    <h2>{commander.name}</h2>
                    <img 
                        className='card' width={300} 
                        src={commander.image_uris?.normal} 
                        alt={`${commander.name} (${commander.set.toUpperCase()}#${commander.collector_number})`}
                    />
                </div>
            )}
        </div>
    )
}