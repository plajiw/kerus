import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useI18n } from '../../i18n/i18n.tsx';
import { Recipe } from '../../types';
import { isoToday } from '../../utils/dateUtils';

interface JsonImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (recipe: Recipe) => void;
    onError: () => void;
    sanitizeRecipe: (recipe: Recipe) => Recipe;
}

export const JsonImportModal: React.FC<JsonImportModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    onError,
    sanitizeRecipe,
}) => {
    const { t } = useI18n();
    const [jsonText, setJsonText] = useState('');

    if (!isOpen) return null;

    const handleImport = () => {
        try {
            const parsed = JSON.parse(jsonText);
            const ingredientes = Array.isArray(parsed.ingredientes) ? parsed.ingredientes : [];
            const modoPreparoRaw = Array.isArray(parsed.modo_preparo) ? parsed.modo_preparo : [];
            const modo_preparo = modoPreparoRaw.map((step: any) => ({
                id: crypto.randomUUID(),
                text: typeof step === 'string' ? step : String(step?.text || ''),
            }));

            const recipe: Recipe = {
                id: crypto.randomUUID(),
                nome_formula: String(parsed.nome_formula || '').trim(),
                nome_empresa: String(parsed.empresa_responsavel || parsed.nome_empresa || '').trim(),
                data: String(parsed.data || isoToday()),
                ingredientes: ingredientes.map((ing: any) => ({
                    id: crypto.randomUUID(),
                    nome: String(ing?.nome || '').trim(),
                    quantidade: Number(ing?.quantidade || 0),
                    unidade: String(ing?.unidade || '').toUpperCase(),
                })),
                modo_preparo,
                observacoes: String(parsed.observacoes || ''),
                stripedRows: true,
                exibir_modo_preparo: true,
                exibir_observacoes: true,
                exibir_ilustracao: parsed.exibir_ilustracao ?? false,
                ilustracao_svg: typeof parsed.ilustracao_svg === 'string' ? parsed.ilustracao_svg : '',
                ilustracao_alt: typeof parsed.ilustracao_alt === 'string' ? parsed.ilustracao_alt : '',
            };

            onSuccess(sanitizeRecipe(recipe));
            setJsonText('');
            onClose();
        } catch {
            onError();
        }
    };

    return (
        <div className="fixed inset-0 z-[210]">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="absolute left-1/2 top-1/2 w-[min(720px,92vw)] -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-neutral-900 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('buttons.importJson')}</h2>
                    <button onClick={onClose} className="ds-icon-button">
                        <X size={14} />
                    </button>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                    {t('messages.jsonImportHelp')}
                </p>
                <textarea
                    className="w-full h-64 ds-textarea font-mono text-sm focus:border-[var(--primary)]"
                    value={jsonText}
                    onChange={(e) => setJsonText(e.target.value)}
                    placeholder={t('placeholders.jsonImportSample')}
                />
                <div className="mt-5 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 text-sm font-bold ds-button hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
                    >
                        {t('common.cancel')}
                    </button>
                    <button
                        onClick={handleImport}
                        className="px-6 py-2 text-sm font-bold ds-button-primary hover:opacity-90 transition-opacity"
                    >
                        {t('buttons.importJson')}
                    </button>
                </div>
            </div>
        </div>
    );
};
