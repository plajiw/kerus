import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useI18n } from '../../i18n/i18n.tsx';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../hooks/useTheme';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { SheetEditor } from '../../components/features/Editor/SheetEditor';

export const SheetEditorPage: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const { t } = useI18n();
    const { recipeManager, addToast, saveToHistory, history } = useApp();
    const { animationsEnabled } = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            const found = history.find(r => r.id === id);
            if (found) {
                recipeManager.loadRecipe(found);
            } else {
                addToast('Fórmula não encontrada', 'error');
                navigate('/fichas-tecnicas');
            }
        } else {
            recipeManager.clearRecipe();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleFinalize = () => {
        if (recipeManager.validateRecipe(t)) {
            saveToHistory(recipeManager.currentRecipe);
            navigate(`/fichas-tecnicas/${recipeManager.currentRecipe.id}/preview`);
        }
    };

    useKeyboardShortcuts({
        onAddIngredient: recipeManager.addIngredient,
        onSave: handleFinalize,
        onPreview: () => navigate(`/fichas-tecnicas/${recipeManager.currentRecipe.id}/preview`),
        onEscape: () => {},
        isEditor: true,
        isPreview: false,
        hasModalOpen: false,
    });

    return (
        <SheetEditor
            manager={recipeManager}
            onCancel={() => navigate('/fichas-tecnicas')}
            onPreview={() => navigate(`/fichas-tecnicas/${recipeManager.currentRecipe.id}/preview`)}
            onFinalize={handleFinalize}
            animationsEnabled={animationsEnabled}
        />
    );
};
