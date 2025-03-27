import { AutoAwesome, SwapHoriz } from "@mui/icons-material";
import { Badge, Box, Dropdown, Input, Menu, MenuButton, MenuItem } from "@mui/joy";
import React, { useRef, useState } from "react";
import { Card } from "scryfall-api";


export default function DeckCardDisplay({ card, quantity }: { card: Card; quantity: number }) {

    const [open, setOpen] = useState(false);
    const buttonRef = useRef(null);


    return (
        <Dropdown open={open} onOpenChange={(e, isOpen) => setOpen(isOpen)}>
            <MenuButton sx={{ display: 'contents' }} ref={buttonRef}>
                <Box className="card-display">
                    <Badge badgeContent={quantity}>
                        <img
                            src={card.image_uris?.png || card.card_faces?.[0].image_uris?.png}
                            alt={`${card.name} (${card.set})`}
                            width={250}
                        />
                    </Badge>
                </Box>
            </MenuButton>

            <Menu placement="top-end" anchorEl={this}>
                <MenuItem
                    className="card-menu"
                    onClick={() => window.open(card.scryfall_uri, '_blank', 'noreferrer')}
                >
                    See card on Scryfall <img src="/icons/other/scryfall.svg" width={25}/>
                </MenuItem>
                <MenuItem className="card-menu">Switch printing <AutoAwesome/></MenuItem>
                <Box 
                    sx={{ 
                        display:"flex", 
                        flexDirection: "row", 
                        justifyContent: "space-between",
                        padding: "5px",
                        verticalAlign: "text-bottom",
                        height: "fit-content",
                        outline: "1px solid red",
                        lineHeight: "30px"
                    }}
                    className="card-menu"
                    onClick={(e) => e.preventDefault()}
                >
                    Change quantity
                    <Input
                        sx={{
                            width: 'fit-content'
                        }}
                        onClick={(e) => e.stopPropagation()}
                        defaultValue={1}
                        type="number"
                        slotProps={{
                            input: {
                                min: 1,
                                max: 99,
                                step: 1
                            }
                        }}
                    />
                </Box>
                <MenuItem className="card-menu">Move to sideboard <SwapHoriz/></MenuItem>
            </Menu>
        </Dropdown>
    )
}