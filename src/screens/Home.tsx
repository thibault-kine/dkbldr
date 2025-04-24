import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/joy"

export default function Home() {

    const navigate = useNavigate();

    return (
        <Box>
            <Typography>Homepage</Typography>
        </Box>
    )

}