import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { WizardModal } from '../WizardModal';
import { ToastContainer } from '../ui/ToastContainer';
import { useApp } from '../../context/AppContext';
import { useAIWizard } from '../../hooks/useAIWizard';
import { useI18n } from '../../i18n/i18n.tsx';
import { useTheme } from '../../hooks/useTheme';
import { Recipe } from '../../types';

export type AppOutletContext = {
    openWizard: () => void;
};

export const AppLayout: React.FC = () => {
    const { toasts, removeToast, recipeManager } = useApp();
    const { locale } = useI18n();
    const { animationsEnabled } = useTheme();
    const navigate = useNavigate();

    const handleAiGenerated = (recipe: Recipe) => {
        recipeManager.loadRecipe(recipeManager.sanitizeRecipe(recipe));
        navigate('/formulas/nova');
    };

    const wizard = useAIWizard(handleAiGenerated, locale);

    return (
        <div
            className="flex h-screen overflow-hidden font-sans"
            style={{
                backgroundColor: 'var(--surface-1)',
                color: 'var(--ink-0)',
            }}
        >
            <Sidebar />
            <main
                className="flex-1 min-w-0 overflow-y-auto"
                style={{ backgroundColor: 'var(--surface-1)' }}
            >
                <Outlet context={{ openWizard: wizard.open } as AppOutletContext} />
            </main>
            <WizardModal wizard={wizard} animationsEnabled={animationsEnabled} />
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </div>
    );
};
