import React, { useEffect, useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./style/theme";
import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import { UserProvider } from "./context/UserContext";
import "./App.css"
import { User } from "@supabase/supabase-js";
import { AuthProvider } from "./context/AuthContext";

function App() {
    return (
        <AuthProvider>
            <UserProvider>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Router>
                        <AppRouter />
                    </Router>
                </ThemeProvider>
            </UserProvider>
        </AuthProvider>
    );
}

export default App;
