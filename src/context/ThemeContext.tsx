import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { PRIMARY_COLOR } from '../constants/appConfig';
import { getPrefs, setPrefs, ThemeMode } from '../services/localStorageService';

const resolveIsDark = (mode: ThemeMode): boolean => {
    if (mode === 'dark') return true;
    if (mode === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const applyTheme = (dark: boolean, mode: ThemeMode = 'light') => {
    // [data-theme] attribute — used by tokens.css and components.css
    const themeAttr = dark ? 'dark' : (mode !== 'system' ? mode : 'light');
    document.documentElement.setAttribute('data-theme', themeAttr);
    // .dark class — kept for Tailwind dark: utility compatibility
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
};

interface ThemeContextValue {
    animationsEnabled: boolean;
    setAnimationsEnabled: (v: boolean) => void;
    themeMode: ThemeMode;
    setThemeMode: (mode: ThemeMode) => void;
    isDark: boolean;
    toggleDark: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isDark, setIsDark] = useState<boolean>(() => {
        const { themeMode } = getPrefs();
        const dark = resolveIsDark(themeMode);
        applyTheme(dark, themeMode);
        return dark;
    });

    const [animationsEnabled, setAnimationsEnabledState] = useState<boolean>(() => getPrefs().animationsEnabled);
    const [themeMode, setThemeModeState] = useState<ThemeMode>(() => getPrefs().themeMode);

    // Apply fixed brand color once on mount
    useEffect(() => {
        document.documentElement.style.setProperty('--primary', PRIMARY_COLOR);
    }, []);

    // Apply theme attribute and dark class whenever isDark/themeMode changes
    useEffect(() => { applyTheme(isDark, themeMode); }, [isDark, themeMode]);

    // Persist preferences
    useEffect(() => {
        setPrefs({ animationsEnabled, themeMode });
    }, [animationsEnabled, themeMode]);

    // System theme listener
    useEffect(() => {
        if (themeMode !== 'system') return;
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const onchange = () => setIsDark(media.matches);
        setIsDark(media.matches);
        media.addEventListener('change', onchange);
        return () => media.removeEventListener('change', onchange);
    }, [themeMode]);

    const setAnimationsEnabled = useCallback((v: boolean) => setAnimationsEnabledState(v), []);

    const setThemeMode = useCallback((mode: ThemeMode) => {
        setThemeModeState(mode);
        setIsDark(resolveIsDark(mode));
    }, []);

    const toggleDark = useCallback(() => {
        setThemeMode(isDark ? 'light' : 'dark');
    }, [isDark, setThemeMode]);

    return (
        <ThemeContext.Provider value={{
            animationsEnabled, setAnimationsEnabled,
            themeMode, setThemeMode,
            isDark, toggleDark,
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextValue => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
    return ctx;
};
