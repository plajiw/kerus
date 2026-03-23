import { useState, useCallback, useEffect } from 'react';

export interface CompanySettings {
    nomeEmpresa: string;
    nomeResponsavel: string;
    telefone: string;
}

const STORAGE_KEY = 'formulapro_company';

const DEFAULT: CompanySettings = {
    nomeEmpresa: '',
    nomeResponsavel: '',
    telefone: '',
};

export const useCompanySettings = () => {
    const [settings, setSettings] = useState<CompanySettings>(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? { ...DEFAULT, ...JSON.parse(raw) } : DEFAULT;
        } catch {
            return DEFAULT;
        }
    });

    const updateSettings = useCallback((patch: Partial<CompanySettings>) => {
        setSettings(prev => {
            const next = { ...prev, ...patch };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    }, []);

    return { settings, updateSettings };
};
