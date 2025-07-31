import React, { useEffect, useRef, useState } from 'react'
import { getAllCards, searchCard } from '../../db/cards';
import { Autocomplete, AutocompleteOption, Box, Button, Input, Typography } from '@mui/joy';
import { Search } from '@mui/icons-material';
import { Card, Cards, Set, Sets } from 'scryfall-api';
import { User } from '../context/UserContext';
import { SxProps } from '@mui/joy/styles/types';

export default function CardSearchbar({ onSelected, sx } : { onSelected: (selected: Card) => void; sx?: SxProps | undefined }) {

    const [error, setError] = useState(null);
    const [suggestions, setSuggestions] = useState<Card[]>([]);
    // const [inputValue, setInputValue] = useState("");

    
    return (
        <Box>
            <Autocomplete
                sx={sx}
                options={suggestions ?? []}
                getOptionLabel={(option) => option.name}
                onChange={(_, val) => {
                    if (val) {
                        onSelected(val);
                    }
                }}
                onInputChange={(_, val) => {
                    (async () => {
                        // Look for EDH-legal cards
                        const res = await Cards.search(`legal:edh -otag:un-design ${val}`).all();
                        setSuggestions(res);
                        // console.log(suggestions?.map(c => c.name));
                    })();

                    // setInputValue(val);
                }}
                renderOption={(props, option) => {

                    return (
                        <AutocompleteOption 
                            {...props} 
                            key={option.id} 
                            className="searchbar-card-option"
                            sx={{
                                backgroundImage: `url(${
                                    option.card_faces ? 
                                        option.card_faces[0].image_uris?.art_crop :
                                        option?.image_uris?.art_crop
                                })`,
                                backgroundPosition: "center",
                                backgroundSize: "cover",
                                position: "relative",
                                height: "50px",
                                padding: "0"
                            }}
                        >
                        <Box
                        sx={{ 
                            backgroundColor: "rgba(0, 0, 0, 0.5)", 
                            width: "100%", height: "100%",
                            padding: "5px"
                        }}>
                            <Box sx={{ display: "flex", alignItems: "center", marginRight: "10px" }}>
                                {option.colors?.length! > 0 ? option.color_identity.map((c, k) => (
                                    <img key={k} src={`/icons/mana/${c}.svg`} width={20} />
                                )) : (
                                    <img src={`/icons/mana/C.svg`} width={20} />
                                )}
                            </Box>
                            <Typography sx={{ color: "white", fontWeight: "bold" }}>
                                {option.name}
                            </Typography>
                        </Box>
                        </AutocompleteOption>
                    )
                } 
            }
            />
            {error && <p style={{ color: "red" }}>{error}</p>}
        </Box>
    )
}
