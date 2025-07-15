import { SearchOutlined } from "@mui/icons-material";
import { Box, Button, Input, Link, ToggleButtonGroup, Typography } from "@mui/joy";
import { useState } from "react";
import { Deck } from "../../db/decks";
import { User } from "../context/UserContext";
import { supabase } from "../../db/supabase";

export default function ExplorePage() {
    
    const [searchFor, setSearchFor] = useState("deck");
    const [searchValue, setSearchValue] = useState<string>();
    const [data, setData] = useState<Deck[] | User[] | null>();

    async function getSearchData() {
        switch (searchFor) {
            case "deck": {
                const { data, error } = await supabase
                    .from("decks")
                    .select("*")
                    .ilike("name", `%${searchValue}%`);

                if (error) throw new Error("Error searching decks: ", error);
                else setData(data);
            }
            
            case "user": {
                const { data, error } = await supabase
                    .from("users")
                    .select("*")
                    .ilike("username", `%${searchValue}%`);
    
                if (error) throw new Error("Error searching users: ", error);
                else setData(data);
            }
        }
    }
    
    return (
        <Box>
            <ToggleButtonGroup
                value={searchFor}
                onChange={(event, val) => setSearchFor(val!)}
            >
                <Button value="user">User</Button>
                <Button value="deck">Deck</Button>
            </ToggleButtonGroup>

            <Input
                type="text"
                onChange={(e) => setSearchValue(e.target.value)}
            />
            <Button
                startDecorator={<SearchOutlined/>}
                onClick={() => {
                    if (!searchValue) return;
                    getSearchData();
                }}
            >
                Tutor {`${searchFor}s`}
            </Button>

            <Box>
            {searchFor === "deck" ? 
                data?.map((deck, i) => (
                    <Link href={`/deck/${deck?.id}/details`} key={i}>{deck?.name}</Link>
                )) :
                data?.map((user, i) => (
                    <Link href={`/user/${user?.username}/${user?.id}`} key={i}>{user?.username}</Link>
                ))
            }
            </Box>
        </Box>
    )
}