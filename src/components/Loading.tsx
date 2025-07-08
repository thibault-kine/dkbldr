import React from "react";
import { CircularProgress } from "@mui/joy";

export default function Loading() {
    return (
        <CircularProgress
            sx={{
                width: "200px",
                margin: "auto"
            }}
        />
    )
}