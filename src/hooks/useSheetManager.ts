import { useState, useCallback } from 'react';
import { Sheet, Ingredient, Step } from '../types';
import { arrayMove } from '@dnd-kit/sortable';
import { isoToday } from '../utils/dateUtils';

const INITIAL_SHEET: Sheet = {
    id: '',
    nome_formula: '',
    ingredientes: [{ id: '', nome: '', quantidade: 0, unidade: 'g', porcentagem: 0, custo_unitario: 0, custo_total: 0 }],
    modo_preparo: [{ id: '', text: '' }],
    stripedRows: true,
    exibir_modo_preparo: true,
    exibir_observacoes: true,
    status: 'RASCUNHO',
    rendimento_kg: 0,
    rendimento_unidades: 0,
    custo_total_formula: 0,
    data: isoToday(),
    observacoes: '',
    nome_empresa: '',
};

export const useSheetManager = () => {
    const [currentSheet, setCurrentSheet] = useState<Sheet>(() => ({
        ...INITIAL_SHEET,
        data: isoToday(),
        id: crypto.randomUUID(),
        ingredientes: [{ id: crypto.randomUUID(), nome: '', quantidade: 0, unidade: 'g', porcentagem: 0, custo_unitario: 0, custo_total: 0 }],
        modo_preparo: [{ id: crypto.randomUUID(), text: '' }]
    }));
    const [newlyAddedId, setNewlyAddedId] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);


    // Helper to ensure IDs exist and defaults are set for new/imported sheets
    const sanitizeSheet = (sheet: Sheet): Sheet => {
        return {
            ...sheet,
            id: sheet.id || crypto.randomUUID(),
            ingredientes: sheet.ingredientes.map(ing => ({
                ...ing,
                id: ing.id || crypto.randomUUID(),
                porcentagem: ing.porcentagem || 0,
                // preserve advanced-mode fields as-is (phase, inci, function)
            })),
            modo_preparo: sheet.modo_preparo.map(step => ({ ...step, id: step.id || crypto.randomUUID() })),
            stripedRows: sheet.stripedRows ?? true,
            exibir_modo_preparo: sheet.exibir_modo_preparo ?? true,
            exibir_observacoes: sheet.exibir_observacoes ?? true,
            status: sheet.status ?? 'RASCUNHO',
            data: sheet.data || isoToday(),
        };
    };

    const loadSheet = (sheet: Sheet) => {
        setCurrentSheet(sanitizeSheet(sheet));
        setValidationErrors([]);
    };

    // Backwards compatibility alias (Phase 1)
    const loadRecipe = loadSheet;

    const clearSheet = () => {
        setCurrentSheet({
            ...INITIAL_SHEET,
            data: isoToday(),
            id: crypto.randomUUID(),
            ingredientes: [{ id: crypto.randomUUID(), nome: '', quantidade: 0, unidade: 'g', porcentagem: 0, custo_unitario: 0, custo_total: 0 }],
            modo_preparo: [{ id: crypto.randomUUID(), text: '' }],
        });
        setValidationErrors([]);
    };

    // Backwards compatibility alias (Phase 1)
    const clearRecipe = clearSheet;

    const handleFieldChange = (field: keyof Sheet, value: any) => {
        setCurrentSheet(prev => ({ ...prev, [field]: value }));
        if (validationErrors.length > 0) setValidationErrors([]);
    };

    // Ingredients Logic
    const addIngredient = () => {
        const newId = crypto.randomUUID();
        setCurrentSheet(prev => ({
            ...prev,
            ingredientes: [...prev.ingredientes, { id: newId, nome: '', quantidade: 0, unidade: 'g', porcentagem: 0, custo_unitario: 0, custo_total: 0 }]
        }));
        setNewlyAddedId(newId);
        setTimeout(() => setNewlyAddedId(null), 2000);
    };

    const removeIngredient = (id: string) => {
        if (currentSheet.ingredientes.length <= 1) return;
        setCurrentSheet(prev => ({
            ...prev,
            ingredientes: prev.ingredientes.filter(i => i.id !== id)
        }));
    };

    const updateIngredient = (id: string, field: keyof Ingredient, value: any) => {
        if (validationErrors.length > 0) setValidationErrors([]);
        setCurrentSheet(prev => {
            const updatedIngs = prev.ingredientes.map(ing => {
                if (ing.id === id) {
                    const updated = { ...ing, [field]: value };

                    // Recalculate item total cost
                    const qty = field === 'quantidade' ? Number(value) || 0 : (ing.quantidade || 0);
                    const unitCost = field === 'custo_unitario' ? Number(value) || 0 : (ing.custo_unitario || 0);
                    updated.custo_total = qty * unitCost;

                    return updated;
                }
                return ing;
            });

            const totalWeight = updatedIngs.reduce((sum, ing) => sum + (Number(ing.quantidade) || 0), 0);
            const totalCost = updatedIngs.reduce((sum, ing) => sum + (ing.custo_total || 0), 0);

            const finalIngs = updatedIngs.map(ing => ({
                ...ing,
                porcentagem: totalWeight > 0 ? ((Number(ing.quantidade) || 0) / totalWeight) * 100 : 0
            }));

            return {
                ...prev,
                ingredientes: finalIngs,
                rendimento_kg: totalWeight / 1000,
                custo_total_formula: totalCost
            };
        });
    };

    const moveIngredient = (activeId: string, overId: string) => {
        setCurrentSheet((prev) => {
            const oldIndex = prev.ingredientes.findIndex((i) => i.id === activeId);
            const newIndex = prev.ingredientes.findIndex((i) => i.id === overId);
            return {
                ...prev,
                ingredientes: arrayMove(prev.ingredientes, oldIndex, newIndex),
            };
        });
    };


    // Steps Logic
    const addStep = () => {
        const newId = crypto.randomUUID();
        setCurrentSheet(prev => ({
            ...prev,
            modo_preparo: [...prev.modo_preparo, { id: newId, text: '' }]
        }));
        setNewlyAddedId(newId);
        setTimeout(() => setNewlyAddedId(null), 2000);
    };

    const removeStep = (id: string) => {
        if (currentSheet.modo_preparo.length <= 1) return;
        setCurrentSheet(prev => ({
            ...prev,
            modo_preparo: prev.modo_preparo.filter(s => s.id !== id)
        }));
    };

    const updateStep = (id: string, value: string) => {
        setCurrentSheet(prev => ({
            ...prev,
            modo_preparo: prev.modo_preparo.map(s => s.id === id ? { ...s, text: value } : s)
        }));
    };

    const moveStep = (activeId: string, overId: string) => {
        setCurrentSheet((prev) => {
            const oldIndex = prev.modo_preparo.findIndex((s) => s.id === activeId);
            const newIndex = prev.modo_preparo.findIndex((s) => s.id === overId);
            return {
                ...prev,
                modo_preparo: arrayMove(prev.modo_preparo, oldIndex, newIndex),
            };
        });
    };

    const validateSheet = (t: (key: string, params?: Record<string, string | number>) => string) => {
        const errors: string[] = [];
        if (!currentSheet.nome_formula.trim()) errors.push(t('validation.recipeNameRequired'));
        currentSheet.ingredientes.forEach((ing, index) => {
            if (!ing.nome.trim()) errors.push(t('validation.ingredientNameRequired', { index: index + 1 }));
            if (ing.quantidade <= 0) errors.push(t('validation.ingredientQtyRequired', { index: index + 1 }));
        });
        setValidationErrors(errors);
        return errors.length === 0;
    };

    // Backwards compatibility alias (Phase 1)
    const validateRecipe = validateSheet;

    const calculateTotalWeight = useCallback(() => {
        return currentSheet.ingredientes.reduce((sum, ing) => sum + (Number(ing.quantidade) || 0), 0);
    }, [currentSheet.ingredientes]);

    return {
        currentSheet,
        currentRecipe: currentSheet, // Backwards compat
        setCurrentSheet,
        setCurrentRecipe: setCurrentSheet, // Backwards compat
        newlyAddedId,
        validationErrors,
        sanitizeSheet,
        sanitizeRecipe, // Backwards compat
        loadSheet,
        loadRecipe, // Backwards compat
        clearSheet,
        clearRecipe, // Backwards compat
        handleFieldChange,
        addIngredient,
        removeIngredient,
        updateIngredient,
        moveIngredient,
        addStep,
        removeStep,
        updateStep,
        moveStep,
        validateSheet,
        validateRecipe, // Backwards compat
        calculateTotalWeight
    };
};

// Backwards compatibility export (Phase 1)
export const useRecipeManager = useSheetManager;
