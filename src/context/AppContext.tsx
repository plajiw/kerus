import React, { createContext, useContext } from 'react';
import { useToast, Toast, ToastType } from '../hooks/useToast';
import { useHistory } from '../hooks/useHistory';
import { useRecipeManager } from '../hooks/useRecipeManager';
import { useQuotations } from '../hooks/useQuotations';
import { usePaymentModels } from '../hooks/usePaymentModels';
import { useFavorites } from '../hooks/useFavorites';
import { Recipe, Quotation, QuotationStatus, PaymentModel } from '../types';

interface AppContextValue {
    toasts: Toast[];
    addToast: (message: string, type?: ToastType) => void;
    removeToast: (id: string) => void;
    history: Recipe[];
    saveToHistory: (recipe: Recipe) => void;
    deleteRecipe: (id: string) => void;
    filteredHistory: Recipe[];
    historyFilterStart: string;
    setHistoryFilterStart: (v: string) => void;
    historyFilterEnd: string;
    setHistoryFilterEnd: (v: string) => void;
    recipeManager: ReturnType<typeof useRecipeManager>;
    quotations: Quotation[];
    saveQuotation: (q: Quotation) => void;
    deleteQuotation: (id: string) => void;
    updateQuotationStatus: (id: string, status: QuotationStatus) => void;
    paymentModels: PaymentModel[];
    savePaymentModel: (model: PaymentModel) => void;
    deletePaymentModel: (id: string) => void;
    favoriteIds: Set<string>;
    toggleFavorite: (id: string) => void;
    isFavorite: (id: string) => boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export const useApp = (): AppContextValue => {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used within AppProvider');
    return ctx;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { toasts, addToast, removeToast } = useToast();
    const {
        history, saveToHistory, deleteRecipe,
        filteredHistory, historyFilterStart, setHistoryFilterStart,
        historyFilterEnd, setHistoryFilterEnd,
    } = useHistory();
    const recipeManager = useRecipeManager();
    const { quotations, saveQuotation, deleteQuotation, updateStatus: updateQuotationStatus } = useQuotations();
    const { paymentModels, savePaymentModel, deletePaymentModel } = usePaymentModels();
    const { favoriteIds, toggleFavorite, isFavorite } = useFavorites();

    return (
        <AppContext.Provider value={{
            toasts, addToast, removeToast,
            history, saveToHistory, deleteRecipe,
            filteredHistory, historyFilterStart, setHistoryFilterStart,
            historyFilterEnd, setHistoryFilterEnd,
            recipeManager,
            quotations, saveQuotation, deleteQuotation, updateQuotationStatus,
            paymentModels, savePaymentModel, deletePaymentModel,
            favoriteIds, toggleFavorite, isFavorite,
        }}>
            {children}
        </AppContext.Provider>
    );
};
