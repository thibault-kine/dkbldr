import React, { useEffect, useState } from "react";
import { Card } from "scryfall-api";
import { Box, Typography } from "@mui/joy";
import "../style/CardHeader.css"
import { cardsApi } from "../services/api";
import { BASE_ROUTE } from "../router/AppRouter";


function manaCostParser(manaCost: string) {
    let result = manaCost.replaceAll(/[{}]/gm, '').split('');
    return result;
}

export default function CardHeader({ id }) {

    const [card, setCard] = useState<Card>();
    const [style, setStyle] = useState("card-header");
    
    useEffect(() => {
        cardsApi.getById(id).then(c => {
            setCard(c);
            console.log(c);

            let newStyle = "card-header";
            const colors = c?.color_identity ?? [];
            
            if (colors.length > 1) {
                newStyle += " gold";
            } else if (colors.length === 1) {
                newStyle += ` ${colors[0]}`;
            }
            else {
                newStyle += " C";
            }

            setStyle(newStyle);
        });
    }, [])

    return (
        <div className={style}>
            {card && (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                }}>
                    <h3>{card?.name}</h3>
                    <div>
                    {manaCostParser(card.mana_cost ?? "").map((c, i) => (
                        <img key={i} src={`${BASE_ROUTE}/icons/mana/${c}.svg`} height="16px" style={{ filter: 'drop-shadow(-1px 1px 0 #000)', marginLeft: '1px' }} />
                    ))}
                    </div>
                </Box>
            )}
        </div>
    )
}