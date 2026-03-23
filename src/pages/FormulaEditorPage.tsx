import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useI18n } from '../i18n/i18n.tsx';
import { useApp } from '../context/AppContext';
import { useTheme } from '../hooks/useTheme';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { RecipeEditor } from '../components/features/Editor/RecipeEditor';

export const FormulaEditorPage: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const { t } = useI18n();
    const { recipeManager, addToast, saveToHistory, history } = useApp();
    const { primaryColor, animationsEnabled } = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            const found = history.find(r => r.id === id);
            if (found) {
                recipeManager.loadRecipe(found);
            } else {
                addToast('Fórmula não encontrada', 'error');
                navigate('/formulas');
            }
        } else {
            recipeManager.clearRecipe();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleFinalize = () => {
        if (recipeManager.validateRecipe(t)) {
            saveToHistory(recipeManager.currentRecipe);
            navigate(`/formulas/${recipeManager.currentRecipe.id}/preview`);
        }
    };

    useKeyboardShortcuts({
        onAddIngredient: recipeManager.addIngredient,
        onSave: handleFinalize,
        onPreview: () => navigate(`/formulas/${recipeManager.currentRecipe.id}/preview`),
        onEscape: () => {},
        isEditor: true,
        isPreview: false,
        hasModalOpen: false,
    });

    return (
        <RecipeEditor
            manager={recipeManager}
            onCancel={() => navigate('/formulas')}
            onPreview={() => navigate(`/formulas/${recipeManager.currentRecipe.id}/preview`)}
            onFinalize={handleFinalize}
            animationsEnabled={animationsEnabled}
            primaryColor={primaryColor}
        />
    );
};
