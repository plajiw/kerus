import { useState, useEffect } from 'react';
import { getPrefs, setPrefs } from '../services/localStorageService';

const EVENT = 'kerus_help_mode_changed';

/**
 * Global help-mode toggle.
 * Default: enabled (preserves existing hint behaviour).
 * Uses a window custom event so all mounted HintButton instances
 * react immediately when the setting is changed on the Settings page.
 */
export const useHelpMode = () => {
    const [helpMode, setHelpModeState] = useState<boolean>(() => getPrefs().helpMode);

    useEffect(() => {
        const handler = () => setHelpModeState(getPrefs().helpMode);
        window.addEventListener(EVENT, handler);
        return () => window.removeEventListener(EVENT, handler);
    }, []);

    const setHelpMode = (v: boolean) => {
        setHelpModeState(v);
        setPrefs({ helpMode: v });
        window.dispatchEvent(new Event(EVENT));
    };

    return { helpMode, setHelpMode };
};
