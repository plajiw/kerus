import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Menu, FlaskConical } from 'lucide-react';
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
    const { animationsEnabled, primaryColor } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    const handleAiGenerated = (recipe: Recipe) => {
        recipeManager.loadRecipe(recipeManager.sanitizeRecipe(recipe));
        navigate('/formulas/nova');
    };

    const wizard = useAIWizard(handleAiGenerated, locale);

    return (
        <div
            className="flex flex-col lg:flex-row h-screen overflow-hidden font-sans"
            style={{
                backgroundColor: 'var(--surface-1)',
                color: 'var(--ink-0)',
            }}
        >
            {/* Mobile top bar */}
            <div
                className="lg:hidden flex items-center h-14 px-4 gap-3 flex-shrink-0"
                style={{ backgroundColor: 'var(--surface-0)', borderBottom: '1px solid var(--border)' }}
            >
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="ds-icon-button flex-shrink-0"
                    aria-label="Abrir menu"
                >
                    <Menu size={18} />
                </button>
                <div className="flex items-center gap-2 px-1">
                    <div className="flex flex-col">
                        <span className="font-extrabold text-sm uppercase tracking-[0.05em] leading-none" style={{ color: 'var(--ink-0)' }}>
                            Kerus
                        </span>
                        <span className="text-[8px] font-mono opacity-50 uppercase tracking-widest mt-0.5" style={{ color: 'var(--ink-2)' }}>
                            alpha-1.0.0
                        </span>
                    </div>
                </div>
            </div>

            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

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
