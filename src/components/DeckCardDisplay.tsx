import { Badge, Box } from "@mui/joy";
import React from "react";
import { Card } from "scryfall-api";


export default function DeckCardDisplay({ card, quantity }: { card: Card; quantity: number }) {

    return (
        <>
            <Box className="card-display">
                <Badge badgeContent={quantity}>
                    <img
                        src={card.image_uris?.png || card.card_faces?.[0].image_uris?.png}
                        alt={`${card.name} (${card.set})`}
                        width={250}
                    />
                </Badge>
            </Box>
        </>
    )
}