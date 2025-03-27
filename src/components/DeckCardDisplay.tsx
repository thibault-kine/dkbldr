import { AutoAwesome, SwapHoriz } from "@mui/icons-material";
import { Badge, Box, Dropdown, Input, Menu, MenuButton, MenuItem } from "@mui/joy";
import React, { useRef, useState } from "react";
import { Card } from "scryfall-api";


export default function DeckCardDisplay({ 
    card, 
    quantity,
    onQuantityChange
}: {
    card: Card; 
    quantity: number;
    onQuantityChange?: (newQty: number) => void; 
}) {

    const [open, setOpen] = useState(false);
    const [currentQuantity, setCurrentQuantity] = useState(quantity);
    const buttonRef = useRef(null);


    return (
        <Dropdown open={open} onOpenChange={(e, isOpen) => setOpen(isOpen)}>
            <MenuButton sx={{ display: 'contents' }} ref={buttonRef}>
                <Box className="card-display">
                    <Badge badgeContent={currentQuantity}>
                        <img
                            src={card.image_uris?.png || card.card_faces?.[0].image_uris?.png}
                            alt={`${card.name} (${card.set})`}
                            width={250}
                        />
                    </Badge>
                </Box>
            </MenuButton>

            <Menu onClick={() => setOpen(!open)}>
                <MenuItem
                    className="card-menu"
                    onClick={() => window.open(card.scryfall_uri, '_blank', 'noreferrer')}
                >
                    See card on Scryfall <img src="/icons/other/scryfall.svg" width={25}/>
                </MenuItem>
                <MenuItem className="card-menu">Switch printing <AutoAwesome/></MenuItem>
                <MenuItem
                    className="card-menu"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOpen(true)
                    }}
                >
                    Change quantity
                    <Input
                        onClick={(e) => e.stopPropagation()}
                        defaultValue={quantity}
                        type="number"
                        slotProps={{ input: {
                            min: 1,
                            max: 999,
                            step: 1
                        }}}
                        onChange={(e) => {
                            const newQty = Number(e.target.value);
                            setCurrentQuantity(newQty);
                            if (onQuantityChange) onQuantityChange(newQty);
                        }}
                    />
                </MenuItem>
                <MenuItem className="card-menu">Move to sideboard <SwapHoriz/></MenuItem>
            </Menu>
        </Dropdown>
    )
}