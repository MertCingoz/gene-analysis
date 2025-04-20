import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
    <ThemeProvider theme={createTheme({ palette: { mode: 'dark' } })}>
        <CssBaseline/>
        <StrictMode>
            <App/>
        </StrictMode>
    </ThemeProvider>
);
