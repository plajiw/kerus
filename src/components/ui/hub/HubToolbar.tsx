import React, { useState, useRef, useEffect } from 'react';
import { Star, Trash2, FileDown, FileText, FileJson, FileCode2, ChevronDown, X, CheckSquare } from 'lucide-react';

interface HubToolbarProps {
    // — Normal mode slots —
    primaryAction?: React.ReactNode;
    secondaryActions?: React.ReactNode;
    searchVariant?: React.ReactNode;
    filterViews?: React.ReactNode;
    viewToggle?: React.ReactNode;

    // — Favorites filter —
    showFavoritesOnly?: boolean;
    onToggleFavoritesOnly?: () => void;

    // — Selection mode —
    selectionCount?: number;
    onClearSelection?: () => void;
    /** Called when user confirms mass delete. Parent handles the actual deletion. */
    onDeleteSelected?: () => void;
    /** Called when user picks an export format. No logic yet — parent may show toast. */
    onExport?: (format: 'pdf' | 'json' | 'xml') => void;
}

// ─── Export dropdown ──────────────────────────────────────────
const EXPORT_OPTIONS = [
    { label: 'Exportar como PDF', format: 'pdf' as const, icon: <FileText size={14} />, color: '#ff7351' },
    { label: 'Exportar JSON',     format: 'json' as const, icon: <FileJson  size={14} />, color: '#0ea5e9' },
    { label: 'Exportar XML',      format: 'xml'  as const, icon: <FileCode2 size={14} />, color: '#10b981' },
];

const ExportDropdown: React.FC<{
    onExport: (format: 'pdf' | 'json' | 'xml') => void;
    alignRight?: boolean;
}> = ({ onExport, alignRight }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const h = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, [open]);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(p => !p)}
                className="ds-button flex items-center gap-1.5 text-xs"
                style={{ height: 'var(--h-control)' }}
                title="Exportar selecionados"
            >
                Exportar
                <ChevronDown size={11} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div
                    className={`absolute z-50 mt-1.5 w-52 rounded-xl overflow-hidden py-1 ${
                        alignRight ? 'right-0' : 'left-0'
                    }`}
                    style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
                >
                    {EXPORT_OPTIONS.map(opt => (
                        <button
                            key={opt.format}
                            onClick={() => { onExport(opt.format); setOpen(false); }}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-left transition-colors hover:bg-[var(--surface-3)]"
                            style={{ color: 'var(--ink-0)' }}
                        >
                            <span style={{ color: opt.color }}>{opt.icon}</span>
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── Mobile actions dropdown ──────────────────────────────────
const MobileActionsDropdown: React.FC<{
    selectionCount: number;
    onDeleteSelected: () => void;
    onExport: (format: 'pdf' | 'json' | 'xml') => void;
}> = ({ selectionCount, onDeleteSelected, onExport }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const h = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, [open]);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(p => !p)}
                className="ds-button flex items-center gap-1.5 text-xs"
                style={{ height: 'var(--h-control)' }}
            >
                Ações
                <ChevronDown size={11} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div
                    className="absolute right-0 mt-1.5 w-56 rounded-xl z-50 overflow-hidden py-1"
                    style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
                >
                    <button
                        onClick={() => { onDeleteSelected(); setOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-bold text-left transition-colors hover:bg-[var(--surface-3)]"
                        style={{ color: 'var(--error, #ff7351)' }}
                    >
                        <Trash2 size={14} />
                        Excluir {selectionCount} selecionados
                    </button>

                    <div className="my-1" style={{ borderTop: '1px solid var(--border)' }} />

                    {EXPORT_OPTIONS.map(opt => (
                        <button
                            key={opt.format}
                            onClick={() => { onExport(opt.format); setOpen(false); }}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-left transition-colors hover:bg-[var(--surface-3)]"
                            style={{ color: 'var(--ink-0)' }}
                        >
                            <span style={{ color: 'var(--ink-2)' }}>{opt.icon}</span>
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── Main Toolbar ─────────────────────────────────────────────
export const HubToolbar: React.FC<HubToolbarProps> = ({
    primaryAction,
    secondaryActions,
    searchVariant,
    filterViews,
    viewToggle,
    showFavoritesOnly = false,
    onToggleFavoritesOnly,
    selectionCount = 0,
    onClearSelection,
    onDeleteSelected,
    onExport,
}) => {
    const isSelectionMode = selectionCount > 0;

    const handleExport = onExport ?? (() => {});
    const handleDelete = onDeleteSelected ?? (() => {});

    return (
        <div
            className="mb-8 p-4 rounded-2xl transition-all duration-200 w-full"
            style={{ background: 'var(--surface-2)' }}
        >
            {isSelectionMode ? (
                /* ── Selection mode ──────────────────────────────── */
                <div className="flex items-center justify-between gap-3" style={{ minHeight: 'var(--h-control)' }}>
                    {/* Left: actions first, then counter */}
                    <div className="flex items-center gap-3 min-w-0">
                        {/* Desktop: inline action buttons */}
                        {onDeleteSelected && (
                            <button
                                onClick={handleDelete}
                                className="ds-button hidden sm:inline-flex text-xs font-bold"
                                style={{ color: 'var(--error, #ff7351)', borderColor: 'var(--error, #ff7351)', height: 'var(--h-control)' }}
                            >
                                Excluir {selectionCount}
                            </button>
                        )}

                        {onExport && (
                            <div className="hidden sm:block">
                                <ExportDropdown onExport={handleExport} />
                            </div>
                        )}

                        {/* Counter badge — after actions */}
                        <span className="flex items-center gap-2 text-sm font-bold flex-shrink-0" style={{ color: 'var(--ink-0)' }}>
                            <CheckSquare size={16} style={{ color: 'var(--primary)' }} />
                            <span>{selectionCount} {selectionCount === 1 ? 'selecionado' : 'selecionados'}</span>
                        </span>
                    </div>

                    {/* Right: mobile Ações dropdown + cancel */}
                    <div className="flex items-center gap-2">
                        {/* Mobile: single dropdown */}
                        <div className="sm:hidden">
                            <MobileActionsDropdown
                                selectionCount={selectionCount}
                                onDeleteSelected={handleDelete}
                                onExport={handleExport}
                            />
                        </div>

                        {/* Cancel — text only per DS rule */}
                        {onClearSelection && (
                            <button
                                onClick={onClearSelection}
                                className="ds-button text-xs"
                                style={{ height: 'var(--h-control)' }}
                                title="Cancelar seleção"
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                /* ── Normal mode ─────────────────────────────────── */
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4" style={{ minHeight: 'var(--h-control)' }}>
                    {/* Left: primary + secondary actions */}
                    <div className="flex flex-wrap items-center gap-3">
                        {primaryAction}
                        {secondaryActions}
                    </div>

                    {/* Right: search + filters + favorites + view toggle */}
                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                        <div className="flex-1 lg:flex-none">
                            {searchVariant}
                        </div>

                        {filterViews && (
                            <div className="flex items-center gap-2 flex-wrap">
                                {filterViews}
                            </div>
                        )}

                        {/* Favorites toggle */}
                        {onToggleFavoritesOnly && (
                            <button
                                onClick={onToggleFavoritesOnly}
                                className="ds-icon-button flex-shrink-0"
                                title={showFavoritesOnly ? 'Mostrar todos' : 'Mostrar apenas favoritos'}
                                style={{ color: showFavoritesOnly ? '#ffe393' : 'var(--ink-2)' }}
                            >
                                <Star
                                    size={16}
                                    strokeWidth={2}
                                    fill={showFavoritesOnly ? '#ffe393' : 'none'}
                                />
                            </button>
                        )}

                        {/* View toggle — hidden on mobile */}
                        {viewToggle && (
                            <div className="hidden sm:block">
                                {viewToggle}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
