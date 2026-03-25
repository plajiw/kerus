import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Calendar } from 'lucide-react';

export type DateRange = 'all' | '1d' | '7d' | '30d' | '6m' | '1y';

export const DATE_RANGE_OPTIONS: { value: DateRange; label: string }[] = [
    { value: 'all', label: 'Todo o período' },
    { value: '1d', label: 'Último dia' },
    { value: '7d', label: 'Últimos 7 dias' },
    { value: '30d', label: 'Últimos 30 dias' },
    { value: '6m', label: 'Últimos 6 meses' },
    { value: '1y', label: 'Último ano' },
];

export function isWithinDateRange(dateStr: string, range: DateRange): boolean {
    if (range === 'all') return true;
    const ms: Record<string, number> = {
        '1d': 86_400_000,
        '7d': 7 * 86_400_000,
        '30d': 30 * 86_400_000,
        '6m': 180 * 86_400_000,
        '1y': 365 * 86_400_000,
    };
    return (Date.now() - new Date(dateStr).getTime()) <= ms[range];
}

interface HubDateFilterProps {
    value: DateRange;
    onChange: (v: DateRange) => void;
}

export const HubDateFilter: React.FC<HubDateFilterProps> = ({ value, onChange }) => {
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

    const current = DATE_RANGE_OPTIONS.find(o => o.value === value) ?? DATE_RANGE_OPTIONS[0];
    const isFiltered = value !== 'all';

    return (
        <div ref={ref} className="relative flex-shrink-0">
            <button
                onClick={() => setOpen(p => !p)}
                className="flex items-center gap-1.5 h-[var(--h-control)] px-3 rounded-xl text-xs font-semibold transition-all"
                style={{
                    background: isFiltered ? 'rgba(var(--primary-rgb), 0.1)' : 'var(--surface-3)',
                    color: isFiltered ? 'var(--primary)' : 'var(--ink-1)',
                    border: isFiltered
                        ? '1px solid rgba(var(--primary-rgb), 0.3)'
                        : '1px solid var(--border)',
                }}
            >
                <Calendar size={12} />
                <span>{current.label}</span>
                <ChevronDown
                    size={11}
                    className={`transition-transform ${open ? 'rotate-180' : ''}`}
                    style={{ color: 'var(--ink-2)' }}
                />
            </button>
            {open && (
                <div
                    className="absolute top-full right-0 mt-1.5 w-44 rounded-xl py-1 z-50"
                    style={{
                        background: 'var(--surface-2)',
                        boxShadow: 'var(--shadow-ambient)',
                        border: '1px solid var(--border)',
                    }}
                >
                    {DATE_RANGE_OPTIONS.map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => { onChange(opt.value); setOpen(false); }}
                            className="w-full text-left px-4 py-2 text-sm font-medium transition-colors"
                            style={{
                                color: value === opt.value ? 'var(--primary)' : 'var(--ink-1)',
                                background: value === opt.value
                                    ? 'rgba(var(--primary-rgb), 0.08)'
                                    : 'transparent',
                            }}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
