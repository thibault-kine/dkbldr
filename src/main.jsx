import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Home from './screens/Home'
import DeckBuilder from './screens/DeckBuilder.jsx'
import DeckDetails from './screens/DeckDetails.jsx'
import About from './screens/About.jsx'
import Page404 from './screens/404.jsx'

const router = createBrowserRouter([

    { path: '/', element: <Home/> },
    { path: '/builder', element: <DeckBuilder/> },
    { path: '/details/:id', element: <DeckDetails/> },
    { path: '/about', element: <About/> },
    { path: '*', element: <Page404/> },

]);

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RouterProvider router={router}/>
    </StrictMode>,
)
