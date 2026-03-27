import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { I18nProvider } from './i18n/i18n.tsx';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';
import { LoadingProvider } from './context/LoadingContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error('Could not find root element to mount to');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <ThemeProvider>
                <I18nProvider>
                    <AppProvider>
                        <LoadingProvider>
                            <App />
                        </LoadingProvider>
                    </AppProvider>
                </I18nProvider>
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
);
