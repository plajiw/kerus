import { useState, useCallback } from 'react';
import { Quotation, QuotationStatus } from '../types';

const STORAGE_KEY = 'kerus_quotations';

const load = (): Quotation[] => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

const persist = (list: Quotation[]) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {}
};

export const useQuotations = () => {
    const [quotations, setQuotations] = useState<Quotation[]>(load);

    const saveQuotation = useCallback((q: Quotation) => {
        setQuotations(prev => {
            const idx = prev.findIndex(x => x.id === q.id);
            const next = idx >= 0
                ? prev.map(x => x.id === q.id ? q : x)
                : [q, ...prev];
            persist(next);
            return next;
        });
    }, []);

    const deleteQuotation = useCallback((id: string) => {
        setQuotations(prev => {
            const next = prev.filter(x => x.id !== id);
            persist(next);
            return next;
        });
    }, []);

    const updateStatus = useCallback((id: string, status: QuotationStatus) => {
        setQuotations(prev => {
            const next = prev.map(x => x.id === id ? { ...x, status } : x);
            persist(next);
            return next;
        });
    }, []);

    return { quotations, saveQuotation, deleteQuotation, updateStatus };
};
