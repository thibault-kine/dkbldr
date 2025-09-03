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
import Test from "../screens/Test";
import ExplorePage from "../screens/ExplorePage";

export const BASE_ROUTE = "/dkbldr";

export default function AppRouter() {

    const { user } = useUser();

    return (
        <>
            <Header />
            <Navbar/>
            <Routes>
                    {/* Routes publiques */}
                    <Route path={`${BASE_ROUTE}/`} element={<Home />} />
                    <Route path={`${BASE_ROUTE}/login`} element={<LoginPage />} />
                    <Route path={`${BASE_ROUTE}/register`} element={<RegisterPage />} />
                    <Route path={`${BASE_ROUTE}/about`} element={<About />} />
                    <Route path={`${BASE_ROUTE}/explore`} element={<ExplorePage />} />

                    {/* Routes protégées */}
                    <Route element={<ProtectedRoute />}>
                        <Route path={`${BASE_ROUTE}/user/:username/:id`} element={<Profile />} />
                        <Route path={`${BASE_ROUTE}/deck/:id/builder`} element={<DeckBuilder user={user} />} />
                        <Route path={`${BASE_ROUTE}/deck/:id/details`} element={<DeckDetails />} />
                    </Route>

                    {/* Page 404 */}
                    <Route path={`${BASE_ROUTE}/*`} element={<Page404 />} />

                    {/* Page de test */}
                    <Route path={`${BASE_ROUTE}/test`} element={<Test/>} />
            </Routes>
        </>
    );
}
