import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';

interface FilterOption<T extends string> {
    value: T;
    label: string;
}

interface HubStatusFilterProps<T extends string> {
    options: FilterOption<T>[];
    value: T;
    onChange: (v: T) => void;
}

export function HubStatusFilter<T extends string>({
    options,
    value,
    onChange,
}: HubStatusFilterProps<T>) {
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

    const current = options.find(o => o.value === value) ?? options[0];
    const isFiltered = value !== options[0]?.value;

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
                <SlidersHorizontal size={12} />
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
                        border: '1px solid var(--border)',
                    }}
                >
                    {options.map(opt => (
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
}
