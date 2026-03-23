import { useState, useCallback } from 'react';

const KEY = 'kerus_advanced_mode';

export const useAdvancedMode = () => {
    const [enabled, setEnabledState] = useState<boolean>(() => {
        try { return localStorage.getItem(KEY) === 'true'; } catch { return false; }
    });

    const setEnabled = useCallback((v: boolean) => {
        setEnabledState(v);
        try { localStorage.setItem(KEY, String(v)); } catch {}
    }, []);

    return { advancedMode: enabled, setAdvancedMode: setEnabled };
};
