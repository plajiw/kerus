import { useState, useCallback } from 'react';
import { getPrefs, setPrefs } from '../services/localStorageService';

export const useAdvancedMode = () => {
    const [enabled, setEnabledState] = useState<boolean>(() => getPrefs().advancedMode);

    const setEnabled = useCallback((v: boolean) => {
        setEnabledState(v);
        setPrefs({ advancedMode: v });
    }, []);

    return { advancedMode: enabled, setAdvancedMode: setEnabled };
};
