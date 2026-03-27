import React, { useState } from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import { AlertCircle, Calculator, Settings2, ArrowLeft } from 'lucide-react';

import { useRecipeManager } from '../../../hooks/useRecipeManager';
import { SheetPrintable } from '../../SheetPrintable';
import { useI18n } from '../../../i18n/i18n.tsx';
import { EditorShell } from '../../ui/EditorShell';

import { MetadataSection } from './MetadataSection';
import { IngredientsSection } from './IngredientsSection';
import { PreparationSection } from './PreparationSection';
import { ObservationsSection } from './ObservationsSection';
import { StyleSection } from './StyleSection';

interface SheetEditorProps {
    manager: ReturnType<typeof useRecipeManager>;
    onCancel: () => void;
    onPreview: () => void;
    onFinalize: () => void;
    animationsEnabled: boolean;
}

const FORMULA_STATUS_STYLES: Record<string, { color: string; bg: string; border: string }> = {
    RASCUNHO: { color: '#b45309', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.4)' },
    FINAL:    { color: '#047857', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.4)' },
};

export const SheetEditor: React.FC<SheetEditorProps> = ({
    manager,
    onCancel,
    onFinalize,
}) => {
    const { t } = useI18n();
    const { currentRecipe, newlyAddedId, validationErrors } = manager;
    const [activeTab, setActiveTab] = useState<'content' | 'style'>('content');

    const handleDragEndIngredients = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) manager.moveIngredient(active.id as string, over.id as string);
    };

    const handleDragEndSteps = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) manager.moveStep(active.id as string, over.id as string);
    };

    const status = currentRecipe.status || 'RASCUNHO';
    const statusStyle = FORMULA_STATUS_STYLES[status] ?? FORMULA_STATUS_STYLES.RASCUNHO;

    const FORMULA_STATUS_OPTIONS = [
        { value: 'RASCUNHO', label: t('status.draft') },
        { value: 'FINAL',    label: t('status.final') },
    ];

    const formContent = (
        <div className="w-full px-6 py-6 space-y-5">

            {/* ── Page header ──────────────────────────────────── */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                    <button onClick={onCancel} className="ds-icon-button flex-shrink-0" title={t('common.back')}>
                        <ArrowLeft size={14} />
                    </button>
                    <h1 className="text-lg font-black uppercase tracking-tight" style={{ color: 'var(--ink-0)' }}>
                        {currentRecipe.id ? t('editor.editTitle') : t('editor.newTitle')}
                    </h1>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <select
                        className="ds-select text-xs font-bold uppercase tracking-wide"
                        value={status}
                        onChange={e => manager.handleFieldChange('status', e.target.value as 'RASCUNHO' | 'FINAL')}
                        style={{ color: statusStyle.color, background: statusStyle.bg, borderColor: statusStyle.border }}
                    >
                        {FORMULA_STATUS_OPTIONS.map(o => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>
                    <button onClick={onCancel} className="ds-button">
                        {t('common.cancel')}
                    </button>
                    <button onClick={onFinalize} className="ds-button-primary">
                        {t('buttons.saveSheet')}
                    </button>
                </div>
            </div>

            {/* ── Validation errors ─────────────────────────────── */}
            {validationErrors.length > 0 && (
                <div
                    className="flex items-start gap-2 px-4 py-3 rounded-xl"
                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}
                >
                    <AlertCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                    <ul className="space-y-0.5">
                        {validationErrors.map((err, i) => (
                            <li key={i} className="text-sm text-red-600">{err}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* ── Metadata card ─────────────────────────────────── */}
            <MetadataSection
                nomeFormula={currentRecipe.nome_formula}
                nomeEmpresa={currentRecipe.nome_empresa || ''}
                data={currentRecipe.data}
                tituloFicha={currentRecipe.titulo_ficha}
                subtituloFicha={currentRecipe.subtitulo_ficha}
                manager={manager}
            />

            {/* ── Tab switcher ──────────────────────────────────── */}
            <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--surface-2)' }}>
                {[
                    { key: 'content', icon: <Calculator size={13} />, label: t('editor.composition') },
                    { key: 'style',   icon: <Settings2  size={13} />, label: t('editor.appearance') },
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key as 'content' | 'style')}
                        className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all"
                        style={{
                            background: activeTab === tab.key ? 'var(--surface-2)' : 'transparent',
                            color:      activeTab === tab.key ? 'var(--primary)'   : 'var(--ink-2)',
                        }}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* ── Composition tab ───────────────────────────────── */}
            {activeTab === 'content' && (
                <div className="space-y-5">
                    <IngredientsSection
                        ingredientes={currentRecipe.ingredientes}
                        manager={manager}
                        newlyAddedId={newlyAddedId}
                        onDragEnd={handleDragEndIngredients}
                        batchSize={currentRecipe.batch_size}
                    />
                    <PreparationSection
                        steps={currentRecipe.modo_preparo}
                        exibir_modo_preparo={currentRecipe.exibir_modo_preparo ?? true}
                        manager={manager}
                        newlyAddedId={newlyAddedId}
                        onDragEnd={handleDragEndSteps}
                    />
                    <ObservationsSection
                        observacoes={currentRecipe.observacoes}
                        exibir_observacoes={currentRecipe.exibir_observacoes ?? true}
                        manager={manager}
                    />
                </div>
            )}

            {/* ── Appearance tab ────────────────────────────────── */}
            {activeTab === 'style' && (
                <StyleSection
                    accentColor={currentRecipe.accentColor || 'var(--primary)'}
                    fontFamily={currentRecipe.fontFamily || ''}
                    stripedRows={currentRecipe.stripedRows ?? true}
                    manager={manager}
                />
            )}
        </div>
    );

    return (
        <EditorShell
            preview={<SheetPrintable recipe={currentRecipe} />}
            mobilePreviewLabel={t('common.preview')}
        >
            {formContent}
        </EditorShell>
    );
};
