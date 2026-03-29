import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft, Trash2, FlaskConical, GripVertical,
    Link2, Link2Off, AlertCircle, Settings2, ClipboardList, DollarSign,
} from 'lucide-react';
import {
    DndContext, closestCenter, PointerSensor, KeyboardSensor,
    useSensor, useSensors, DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';

import { useI18n } from '../../i18n/i18n.tsx';
import { useApp } from '../../context/AppContext.tsx';
import { useQuotationManager } from '../../hooks/useQuotationManager.ts';
import { RichTextSection } from '../../components/common/RichTextSection.tsx';
import { SectionCard } from '../../components/ui/SectionCard.tsx';
import { EditorShell } from '../../components/ui/EditorShell.tsx';
import { FormulaPickerDialog } from '../../components/modals/FormulaPickerDialog.tsx';
import { QuotationPaymentModal } from '../../components/modals/QuotationPaymentModal.tsx';
import { QuotationPrintable } from '../../components/QuotationPrintable.tsx';
import { FORMULA_THEMES, SHEET_FONTS } from '../../constants/themes.ts';
import { QuotationItem, QuotationStatus, PAYMENT_METHOD_LABELS } from '../../types/index.ts';

const STATUS_STYLE: Record<string, { bg: string; color: string; border: string }> = {
    RASCUNHO: { bg: 'rgba(245,158,11,0.12)', color: '#b45309', border: 'rgba(245,158,11,0.4)' },
    ENVIADO: { bg: 'rgba(99,102,241,0.12)', color: '#4338ca', border: 'rgba(99,102,241,0.4)' },
    APROVADO: { bg: 'rgba(16,185,129,0.12)', color: '#047857', border: 'rgba(16,185,129,0.4)' },
    RECUSADO: { bg: 'rgba(239,68,68,0.12)', color: '#b91c1c', border: 'rgba(239,68,68,0.4)' },
};

interface SortableItemRowProps {
    item: QuotationItem;
    isNew: boolean;
    onUpdate: (patch: Partial<QuotationItem>) => void;
    onRemove: () => void;
    onOpenPicker: () => void;
    onUnlink: () => void;
    t: (key: string) => string;
}

const SortableItemRow: React.FC<SortableItemRowProps> = ({
    item, isNew, onUpdate, onRemove, onOpenPicker, onUnlink, t,
}) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

    return (
        <div
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition: isDragging ? 'none' : transition,
                zIndex: isDragging ? 10 : 1,
                opacity: isDragging ? 0.75 : 1,
            }}
        >
            <div
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl transition-colors"
                style={{
                    background: 'var(--surface-1)',
                    border: isNew ? '2px solid var(--primary)' : '1px solid var(--border)',
                }}
            >
                <div
                    {...attributes}
                    {...listeners}
                    className="flex-shrink-0 cursor-grab touch-none transition-opacity opacity-30 hover:opacity-70"
                    style={{ color: 'var(--ink-2)' }}
                >
                    <GripVertical size={15} />
                </div>

                {item.type === 'sheet'
                    ? <FlaskConical size={14} className="flex-shrink-0" style={{ color: 'var(--primary)' }} />
                    : <div className="w-3.5 h-3.5 rounded border-2 flex-shrink-0" style={{ borderColor: 'var(--ink-2)' }} />
                }

                <input
                    className="flex-1 min-w-0 text-sm bg-transparent outline-none font-medium"
                    style={{ color: 'var(--ink-0)' }}
                    placeholder={t('quotations.itemPlaceholder')}
                    value={item.name}
                    onChange={e => onUpdate({ name: e.target.value })}
                />

                <button
                    onClick={onOpenPicker}
                    className="flex-shrink-0 ds-icon-button"
                    style={{ color: item.type === 'sheet' ? 'var(--primary)' : 'var(--ink-2)' }}
                    title={item.type === 'sheet' ? t('quotations.changeSheet') : t('quotations.linkSheet')}
                >
                    <Link2 size={13} />
                </button>

                {item.type === 'sheet' && (
                    <button
                        onClick={onUnlink}
                        className="flex-shrink-0 ds-icon-button opacity-50 hover:opacity-100 hover:text-red-500"
                        title={t('quotations.unlinkSheet')}
                    >
                        <Link2Off size={13} />
                    </button>
                )}

                <button
                    onClick={onRemove}
                    className="flex-shrink-0 ds-icon-button opacity-50 hover:opacity-100 hover:text-red-500"
                    title={t('common.remove')}
                >
                    <Trash2 size={13} />
                </button>
            </div>
        </div>
    );
};

const FieldGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: 'var(--ink-2)' }}>
            {label}
        </label>
        {children}
    </div>
);

export const QuotationEditorPage: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const { t } = useI18n();
    const { quotations, saveQuotation, addToast, history, paymentModels } = useApp();

    const manager = useQuotationManager();
    const {
        currentQuotation: q, newlyAddedId, validationErrors,
        loadQuotation, clearQuotation,
        handleFieldChange, handlePaymentChange,
        addItem, removeItem, updateItem, linkFormula, unlinkFormula, moveItem,
        validateQuotation,
    } = manager;

    const [pickerItemId, setPickerItemId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'content' | 'style'>('content');
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    useEffect(() => {
        if (id) {
            const found = quotations.find(x => x.id === id);
            if (found) loadQuotation(found);
            else { addToast('Orçamento não encontrado', 'error'); navigate('/orcamentos'); }
        } else {
            clearQuotation();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    const handleDragEnd = (e: DragEndEvent) => {
        const { active, over } = e;
        if (over && active.id !== over.id) moveItem(active.id as string, over.id as string);
    };

    const handleSave = () => {
        if (!validateQuotation(t)) return;
        saveQuotation(q);
        addToast(t('quotations.saved'), 'success');
        navigate('/orcamentos');
    };

    const handleApplyModel = (modelId: string) => {
        const model = paymentModels.find(m => m.id === modelId);
        if (!model) return;
        
        const total = q.payment.total || 0;
        const entry = total * (model.entryPercentage / 100);
        const installments = model.installments;
        const installmentValue = installments > 0 ? (total - entry) / installments : 0;

        handleFieldChange('payment', {
            ...q.payment,
            entry,
            installments,
            installmentValue,
            paymentTerms: model.paymentTerms,
            method: model.method,
            interestRate: model.interestRate,
            penaltyFee: model.penaltyFee
        });
        addToast(`Modelo "${model.name}" aplicado!`, 'success');
    };

    const handlePaymentConfigSave = (data: any) => {
        const total = q.payment.total || 0;
        const entry = total * (data.entryPercentage / 100);
        const installments = data.installments;
        const installmentValue = installments > 0 ? (total - entry) / installments : 0;
        
        handleFieldChange('payment', {
            ...q.payment,
            entry,
            installments,
            installmentValue,
            paymentTerms: data.paymentTerms,
            method: data.method,
            interestRate: data.interestRate,
            penaltyFee: data.penaltyFee
        });
        addToast('Condições de pagamento atualizadas.', 'success');
    };

    const statusStyle = STATUS_STYLE[q.status] ?? STATUS_STYLE.RASCUNHO;
    const pickerItem = pickerItemId ? q.items.find(i => i.id === pickerItemId) : undefined;

    const STATUS_OPTIONS: { value: QuotationStatus; label: string }[] = [
        { value: 'RASCUNHO', label: t('quotations.statusDraft') },
        { value: 'ENVIADO', label: t('quotations.statusSent') },
        { value: 'APROVADO', label: t('quotations.statusApproved') },
        { value: 'RECUSADO', label: t('quotations.statusRejected') },
    ];

    const formContent = (
        <div className="w-full px-6 py-6 space-y-5">
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/orcamentos')} className="ds-icon-button flex-shrink-0" title={t('common.back')}>
                        <ArrowLeft size={14} />
                    </button>
                    <h1 className="text-lg font-black uppercase tracking-tight" style={{ color: 'var(--ink-0)' }}>
                        {id ? t('quotations.editQuotation') : t('quotations.newQuotation')}
                    </h1>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <select
                        className="ds-select text-xs font-bold uppercase tracking-wide"
                        value={q.status}
                        onChange={e => handleFieldChange('status', e.target.value as QuotationStatus)}
                        style={{ color: statusStyle.color, background: statusStyle.bg, borderColor: statusStyle.border }}
                    >
                        {STATUS_OPTIONS.map(o => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>
                    <button onClick={() => navigate('/orcamentos')} className="ds-button">
                        {t('common.cancel')}
                    </button>
                    <button onClick={handleSave} className="ds-button-primary">
                        {t('quotations.saveQuotation')}
                    </button>
                </div>
            </div>

            {validationErrors.length > 0 && (
                <div
                    className="flex items-start gap-2 px-4 py-3 rounded-xl"
                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}
                >
                    <AlertCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                    <ul className="space-y-0.5">
                        {validationErrors.map((e, i) => (
                            <li key={i} className="text-sm text-red-600">{e}</li>
                        ))}
                    </ul>
                </div>
            )}

            <SectionCard title={t('quotations.serviceTitle')} icon={<ClipboardList size={14} />}>
                <div className="p-5 space-y-4">
                    <FieldGroup label={`${t('quotations.serviceTitle')} *`}>
                        <input
                            className="ds-input ds-input-lg w-full font-bold"
                            style={{ height: 'var(--h-control-lg)' }}
                            placeholder="Ex: Desenvolvimento de blends e temperos artesanais"
                            value={q.title}
                            onChange={e => handleFieldChange('title', e.target.value)}
                        />
                    </FieldGroup>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FieldGroup label={t('quotations.clientName')}>
                            <input
                                className="ds-input w-full"
                                placeholder="Nome do cliente"
                                value={q.clientName}
                                onChange={e => handleFieldChange('clientName', e.target.value)}
                            />
                        </FieldGroup>
                        <FieldGroup label={t('common.date')}>
                            <input
                                type="date"
                                className="ds-input w-full"
                                value={q.date}
                                onChange={e => handleFieldChange('date', e.target.value)}
                            />
                        </FieldGroup>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FieldGroup label={t('quotations.deliveryMethod')}>
                            <select
                                className="ds-select w-full"
                                value={q.deliveryMethod}
                                onChange={e => handleFieldChange('deliveryMethod', e.target.value as any)}
                            >
                                <option value="online">{t('quotations.deliveryOnline')}</option>
                                <option value="presencial">{t('quotations.deliveryPresencial')}</option>
                                <option value="outro">{t('quotations.deliveryOther')}</option>
                            </select>
                        </FieldGroup>
                        <FieldGroup label={t('quotations.deliveryFormat')}>
                            <input
                                className="ds-input w-full"
                                placeholder="Ex: Fórmulas em PDF com passo a passo"
                                value={q.deliveryFormat}
                                onChange={e => handleFieldChange('deliveryFormat', e.target.value)}
                            />
                        </FieldGroup>
                    </div>
                </div>
            </SectionCard>

            <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--surface-2)' }}>
                {[
                    { key: 'content', icon: <ClipboardList size={13} />, label: t('editor.composition') },
                    { key: 'style', icon: <Settings2 size={13} />, label: t('editor.appearance') },
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key as 'content' | 'style')}
                        className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all"
                        style={{
                            background: activeTab === tab.key ? 'var(--surface-2)' : 'transparent',
                            color: activeTab === tab.key ? 'var(--primary)' : 'var(--ink-2)',
                        }}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'content' && (
                <div className="space-y-5">
                    <SectionCard
                        title={t('quotations.linkedSheets')}
                        icon={<FlaskConical size={14} />}
                        hint={t('hints.quotationLink')}
                        actions={(
                            <button onClick={addItem} className="ds-button" style={{ color: 'var(--primary)' }}>
                                {t('common.add')}
                            </button>
                        )}
                    >
                        <div className="p-4 space-y-2">
                            {q.items.length === 0 ? (
                                <p className="text-center py-6 text-sm" style={{ color: 'var(--ink-2)' }}>
                                    {t('quotations.noSheetsLinked')}
                                </p>
                            ) : (
                                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
                                    <SortableContext items={q.items} strategy={verticalListSortingStrategy}>
                                        {q.items.map(item => (
                                            <SortableItemRow
                                                key={item.id}
                                                item={item}
                                                isNew={item.id === newlyAddedId}
                                                onUpdate={patch => updateItem(item.id, patch)}
                                                onRemove={() => removeItem(item.id)}
                                                onOpenPicker={() => setPickerItemId(item.id)}
                                                onUnlink={() => unlinkFormula(item.id)}
                                                t={t}
                                            />
                                        ))}
                                    </SortableContext>
                                </DndContext>
                            )}
                        </div>
                    </SectionCard>

                    <SectionCard 
                        title={t('quotations.payment')} 
                        icon={<DollarSign size={14} />}
                        actions={(
                            <div className="flex gap-2">
                                {paymentModels.length > 0 && (
                                    <select 
                                        className="ds-select text-xs py-1 px-2 h-7"
                                        onChange={(e) => {
                                            if (e.target.value) handleApplyModel(e.target.value);
                                            e.target.value = '';
                                        }}
                                    >
                                        <option value="">Carregar Modelo...</option>
                                        {paymentModels.map(m => (
                                            <option key={m.id} value={m.id}>{m.name}</option>
                                        ))}
                                    </select>
                                )}
                                <button type="button" className="ds-button text-xs py-1 px-2 h-7" onClick={() => setIsPaymentModalOpen(true)}>
                                    Configurar
                                </button>
                            </div>
                        )}
                    >
                        <div className="p-5 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FieldGroup label={`${t('quotations.totalValue')} (R$)`}>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        className="ds-input ds-input-lg w-full font-bold text-[var(--primary)]"
                                        placeholder="0,00"
                                        value={q.payment.total || ''}
                                        onChange={e => {
                                            const newTotal = parseFloat(e.target.value) || 0;
                                            const oldTotal = q.payment.total || 1;
                                            const ratio = newTotal / oldTotal;
                                            const entry = q.payment.entry * ratio;
                                            const installmentValue = q.payment.installments > 0 ? (newTotal - entry) / q.payment.installments : 0;

                                            handleFieldChange('payment', {
                                                ...q.payment,
                                                total: newTotal,
                                                entry,
                                                installmentValue
                                            });
                                        }}
                                    />
                                </FieldGroup>
                                <FieldGroup label={t('quotations.startDate')}>
                                    <input
                                        type="date"
                                        className="ds-input ds-input-lg w-full"
                                        style={{ height: 'var(--h-control-lg)' }}
                                        value={q.payment.startDate}
                                        onChange={e => handlePaymentChange('startDate', e.target.value)}
                                    />
                                </FieldGroup>
                            </div>

                            {q.payment.total > 0 && (
                                <div className="rounded-xl p-4 mt-2 border border-[var(--border)] bg-[var(--surface-0)] space-y-3">
                                    <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
                                        <div className="text-xs font-bold uppercase tracking-widest text-[var(--ink-2)]">Resumo da Condição</div>
                                        {q.payment.method && (
                                            <div className="text-[10px] font-bold uppercase tracking-widest bg-[var(--surface-2)] text-[var(--ink-1)] px-2 py-1 rounded-md">
                                                Método: {PAYMENT_METHOD_LABELS[q.payment.method] || q.payment.method}
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm pt-1">
                                        <div>
                                            <div className="text-[var(--ink-2)] text-xs mb-0.5">Sinal / Entrada</div>
                                            <div className="font-bold">R$ {q.payment.entry.toFixed(2).replace('.', ',')}</div>
                                        </div>
                                        <div>
                                            <div className="text-[var(--ink-2)] text-xs mb-0.5">Saldo Parcelado</div>
                                            <div className="font-bold">
                                                {q.payment.installments}x de R$ {q.payment.installmentValue.toFixed(2).replace('.', ',')}
                                            </div>
                                        </div>
                                    </div>
                                    {(!!q.payment.interestRate || !!q.payment.penaltyFee) && (
                                        <div className="text-xs text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-2 flex py-1.5 rounded items-center font-semibold">
                                            Acréscimos (Atraso): Juros {q.payment.interestRate || 0}% a.m. | Multa {q.payment.penaltyFee || 0}%
                                        </div>
                                    )}
                                    {q.payment.paymentTerms && (
                                        <div className="text-xs text-[var(--ink-1)] italic pt-1 border-t border-[var(--border)] mt-2">
                                            "{q.payment.paymentTerms}"
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </SectionCard>

                    <RichTextSection
                        title={t('quotations.notes')}
                        value={q.notes}
                        onChange={html => handleFieldChange('notes', html)}
                        placeholder={t('placeholders.quotationNotes')}
                        helperText={t('editor.optionalHint')}
                    />
                </div>
            )}

            {activeTab === 'style' && (
                <div className="space-y-5">
                    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--surface-0)' }}>
                        <div className="px-5 py-3.5" style={{ background: 'var(--surface-1)', borderBottom: '1px solid var(--border)' }}>
                            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--ink-1)' }}>
                                {t('editor.themes')}
                            </span>
                        </div>
                        <div className="p-5">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {FORMULA_THEMES.map(theme => (
                                    <button
                                        key={theme.color}
                                        onClick={() => handleFieldChange('accentColor', theme.color)}
                                        className="h-11 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all"
                                        style={{
                                            border: `2px solid ${q.accentColor === theme.color ? theme.color : 'var(--border)'}`,
                                            background: q.accentColor === theme.color ? `${theme.color}18` : 'var(--surface-1)',
                                            color: q.accentColor === theme.color ? theme.color : 'var(--ink-1)',
                                        }}
                                    >
                                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: theme.color }} />
                                        {t(theme.nameKey)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--surface-0)' }}>
                        <div className="px-5 py-3.5" style={{ background: 'var(--surface-1)', borderBottom: '1px solid var(--border)' }}>
                            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--ink-1)' }}>
                                {t('editor.typography')}
                            </span>
                        </div>
                        <div className="p-5">
                            <select
                                className="ds-select w-full text-sm"
                                value={q.fontFamily || SHEET_FONTS[0].value}
                                onChange={e => handleFieldChange('fontFamily', e.target.value)}
                            >
                                {SHEET_FONTS.map(f => (
                                    <option key={f.value} value={f.value}>{f.name}</option>
                                ))}
                            </select>
                    </div>
                    </div>

                    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--surface-0)' }}>
                        <div className="px-5 py-3.5" style={{ background: 'var(--surface-1)', borderBottom: '1px solid var(--border)' }}>
                            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--ink-1)' }}>
                                Assinaturas
                            </span>
                        </div>
                        <div className="p-5 flex flex-col gap-3">
                            <label className="flex items-center gap-2 cursor-pointer touch-none">
                                <input
                                    type="checkbox"
                                    checked={q.showProviderSignature !== false}
                                    onChange={(e) => handleFieldChange('showProviderSignature', e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    style={{ accentColor: 'var(--primary)' }}
                                />
                                <span className="text-sm font-medium" style={{ color: 'var(--ink-0)' }}>
                                    Incluir campo de assinatura do <strong>Prestador</strong>
                                </span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer touch-none">
                                <input
                                    type="checkbox"
                                    checked={q.showClientSignature !== false}
                                    onChange={(e) => handleFieldChange('showClientSignature', e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    style={{ accentColor: 'var(--primary)' }}
                                />
                                <span className="text-sm font-medium" style={{ color: 'var(--ink-0)' }}>
                                    Incluir campo de assinatura do <strong>Cliente</strong>
                                </span>
                            </label>
                        </div>
                    </div>
                </div>
            )}

            <div className="h-4" />
        </div>
    );

    return (
        <>
            <EditorShell
                preview={<QuotationPrintable quotation={q} mode="preview" />}
                mobilePreviewLabel={t('common.preview')}
            >
                {formContent}
            </EditorShell>

            <FormulaPickerDialog
                isOpen={pickerItemId !== null}
                onClose={() => setPickerItemId(null)}
                formulas={history}
                linkedFormulaId={pickerItem?.linkedFormulaId}
                onSelect={(fid, fname) => {
                    if (pickerItemId) linkFormula(pickerItemId, fid, fname);
                }}
                onUnlink={() => {
                    if (pickerItemId) unlinkFormula(pickerItemId);
                }}
            />

            <QuotationPaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                value={{
                    method: q.payment.method,
                    entryPercentage: q.payment.total > 0 ? (q.payment.entry / q.payment.total) * 100 : 50,
                    installments: q.payment.installments || 1,
                    interestRate: q.payment.interestRate || 0,
                    penaltyFee: q.payment.penaltyFee || 0,
                    paymentTerms: q.payment.paymentTerms
                }}
                onSave={handlePaymentConfigSave}
            />
        </>
    );
};
