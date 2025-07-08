import { Box, Typography, Link } from "@mui/joy";
import React from "react";

export default function Page404() {
    return (
        <Box>
            <Typography level="h1">404: Page not found</Typography>
            <Link href="/">Go back home</Link>
        </Box>
    )
}