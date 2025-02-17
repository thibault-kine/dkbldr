import React, { StrictMode } from 'react'
import * as ReactDOM from 'react-dom/client'
import './App.css'

import Home from './screens/Home.js'
import DeckBuilder from './screens/DeckBuilder.js'
import DeckDetails from './screens/DeckDetails.js'
import About from './screens/About.js'
import Page404 from './screens/404.js'
import ProtectedRoute from './components/ProtectedRoute.js'
import RegisterPage from './screens/RegisterPage.js'
import LoginPage from './screens/LoginPage.js'


import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Profile from './screens/Profile.js'
const router = createBrowserRouter([

    { path: '/', element: <Home/> },
    { path: '/login', element: <LoginPage/> },
    { path: '/register', element: <RegisterPage/> },
    {
        element: <ProtectedRoute/>,
        children: [
            { path: '/user/:username/:id', element: <Profile/> },
            { path: '/builder', element: <DeckBuilder/> },
            { path: '/details/:id', element: <DeckDetails/> },
        ]
    },
    { path: '/about', element: <About/> },
    { path: '*', element: <Page404/> },

]);


ReactDOM.createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router}/>
    </StrictMode>,
)
