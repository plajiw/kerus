import { useState, useCallback } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { Quotation, QuotationItem, QuotationStatus, DeliveryMethod } from '../types';
import { isoToday } from '../utils/dateUtils';

const EMPTY_QUOTATION = (): Quotation => ({
    id: crypto.randomUUID(),
    title: '',
    clientName: '',
    date: isoToday(),
    status: 'RASCUNHO',
    items: [],
    payment: {
        total: 0,
        entry: 0,
        installments: 0,
        installmentValue: 0,
        paymentTerms: '',
        startDate: isoToday(),
    },
    deliveryMethod: 'online',
    deliveryFormat: 'Fórmulas em PDF com passo a passo de produção',
    notes: '',
});

export const useQuotationManager = () => {
    const [currentQuotation, setCurrentQuotation] = useState<Quotation>(EMPTY_QUOTATION);
    const [newlyAddedId, setNewlyAddedId] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    // ─── Core ──────────────────────────────────────────────────
    const loadQuotation = useCallback((q: Quotation) => {
        setCurrentQuotation(q);
        setValidationErrors([]);
    }, []);

    const clearQuotation = useCallback(() => {
        setCurrentQuotation(EMPTY_QUOTATION());
        setValidationErrors([]);
    }, []);

    const handleFieldChange = useCallback(<K extends keyof Quotation>(field: K, value: Quotation[K]) => {
        setCurrentQuotation(prev => ({ ...prev, [field]: value }));
        if (validationErrors.length > 0) setValidationErrors([]);
    }, [validationErrors.length]);

    const handlePaymentChange = useCallback(<K extends keyof Quotation['payment']>(
        field: K, value: Quotation['payment'][K]
    ) => {
        setCurrentQuotation(prev => {
            const payment = { ...prev.payment, [field]: value };
            // Auto-recalculate installment value
            if (payment.installments > 0) {
                const remainder = payment.total - payment.entry;
                payment.installmentValue = remainder / payment.installments;
            } else {
                payment.installmentValue = 0;
            }
            return { ...prev, payment };
        });
    }, []);

    // ─── Items ─────────────────────────────────────────────────
    const addItem = useCallback(() => {
        const id = crypto.randomUUID();
        setCurrentQuotation(prev => ({
            ...prev,
            items: [...prev.items, { id, name: '', type: 'service' }],
        }));
        setNewlyAddedId(id);
        setTimeout(() => setNewlyAddedId(null), 2000);
    }, []);

    const removeItem = useCallback((id: string) => {
        setCurrentQuotation(prev => ({ ...prev, items: prev.items.filter(i => i.id !== id) }));
    }, []);

    const updateItem = useCallback((id: string, patch: Partial<QuotationItem>) => {
        setCurrentQuotation(prev => ({
            ...prev,
            items: prev.items.map(i => i.id === id ? { ...i, ...patch } : i),
        }));
    }, []);

    const linkFormula = useCallback((itemId: string, formulaId: string, formulaName: string) => {
        setCurrentQuotation(prev => ({
            ...prev,
            items: prev.items.map(i =>
                i.id === itemId
                    ? { ...i, name: formulaName, type: 'formula', linkedFormulaId: formulaId }
                    : i
            ),
        }));
    }, []);

    const unlinkFormula = useCallback((itemId: string) => {
        setCurrentQuotation(prev => ({
            ...prev,
            items: prev.items.map(i =>
                i.id === itemId ? { ...i, type: 'service', linkedFormulaId: undefined } : i
            ),
        }));
    }, []);

    const moveItem = useCallback((activeId: string, overId: string) => {
        setCurrentQuotation(prev => {
            const oldIdx = prev.items.findIndex(i => i.id === activeId);
            const newIdx = prev.items.findIndex(i => i.id === overId);
            return { ...prev, items: arrayMove(prev.items, oldIdx, newIdx) };
        });
    }, []);

    // ─── Validation ────────────────────────────────────────────
    const validateQuotation = useCallback((
        t: (key: string) => string
    ): boolean => {
        const errors: string[] = [];
        if (!currentQuotation.title.trim()) errors.push(t('quotations.validationTitle'));
        setValidationErrors(errors);
        return errors.length === 0;
    }, [currentQuotation]);

    return {
        currentQuotation,
        setCurrentQuotation,
        newlyAddedId,
        validationErrors,
        loadQuotation,
        clearQuotation,
        handleFieldChange,
        handlePaymentChange,
        addItem,
        removeItem,
        updateItem,
        linkFormula,
        unlinkFormula,
        moveItem,
        validateQuotation,
    };
};
