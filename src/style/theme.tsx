import { createTheme } from "@mui/material/styles";


export function getInitialMode() {
    const savedMode = localStorage.getItem("joy-mode");
    if (savedMode) return savedMode === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export const theme = createTheme({
    palette: {
        mode: "dark",
        background: {
            default: "#2d2c39",
            paper: "#1e1e1e",
        },
        text: {
            primary: "#000",
            secondary: "#000"
        }
    }
});