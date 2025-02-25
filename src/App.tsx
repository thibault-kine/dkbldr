// App.tsx
import React, { useEffect, useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./style/theme";
import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import { UserProvider } from "./context/UserContext";
import "./App.css"

function App() {

    return (
        <ThemeProvider theme={theme}>
            <UserProvider>
                <CssBaseline />
                <Router>
                    <AppRouter />
                </Router>
            </UserProvider>
        </ThemeProvider>
    );
}

export default App;
