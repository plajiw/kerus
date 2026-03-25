import { useState, useCallback } from 'react';
import { PaymentModel } from '../types';

const STORAGE_KEY = 'kerus_payment_models';

const load = (): PaymentModel[] => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch {}
    
    // Default preset
    return [
        {
            id: 'preset-1',
            name: 'Padrão Cosmético (50/50)',
            entryPercentage: 50,
            installments: 1,
            paymentTerms: 'Sinal de 50% via PIX para início do projeto, e 50% na aprovação final das fórmulas.'
        }
    ];
};

const persist = (list: PaymentModel[]) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {}
};

export const usePaymentModels = () => {
    const [paymentModels, setPaymentModels] = useState<PaymentModel[]>(load);

    const savePaymentModel = useCallback((model: PaymentModel) => {
        setPaymentModels(prev => {
            const idx = prev.findIndex(x => x.id === model.id);
            const next = idx >= 0
                ? prev.map(x => x.id === model.id ? model : x)
                : [...prev, model];
            persist(next);
            return next;
        });
    }, []);

    const deletePaymentModel = useCallback((id: string) => {
        setPaymentModels(prev => {
            const next = prev.filter(x => x.id !== id);
            persist(next);
            return next;
        });
    }, []);

    return { paymentModels, savePaymentModel, deletePaymentModel };
};
