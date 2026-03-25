import React, { useMemo } from 'react';
import {
    DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { Trash2, AlertTriangle } from 'lucide-react';

import { SortableItem } from '../../common/SortableItem';
import { HintButton } from '../../ui/HintButton';
import { useI18n } from '../../../i18n/i18n.tsx';
import { useAdvancedMode } from '../../../hooks/useAdvancedMode';
import type { Ingredient, IngredientPhase } from '../../../types';
import { useRecipeManager } from '../../../hooks/useRecipeManager';
import { SectionCard } from '../../ui/SectionCard';

interface IngredientsSectionProps {
    ingredientes: Ingredient[];
    manager: ReturnType<typeof useRecipeManager>;
    newlyAddedId: string | null;
    onDragEnd: (event: DragEndEvent) => void;
    batchSize?: number;
}

const UNITS = ['GR', 'KG', 'ML', 'LT', 'UN', 'MG', '%'];

// ─── Phase config ──────────────────────────────────────────────
const PHASES: { value: IngredientPhase; color: string; label: string }[] = [
    { value: 'A', color: '#3b82f6', label: 'A — Aquosa' },
    { value: 'B', color: '#f59e0b', label: 'B — Oleosa' },
    { value: 'C', color: '#8b5cf6', label: 'C — Emulsificante' },
    { value: 'D', color: '#10b981', label: 'D — Ativa' },
    { value: 'E', color: '#f43f5e', label: 'E — Aroma' },
];
const PHASE_MAP = Object.fromEntries(PHASES.map(p => [p.value, p]));

const nextPhase = (current?: IngredientPhase): IngredientPhase | undefined => {
    if (!current) return 'A';
    const idx = PHASES.findIndex(p => p.value === current);
    return idx === PHASES.length - 1 ? undefined : PHASES[idx + 1].value;
};

const PhaseBadge: React.FC<{ phase?: IngredientPhase; onClick: () => void }> = ({ phase, onClick }) => {
    const cfg = phase ? PHASE_MAP[phase] : null;
    return (
        <button
            type="button"
            onClick={onClick}
            title={cfg ? cfg.label : 'Definir fase (A/B/C/D/E)'}
            className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black transition-all"
            style={{
                background: cfg ? `${cfg.color}22` : 'var(--surface-2)',
                border: `1.5px solid ${cfg ? cfg.color : 'var(--border)'}`,
                color: cfg ? cfg.color : 'var(--ink-2)',
            }}
        >
            {phase ?? '·'}
        </button>
    );
};

// ─── Phase stats panel ─────────────────────────────────────────
const PhaseStats: React.FC<{
    ingredientes: Ingredient[];
    totalWeight: number;
    totalCost: number;
    batchSize?: number;
}> = ({ ingredientes, totalWeight, totalCost, batchSize }) => {
    const { t } = useI18n();

    const phaseStats = useMemo(() => {
        return PHASES.map(p => {
            const items = ingredientes.filter(i => i.phase === p.value);
            const weight = items.reduce((s, i) => s + (i.quantidade || 0), 0);
            const pct = totalWeight > 0 ? (weight / totalWeight) * 100 : 0;
            return { ...p, weight, pct, count: items.length };
        }).filter(p => p.count > 0);
    }, [ingredientes, totalWeight]);

    const withPhase = ingredientes.filter(i => i.phase).length;
    const waterPct = useMemo(() => {
        const phaseA = ingredientes.filter(i => i.phase === 'A').reduce((s, i) => s + (i.quantidade || 0), 0);
        return totalWeight > 0 ? (phaseA / totalWeight) * 100 : 0;
    }, [ingredientes, totalWeight]);

    const costPerKg = totalWeight > 0 ? (totalCost / totalWeight) * 1000 : 0;
    const batchGrams = batchSize && batchSize > 0 ? batchSize : null;

    if (withPhase === 0 && !batchGrams) return null;

    return (
        <div className="mt-3 rounded-xl p-4 space-y-3" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--ink-2)' }}>
                    Distribuição por Fases
                </span>
                {batchGrams && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md" style={{ background: 'var(--surface-0)', color: 'var(--primary)' }}>
                        Lote: {batchGrams}g
                    </span>
                )}
            </div>

            {/* Phase bars */}
            {phaseStats.length > 0 && (
                <div className="space-y-2">
                    {phaseStats.map(p => (
                        <div key={p.value} className="flex items-center gap-2">
                            <div
                                className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-black flex-shrink-0"
                                style={{ background: `${p.color}22`, border: `1.5px solid ${p.color}`, color: p.color }}
                            >
                                {p.value}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between text-[10px] mb-0.5">
                                    <span style={{ color: 'var(--ink-1)' }}>{p.label.split(' — ')[1]}</span>
                                    <span className="font-mono font-bold" style={{ color: 'var(--ink-0)' }}>
                                        {p.pct.toFixed(1)}%
                                        {batchGrams && <span style={{ color: 'var(--ink-2)' }}> · {((p.pct / 100) * batchGrams).toFixed(1)}g</span>}
                                    </span>
                                </div>
                                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface-3)' }}>
                                    <div className="h-full rounded-full transition-all" style={{ width: `${p.pct}%`, background: p.color }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Quick metrics */}
            <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="rounded-lg px-3 py-2 text-center" style={{ background: 'var(--surface-0)' }}>
                    <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'var(--ink-2)' }}>Aquosa</p>
                    <p className="text-sm font-mono font-bold mt-0.5" style={{ color: '#3b82f6' }}>{waterPct.toFixed(1)}%</p>
                </div>
                <div className="rounded-lg px-3 py-2 text-center" style={{ background: 'var(--surface-0)' }}>
                    <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'var(--ink-2)' }}>Custo/kg</p>
                    <p className="text-sm font-mono font-bold mt-0.5" style={{ color: '#059669' }}>{costPerKg.toFixed(2)}</p>
                </div>
                <div className="rounded-lg px-3 py-2 text-center" style={{ background: 'var(--surface-0)' }}>
                    <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'var(--ink-2)' }}>Ingredientes</p>
                    <p className="text-sm font-mono font-bold mt-0.5" style={{ color: 'var(--ink-0)' }}>{ingredientes.length}</p>
                </div>
            </div>
        </div>
    );
};

// ─── Main component ────────────────────────────────────────────
export const IngredientsSection: React.FC<IngredientsSectionProps> = ({
    ingredientes,
    manager,
    newlyAddedId,
    onDragEnd,
    batchSize,
}) => {
    const { t } = useI18n();
    const { advancedMode } = useAdvancedMode();

    const totalWeight = useMemo(
        () => ingredientes.reduce((acc, curr) => acc + (curr.quantidade || 0), 0),
        [ingredientes]
    );
    const totalCost = useMemo(
        () => ingredientes.reduce((acc, curr) => acc + ((curr.custo_unitario || 0) * (curr.quantidade || 0)), 0),
        [ingredientes]
    );
    const hasFilledIngredients = ingredientes.some(ing => ing.nome.trim() || ing.quantidade > 0);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    return (
        <SectionCard
            title={t('editor.ingredients')}
            hint={t('hints.ingredients')}
            collapsible={true}
            badge={advancedMode && (
                <span
                    className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md"
                    style={{ background: 'rgba(var(--primary-rgb,59,130,246),0.1)', color: 'var(--primary)' }}
                >
                    ADV
                </span>
            )}
            actions={
                <button
                    onClick={manager.addIngredient}
                    className="ds-button"
                    style={{ color: 'var(--primary)' }}
                >
                    {t('buttons.addItem')}
                </button>
            }
        >
            {/* Warning: total weight zero */}
            {hasFilledIngredients && totalWeight === 0 && (
                <div className="mx-3 mt-3 flex items-center gap-2 rounded-lg px-3 py-2 text-xs"
                    style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: '#b45309' }}
                >
                    <AlertTriangle size={13} />
                    {t('validation.totalWeightZero')}
                </div>
            )}

            {/* Rows */}
            <div className="p-3">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd} modifiers={[restrictToVerticalAxis]}>
                    <SortableContext items={ingredientes} strategy={verticalListSortingStrategy}>
                        <div className="space-y-1.5">
                            {ingredientes.map((ing) => {
                                const pct = totalWeight > 0 ? ((ing.quantidade || 0) / totalWeight) * 100 : 0;
                                const batchGrams = batchSize && batchSize > 0 && totalWeight > 0
                                    ? ((ing.quantidade || 0) / totalWeight) * batchSize
                                    : null;

                                return (
                                    <SortableItem
                                        key={ing.id}
                                        id={ing.id}
                                        newlyAddedId={newlyAddedId}
                                        align={advancedMode ? 'start' : 'center'}
                                    >
                                        {/* Phase badge (advanced only) */}
                                        {advancedMode && (
                                            <div className="flex-shrink-0 mt-1">
                                                <PhaseBadge
                                                    phase={ing.phase}
                                                    onClick={() => manager.updateIngredient(ing.id, 'phase', nextPhase(ing.phase))}
                                                />
                                            </div>
                                        )}

                                        {/* Name + INCI area */}
                                        <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                                            <input
                                                className="w-full text-sm bg-transparent outline-none font-medium"
                                                style={{ color: 'var(--ink-0)' }}
                                                value={ing.nome}
                                                onChange={e => manager.updateIngredient(ing.id, 'nome', e.target.value)}
                                                placeholder={t('placeholders.ingredientName')}
                                            />
                                            {advancedMode && (
                                                <input
                                                    className="w-full text-[10px] bg-transparent outline-none italic"
                                                    style={{ color: 'var(--ink-2)' }}
                                                    value={ing.inci || ''}
                                                    onChange={e => manager.updateIngredient(ing.id, 'inci', e.target.value)}
                                                    placeholder="INCI name..."
                                                />
                                            )}
                                        </div>

                                        {/* % badge */}
                                        <div
                                            className="flex-shrink-0 text-[10px] font-mono tabular-nums px-1.5 rounded-md flex flex-col items-end"
                                            style={{
                                                background: 'var(--surface-2)',
                                                color: 'var(--ink-2)',
                                                minWidth: 42,
                                            }}
                                        >
                                            <span style={{ lineHeight: '20px' }}>{pct.toFixed(1)}%</span>
                                            {advancedMode && batchGrams !== null && (
                                                <span style={{ color: 'var(--primary)', lineHeight: '14px', fontSize: 9 }}>
                                                    {batchGrams.toFixed(2)}g
                                                </span>
                                            )}
                                        </div>

                                        {/* Qty */}
                                        <input
                                            type="number"
                                            step="0.001"
                                            min="0"
                                            className="ds-input flex-shrink-0 text-right font-mono"
                                            style={{
                                                width: 76,
                                                borderColor: ing.quantidade === 0 ? 'rgba(245,158,11,0.6)' : undefined,
                                                background: ing.quantidade === 0 ? 'rgba(245,158,11,0.06)' : undefined,
                                            }}
                                            value={ing.quantidade}
                                            onChange={e => manager.updateIngredient(ing.id, 'quantidade', parseFloat(e.target.value) || 0)}
                                            onFocus={e => e.currentTarget.select()}
                                        />

                                        {/* Unit */}
                                        <select
                                            className="ds-select flex-shrink-0 text-xs font-bold uppercase text-center"
                                            style={{ width: 64 }}
                                            value={ing.unidade}
                                            onChange={e => manager.updateIngredient(ing.id, 'unidade', e.target.value)}
                                        >
                                            {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                                        </select>

                                        {/* Unit price */}
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            className="ds-input flex-shrink-0 text-right font-mono"
                                            style={{ width: 84 }}
                                            placeholder="0.00"
                                            value={ing.custo_unitario || ''}
                                            onChange={e => manager.updateIngredient(ing.id, 'custo_unitario', parseFloat(e.target.value) || 0)}
                                            onFocus={e => e.currentTarget.select()}
                                        />

                                        {/* Delete */}
                                        <button
                                            onClick={() => manager.removeIngredient(ing.id)}
                                            className="flex-shrink-0 ds-icon-button opacity-50 hover:opacity-100 hover:text-red-500"
                                            title={t('common.remove')}
                                        >
                                            <Trash2 size={13} />
                                        </button>

                                    </SortableItem>
                                );
                            })}
                        </div>
                    </SortableContext>
                </DndContext>

                {ingredientes.length === 0 && (
                    <p className="text-xs italic py-6 text-center" style={{ color: 'var(--ink-2)' }}>
                        {t('editor.emptyHint')}
                    </p>
                )}

                {/* Advanced: phase statistics */}
                {advancedMode && ingredientes.length > 0 && (
                    <PhaseStats
                        ingredientes={ingredientes}
                        totalWeight={totalWeight}
                        totalCost={totalCost}
                        batchSize={batchSize}
                    />
                )}
            </div>

            {/* Footer totals */}
            <div
                className="flex items-center justify-between px-5 py-3"
                style={{ background: 'var(--surface-1)', borderTop: '1px solid var(--border)' }}
            >
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--ink-2)' }}>
                        {t('editor.totalWeight')}
                    </p>
                    <p className="text-base font-mono font-bold" style={{ color: 'var(--ink-0)' }}>
                        {totalWeight.toFixed(3)} <span className="text-xs" style={{ color: 'var(--ink-2)' }}>{t('common.unit')}</span>
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--ink-2)' }}>
                        {t('editor.estimatedCost')}
                    </p>
                    <p className="text-base font-mono font-bold" style={{ color: '#059669' }}>
                        {t('common.currency')} {totalCost.toFixed(2)}
                    </p>
                </div>
            </div>
        </SectionCard>
    );
};
