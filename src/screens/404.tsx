import { Box, Typography, Link } from "@mui/joy";
import React from "react";
import { BASE_ROUTE } from "../router/AppRouter";

export default function Page404() {
    return (
        <Box>
            <Typography level="h1">404: Page not found</Typography>
            <Link href={`${BASE_ROUTE}`}>Go back home</Link>
        </Box>
    )
}