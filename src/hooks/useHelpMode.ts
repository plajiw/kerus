import { useState, useEffect } from 'react';

const KEY = 'kerus_help_mode';
const EVENT = 'kerus_help_mode_changed';

const getHelpMode = (): boolean => {
    try { return localStorage.getItem(KEY) !== 'false'; } catch { return true; }
};

/**
 * Global help-mode toggle.
 * Default: enabled (preserves existing hint behaviour).
 * Uses a window custom event so all mounted HintButton instances
 * react immediately when the setting is changed on the Settings page.
 */
export const useHelpMode = () => {
    const [helpMode, setHelpModeState] = useState<boolean>(getHelpMode);

    useEffect(() => {
        const handler = () => setHelpModeState(getHelpMode());
        window.addEventListener(EVENT, handler);
        return () => window.removeEventListener(EVENT, handler);
    }, []);

    const setHelpMode = (v: boolean) => {
        setHelpModeState(v);
        try {
            localStorage.setItem(KEY, String(v));
            window.dispatchEvent(new Event(EVENT));
        } catch {}
    };

    return { helpMode, setHelpMode };
};
