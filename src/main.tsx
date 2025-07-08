import React, { StrictMode } from 'react'
import * as ReactDOM from 'react-dom/client'
import App from './App.tsx';
import { CssVarsProvider } from '@mui/joy';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <CssVarsProvider>
            <App/>
        </CssVarsProvider>
    </StrictMode>,
)
