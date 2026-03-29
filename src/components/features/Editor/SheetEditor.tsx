import React, { useState } from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import { AlertCircle, Calculator, Settings2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { IconButton } from '../../ui/IconButton';

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

// DESIGN SYSTEM: Utilizando estritamente os tokens de status da v3.0
// Rascunho = Warning (Atenção/Em andamento) | Final = Success (Concluído)
const SHEET_STATUS_STYLES: Record<string, { color: string; bg: string }> = {
    RASCUNHO: { color: 'var(--status-warning-text)', bg: 'var(--status-warning-bg)' },
    FINAL:    { color: 'var(--status-success-text)', bg: 'var(--status-success-bg)' },
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
    const statusStyle = SHEET_STATUS_STYLES[status] ?? SHEET_STATUS_STYLES.RASCUNHO;

    const SHEET_STATUS_OPTIONS = [
        { value: 'RASCUNHO', label: t('status.draft') },
        { value: 'FINAL',    label: t('status.final') },
    ];

    const formContent = (
        <div className="w-full px-6 py-6 space-y-6">

            {/* ── Page header ──────────────────────────────────── */}
            <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3">
                    <IconButton
                        variant="ghost"
                        icon={<ArrowLeft size={18} />}
                        title={t('common.back')}
                        onClick={onCancel}
                    />
                    <h1 className="text-xl font-black uppercase tracking-tight" style={{ color: 'var(--ink-0)' }}>
                        {currentRecipe.id ? t('editor.editTitle') : t('editor.newTitle')}
                    </h1>
                </div>
                
                <div className="flex items-center gap-3 flex-wrap">
                    {/* Select transformado visualmente em um Badge dinâmico */}
                    <select
                        className="text-xs font-bold uppercase tracking-wide cursor-pointer outline-none transition-colors"
                        value={status}
                        onChange={e => manager.handleFieldChange('status', e.target.value as 'RASCUNHO' | 'FINAL')}
                        style={{ 
                            height: 'var(--h-control-sm)',
                            padding: '0 12px',
                            borderRadius: 'var(--radius-sm)',
                            color: statusStyle.color, 
                            background: statusStyle.bg,
                            border: 'none',
                            appearance: 'none', // Remove a setinha nativa pesada
                            textAlign: 'center'
                        }}
                    >
                        {SHEET_STATUS_OPTIONS.map(o => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>

                    <div className="flex items-center gap-2">
                        <button onClick={onCancel} className="ds-button ds-button-ghost">
                            {t('common.cancel')}
                        </button>
                        <button onClick={onFinalize} className="ds-button-primary">
                            <CheckCircle2 size={14} />
                            {t('buttons.saveSheet')}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Validation errors ─────────────────────────────── */}
            {validationErrors.length > 0 && (
                <div
                    className="flex items-start gap-3 px-4 py-3 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300"
                    style={{ background: 'var(--status-error-bg)', color: 'var(--status-error-text)' }}
                >
                    <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                    <ul className="space-y-1">
                        {validationErrors.map((err, i) => (
                            <li key={i} className="text-xs font-bold uppercase tracking-wide">{err}</li>
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

            {/* ── Tab switcher (Estilo iOS/macOS Toggle) ────────── */}
            <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--surface-3)' }}>
                {[
                    { key: 'content', icon: <Calculator size={14} />, label: t('editor.composition') },
                    { key: 'style',   icon: <Settings2  size={14} />, label: t('editor.appearance') },
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key as 'content' | 'style')}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all outline-none"
                        style={{
                            background: activeTab === tab.key ? 'var(--surface-2)' : 'transparent',
                            color:      activeTab === tab.key ? 'var(--primary)'   : 'var(--ink-2)',
                            // Exceção de sombra apenas para o toggle ativo simular o relevo de botão físico (muito comum em switches)
                            boxShadow:  activeTab === tab.key ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
                        }}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* ── Composition tab ───────────────────────────────── */}
            {activeTab === 'content' && (
                <div className="space-y-6 animate-in fade-in duration-300">
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
                <div className="animate-in fade-in duration-300">
                    <StyleSection
                        accentColor={currentRecipe.accentColor || 'var(--primary)'}
                        fontFamily={currentRecipe.fontFamily || ''}
                        stripedRows={currentRecipe.stripedRows ?? true}
                        manager={manager}
                    />
                </div>
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