import { AutoAwesome, Loop, SwapHoriz } from "@mui/icons-material";
import { Badge, Box, Dropdown, IconButton, Input, Menu, MenuButton, MenuItem } from "@mui/joy";
import React, { use, useRef, useState } from "react";
import { Card } from "scryfall-api";

export default function DeckCardDisplay({ 
    card, 
    quantity,
    inSideboard,
    onQuantityChange,
    isAuthor = true
}: {
    card: Card; 
    quantity: number;
    inSideboard: boolean;
    onQuantityChange?: (newQty: number) => void; 
    isAuthor?: boolean;
}) {

    const [open, setOpen] = useState(false);

    const [currentQuantity, setCurrentQuantity] = useState(quantity);
    const [isInCollection, setIsInCollection] = useState(false);
    const [currentPrint, setCurrentPrint] = useState(card);
    const [isFlipped, setIsFlipped] = useState(false);

    const displayedFace = (card.card_faces && !card.image_uris) ? (isFlipped ? card.card_faces?.[1] : card.card_faces?.[0]) : card;

    const buttonRef = useRef(null);


    const onPrintChange = async () => { }


    const onBoardSwitch = () => { }


    return (
        <Dropdown open={open} onOpenChange={(e, isOpen) => setOpen(isOpen)}>
            <Box>
                <MenuButton 
                    variant="soft" 
                    ref={buttonRef}
                    sx={{ display: 'contents' }} 
                >
                    <Box className="card-display">
                        <Badge badgeContent={currentQuantity} sx={{ zIndex: 0 }}>
                            <img
                                src={displayedFace.image_uris?.png}
                                alt={`${card.name} (${card.set.toUpperCase()}#${card.collector_number})`}
                                style={{ margin: "auto", width: "80%" }}
                            />
                        </Badge>
                    </Box>
                </MenuButton>
                {(card.card_faces && !card.image_uris) && (
                    <Box sx={{ width: "100%", height: "0px", margin: "0px" }}>
                        <IconButton 
                            variant="soft" 
                            className="flip-btn" 
                            onClick={() => setIsFlipped(!isFlipped)} 
                            sx={{ 
                                zIndex: 0,
                                ':hover': {
                                    bgcolor: "var(--purple)"
                                }
                            }}
                        >
                            <Loop sx={{ color: "white" }}/>
                        </IconButton>
                    </Box>
                )}
            </Box>

            <Menu>
                <MenuItem
                    className="card-menu"
                    onClick={() => window.open(card.scryfall_uri, '_blank', 'noreferrer')}
                >
                    See card on Scryfall <img src="/icons/other/scryfall.svg" width={25}/>
                </MenuItem>
                {isAuthor ?? 
                    <MenuItem 
                        className="card-menu"
                        onClick={() => onPrintChange()}
                    >
                        Switch printing <AutoAwesome/>
                    </MenuItem>
                }
                
                {isAuthor ?? 
                    <MenuItem className="card-menu"> 
                        {isInCollection ? "Remove from collection" : "Add to collection"}
                    </MenuItem>
                }
                {isAuthor ?? 
                    <Box
                        className="card-menu-box"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setOpen(true)
                        }}
                    >
                        Change quantity
                        <Input
                            className="qty-input"
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
                    </Box>
                }
                {isAuthor ?? 
                    <MenuItem 
                        className="card-menu"
                        onClick={() => onBoardSwitch()}
                    >
                        Move to {inSideboard ? "mainboard" : "sideboard"} <SwapHoriz/>
                    </MenuItem>
                }
            </Menu>
        </Dropdown>
    )
}