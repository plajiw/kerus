import React, { useState, useEffect, useRef } from 'react';
import { X, Search, FlaskConical } from 'lucide-react';
import { Recipe } from '../../types';
import { useI18n } from '../../i18n/i18n.tsx';

interface FormulaPickerDialogProps {
    isOpen: boolean;
    onClose: () => void;
    /** All available formulas to pick from */
    formulas: Recipe[];
    /** Currently linked formula id (if any) */
    linkedFormulaId?: string;
    /** Called when user selects a formula */
    onSelect: (formulaId: string, formulaName: string) => void;
    /** Called when user clears the link */
    onUnlink?: () => void;
}

export const FormulaPickerDialog: React.FC<FormulaPickerDialogProps> = ({
    isOpen,
    onClose,
    formulas,
    linkedFormulaId,
    onSelect,
    onUnlink,
}) => {
    const { t } = useI18n();
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    // Reset query and focus input when opened
    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const q = query.trim().toLowerCase();
    const filtered = formulas.filter(f =>
        !q || f.nome_formula.toLowerCase().includes(q)
    );

    const statusLabel = (s?: string) => s === 'FINAL' ? t('status.final') : t('status.draft');
    const statusColor = (s?: string) => s === 'FINAL'
        ? { bg: 'rgba(16,185,129,0.12)', color: '#047857' }
        : { bg: 'rgba(245,158,11,0.12)', color: '#b45309' };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-[300] bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Dialog */}
            <div
                className="fixed z-[310] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl flex flex-col"
                style={{
                    background: 'var(--surface-0)',
                    width: 'min(520px, calc(100vw - 2rem))',
                    maxHeight: 'min(560px, calc(100vh - 4rem))',
                }}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between px-5 py-4 flex-shrink-0"
                    style={{ borderBottom: '1px solid var(--border)' }}
                >
                    <div className="flex items-center gap-2">
                        <FlaskConical size={16} style={{ color: 'var(--primary)' }} />
                        <span className="font-bold text-sm" style={{ color: 'var(--ink-0)' }}>
                            {t('quotations.pickFormula')}
                        </span>
                    </div>
                    <button onClick={onClose} className="ds-icon-button">
                        <X size={14} />
                    </button>
                </div>

                {/* Search */}
                <div className="px-5 py-3 flex-shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
                    <div className="relative">
                        <Search
                            size={14}
                            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                            style={{ color: 'var(--ink-2)' }}
                        />
                        <input
                            ref={inputRef}
                            className="ds-input w-full pl-9 text-sm"
                            placeholder={t('quotations.searchFormula')}
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-1">
                    {filtered.length === 0 && (
                        <p className="text-center py-8 text-sm" style={{ color: 'var(--ink-2)' }}>
                            {t('quotations.noFormulasFound')}
                        </p>
                    )}
                    {filtered.map(f => {
                        const isLinked = f.id === linkedFormulaId;
                        const sc = statusColor(f.status);
                        return (
                            <button
                                key={f.id}
                                onClick={() => { onSelect(f.id, f.nome_formula); onClose(); }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors"
                                style={{
                                    background: isLinked ? 'rgba(var(--primary-rgb, 0,0,0),0.06)' : 'transparent',
                                    border: `1px solid ${isLinked ? 'var(--primary)' : 'transparent'}`,
                                }}
                                onMouseEnter={e => {
                                    if (!isLinked) (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-1)';
                                }}
                                onMouseLeave={e => {
                                    if (!isLinked) (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                                }}
                            >
                                <FlaskConical size={14} className="flex-shrink-0" style={{ color: 'var(--primary)' }} />
                                <span className="flex-1 text-sm font-medium truncate" style={{ color: 'var(--ink-0)' }}>
                                    {f.nome_formula}
                                </span>
                                <span
                                    className="flex-shrink-0 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                                    style={{ background: sc.bg, color: sc.color }}
                                >
                                    {statusLabel(f.status)}
                                </span>
                                <span className="flex-shrink-0 text-xs" style={{ color: 'var(--ink-2)' }}>
                                    {f.data}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Footer: unlink option */}
                {linkedFormulaId && onUnlink && (
                    <div
                        className="flex-shrink-0 px-5 py-3"
                        style={{ borderTop: '1px solid var(--border)' }}
                    >
                        <button
                            onClick={() => { onUnlink(); onClose(); }}
                            className="ds-button w-full"
                            style={{ color: 'var(--ink-2)' }}
                        >
                            {t('quotations.unlinkFormula')}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};
