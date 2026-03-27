import { useState, useCallback } from 'react';
import { AppPreferences, getPrefs, setPrefs } from '../services/localStorageService';

/**
 * Provides read/write access to persisted UI preferences.
 * Changes are written to localStorage immediately.
 */
export const usePreferences = () => {
    const [prefs, setLocalPrefs] = useState<AppPreferences>(getPrefs);

    const updatePrefs = useCallback((patch: Partial<AppPreferences>) => {
        const next = setPrefs(patch);
        setLocalPrefs(next);
    }, []);

    return { prefs, updatePrefs };
};
