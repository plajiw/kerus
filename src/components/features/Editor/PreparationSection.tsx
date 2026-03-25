import React from 'react';
import {
    DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { Trash2 } from 'lucide-react';

import { SortableItem } from '../../common/SortableItem';
import { useI18n } from '../../../i18n/i18n.tsx';
import type { Step } from '../../../types';
import { useRecipeManager } from '../../../hooks/useRecipeManager';
import { SectionCard } from '../../ui/SectionCard';

interface PreparationSectionProps {
    steps: Step[];
    exibir_modo_preparo: boolean;
    manager: ReturnType<typeof useRecipeManager>;
    newlyAddedId: string | null;
    onDragEnd: (event: DragEndEvent) => void;
}

export const PreparationSection: React.FC<PreparationSectionProps> = ({
    steps,
    exibir_modo_preparo,
    manager,
    newlyAddedId,
    onDragEnd,
}) => {
    const { t } = useI18n();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    return (
        <SectionCard
            title={t('editor.preparation')}
            collapsible={true}
            badge={
                <label className="flex items-center gap-1.5 cursor-pointer ml-3">
                    <input
                        type="checkbox"
                        checked={exibir_modo_preparo ?? true}
                        onChange={e => manager.handleFieldChange('exibir_modo_preparo', e.target.checked)}
                        className="w-3.5 h-3.5 rounded cursor-pointer"
                        style={{ accentColor: 'var(--primary)' }}
                    />
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--ink-2)' }}>
                        {t('editor.showInFile')}
                    </span>
                </label>
            }
            actions={
                <button
                    onClick={manager.addStep}
                    className="ds-button"
                    style={{ color: 'var(--primary)' }}
                >
                    {t('buttons.addStep')}
                </button>
            }
        >
            {/* Step rows */}
            <div className="p-3">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd} modifiers={[restrictToVerticalAxis]}>
                    <SortableContext items={steps} strategy={verticalListSortingStrategy}>
                        <div className="space-y-1.5">
                            {steps.map((step, idx) => (
                                <SortableItem key={step.id} id={step.id} newlyAddedId={newlyAddedId}>

                                    {/* Step number badge */}
                                    <div
                                        className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold"
                                        style={{ background: 'rgba(var(--primary-rgb,59,130,246),0.12)', color: 'var(--primary)' }}
                                    >
                                        {idx + 1}
                                    </div>

                                    {/* Step text — transparent, single-line grows with content */}
                                    <input
                                        className="flex-1 min-w-0 text-sm bg-transparent outline-none"
                                        style={{ color: 'var(--ink-0)' }}
                                        value={step.text}
                                        onChange={e => manager.updateStep(step.id, e.target.value)}
                                        placeholder={t('placeholders.step')}
                                    />

                                    {/* Delete */}
                                    <button
                                        onClick={() => manager.removeStep(step.id)}
                                        className="flex-shrink-0 ds-icon-button opacity-50 hover:opacity-100 hover:text-red-500"
                                        title={t('common.remove')}
                                    >
                                        <Trash2 size={13} />
                                    </button>

                                </SortableItem>
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>

                {steps.length === 0 && (
                    <p className="text-xs italic py-6 text-center" style={{ color: 'var(--ink-2)' }}>
                        {t('editor.emptyHint')}
                    </p>
                )}
            </div>
        </SectionCard>
    );
};
