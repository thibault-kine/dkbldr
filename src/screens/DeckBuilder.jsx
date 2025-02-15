import { useState } from "react";
import { getRandomCommander } from "../../api/cards";
import Searchbar from "../components/Searchbar";

export default function DeckBuilder() {

    const [card, setCard] = useState(null);
    

    async function onRandomCommander() {
        const random = await getRandomCommander();
        if (random) {
            setCard(random);
        }
    }


    return (
        <div>
            <Searchbar onCardFound={setCard}/>
            
            <h2>or</h2>

            <button onClick={onRandomCommander}>getRandomCommander</button>
            
            {card && (
                <div>
                    <h2>{card.name}</h2>
                    <img 
                        className='card' width={300} 
                        src={card.image_uris?.normal} 
                        alt={`${card.name} (${card.set.toUpperCase()}#${card.collector_number})`}
                    />
                </div>
            )}
        </div>
    )
}