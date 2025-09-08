import { SearchOutlined } from "@mui/icons-material";
import { Box, Button, IconButton, Input, Link, ToggleButtonGroup, Typography } from "@mui/joy";
import { useState } from "react";
import { supabase } from "../../db/supabase";
import DeckPreviewCard from "../components/DeckPreviewCard";
import UserPreviewCard from "../components/UserPreviewCard";
import { AppUser, Deck } from "../services/api";

export default function ExplorePage() {
    
    const [searchFor, setSearchFor] = useState("deck");
    const [searchValue, setSearchValue] = useState<string>();
    const [data, setData] = useState<Deck[] | AppUser[] | null>();


    async function getSearchData() {
        switch (searchFor) {
            case "deck": {
                const { data, error } = await supabase
                    .from("decks")
                    .select("*")
                    .ilike("name", `%${searchValue}%`);

                if (error) throw new Error("Error searching decks: ", error);
                else setData(data);
                break;
            }
            
            case "user": {
                const { data, error } = await supabase
                    .from("users")
                    .select("*")
                    .ilike("username", `%${searchValue}%`);
    
                if (error) throw new Error("Error searching users: ", error);
                else setData(data);
                break;
            }
            
            case "commander": {
                const { data, error } = await supabase
                .from("decks")
                .select("*")
                .or(`commanders->0->>name.ilike.%${searchValue}%,commanders->1->>name.ilike.%${searchValue}%`);
                
                if (error) throw new Error("Error searching users: ", error);
                else setData(data);
                break;
            }
        }
    }
    
    return (
        <Box>
            <Box sx={{ 
                display: "flex", 
                flexDirection: "column", 
                justifyContent: "space-evenly", 
                alignItems: "center", 
                width: "350px", 
                margin: "50px auto"
            }}>
                <Typography fontWeight="bold">Search for</Typography>
                <ToggleButtonGroup
                    value={searchFor}
                    onChange={(event, val) => {
                        setData(null);
                        setSearchFor(val!);
                    }}
                    sx={{
                        display: "flex", 
                        flexDirection: "row", 
                        justifyContent: "center",
                        margin: "10px 0"
                    }}
                >
                    <Button value="deck">Deck</Button>
                    <Button value="commander">Commander</Button>
                    <Button value="user">User</Button>
                </ToggleButtonGroup>
            </Box>

            <Box sx={{
                display: "flex",
                flexDirection: "column",
                width: "80%",
                margin: "20px auto",
                justifyContent: "space-between"
            }}>
                <Input
                    type="text"
                    onChange={(e) => setSearchValue(e.target.value)}
                    sx={{ flex: "1" }}
                    endDecorator={
                        <IconButton
                            onClick={() => {
                                if (!searchValue) return;
                                getSearchData();
                            }}
                            color="primary"
                            variant="solid"
                        >
                            <SearchOutlined/>
                        </IconButton>
                    }
                />

            </Box>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
            {(searchFor === "deck" || searchFor === "commander") ? 
                data?.map((deck, i) => (
                    <DeckPreviewCard key={i} deckId={deck?.id}/>
                )) 
                :
                data?.map((user, i) => (
                    <UserPreviewCard key={i} userId={user?.id}/>
                ))
            }
            </Box>
        </Box>
    )
}