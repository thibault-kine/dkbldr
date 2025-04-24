import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "../components/Header";
import ProtectedRoute from "../components/ProtectedRoute";

import Home from "../screens/Home";
import LoginPage from "../screens/LoginPage";
import RegisterPage from "../screens/RegisterPage";
import About from "../screens/About";
import Profile from "../screens/Profile";
import DeckBuilder from "../screens/DeckBuilder";
import DeckDetails from "../screens/DeckDetails";
import Page404 from "../screens/404";
import { useUser } from "../context/UserContext";
import Navbar from "../components/Navbar";


export default function AppRouter() {

    const { user } = useUser();

    return (
        <>
            <Header />
            <Navbar/>
            <Routes>
                {/* Routes publiques */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/about" element={<About />} />

                {/* Routes protégées */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/user/:username/:id" element={<Profile />} />
                    <Route path="/builder" element={<DeckBuilder user={user} />} />
                    <Route path="/deck/:id/details" element={<DeckDetails />} />
                    {/* <Route path="/user/:username/:id/decks" element={<DeckList />} /> */}
                </Route>

                {/* Page 404 */}
                <Route path="*" element={<Page404 />} />
            </Routes>
        </>
    );
}
