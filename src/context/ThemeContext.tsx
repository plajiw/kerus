import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { UI_THEMES } from '../constants/themes';

type ThemeMode = 'light' | 'dark' | 'system';

const PREFS_KEY = 'ficha_tecnica_prefs';

const resolveIsDark = (mode: ThemeMode): boolean => {
    if (mode === 'dark') return true;
    if (mode === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const applyDark = (dark: boolean) => {
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
};

interface ThemeContextValue {
    primaryColor: string;
    setPrimaryColor: (color: string) => void;
    animationsEnabled: boolean;
    setAnimationsEnabled: (v: boolean) => void;
    themeMode: ThemeMode;
    setThemeMode: (mode: ThemeMode) => void;
    isDark: boolean;
    toggleDark: () => void;
    UI_THEMES: typeof UI_THEMES;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Initialize isDark synchronously from localStorage and apply immediately
    const [isDark, setIsDark] = useState<boolean>(() => {
        try {
            const raw = localStorage.getItem(PREFS_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                const mode: ThemeMode = parsed.themeMode === 'light' || parsed.themeMode === 'dark'
                    ? parsed.themeMode
                    : 'system';
                const dark = resolveIsDark(mode);
                applyDark(dark);
                return dark;
            }
        } catch {}
        const dark = resolveIsDark('light');
        applyDark(dark);
        return dark;
    });

    const [primaryColor, setPrimaryColorState] = useState<string>(() => {
        try {
            const raw = localStorage.getItem(PREFS_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed.primaryColor) return parsed.primaryColor;
            }
        } catch {}
        return '#FF8C00';
    });

    const [animationsEnabled, setAnimationsEnabledState] = useState<boolean>(true);

    const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
        try {
            const raw = localStorage.getItem(PREFS_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed.themeMode === 'light' || parsed.themeMode === 'dark') return parsed.themeMode;
            }
        } catch {}
        return 'light';
    });

    // Apply dark class on every isDark change (single source of truth)
    useEffect(() => {
        applyDark(isDark);
    }, [isDark]);

    // Apply primary color CSS var
    useEffect(() => {
        document.documentElement.style.setProperty('--primary', primaryColor);
    }, [primaryColor]);

    // Persist all prefs to localStorage
    useEffect(() => {
        try {
            const raw = localStorage.getItem(PREFS_KEY);
            const prev = raw ? JSON.parse(raw) : {};
            localStorage.setItem(PREFS_KEY, JSON.stringify({
                ...prev, primaryColor, animationsEnabled, themeMode
            }));
        } catch {}
    }, [primaryColor, animationsEnabled, themeMode]);

    // Load animationsEnabled (not needed for initial render, so async is fine)
    useEffect(() => {
        try {
            const raw = localStorage.getItem(PREFS_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            if (typeof parsed.animationsEnabled === 'boolean') {
                setAnimationsEnabledState(parsed.animationsEnabled);
            }
        } catch {}
    }, []);

    // System theme listener — only when mode is 'system'
    useEffect(() => {
        if (themeMode !== 'system') return;
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const onchange = () => {
            setIsDark(media.matches);
        };
        // Sync immediately in case it drifted
        setIsDark(media.matches);
        media.addEventListener('change', onchange);
        return () => media.removeEventListener('change', onchange);
    }, [themeMode]);

    const setPrimaryColor = useCallback((color: string) => setPrimaryColorState(color), []);
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
            primaryColor, setPrimaryColor,
            animationsEnabled, setAnimationsEnabled,
            themeMode, setThemeMode,
            isDark, toggleDark,
            UI_THEMES,
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
