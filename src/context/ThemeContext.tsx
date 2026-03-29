import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { getPrefs, setPrefs, ThemeMode } from '../services/localStorageService';

const resolveIsDark = (mode: ThemeMode): boolean => {
    if (mode === 'system') return window.matchMedia('(prefers-color-scheme: dark)').matches;
    return mode !== 'light';
};

const applyTheme = (dark: boolean, mode: ThemeMode = 'light') => {
    const themeAttr = mode === 'system' ? (dark ? 'dark' : 'light') : mode;
    document.documentElement.setAttribute('data-theme', themeAttr);
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
    // Inicializa o estado lendo as preferências salvas e aplicando o tema inicial
    const [isDark, setIsDark] = useState<boolean>(() => {
        const { themeMode } = getPrefs();
        const dark = resolveIsDark(themeMode);
        applyTheme(dark, themeMode);
        return dark;
    });

    const [animationsEnabled, setAnimationsEnabledState] = useState<boolean>(() => getPrefs().animationsEnabled);
    const [themeMode, setThemeModeState] = useState<ThemeMode>(() => getPrefs().themeMode);

    // Sempre que o modo de tema ou o estado 'dark' mudar, re-aplica no DOM
    useEffect(() => { 
        applyTheme(isDark, themeMode); 
    }, [isDark, themeMode]);

    // Persiste as preferências sempre que elas mudarem
    useEffect(() => {
        setPrefs({ animationsEnabled, themeMode });
    }, [animationsEnabled, themeMode]);

    // Listener para reagir a mudanças no tema do sistema operacional (se o modo for 'system')
    useEffect(() => {
        if (themeMode !== 'system') return;
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Define função de callback tipada corretamente
        const onchange = (e: MediaQueryListEvent) => setIsDark(e.matches);
        
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