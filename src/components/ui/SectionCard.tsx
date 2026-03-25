import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { HintButton } from './HintButton';

interface SectionCardProps {
    title: string;
    icon?: React.ReactNode;
    hint?: string;
    badge?: React.ReactNode;
    actions?: React.ReactNode;
    children: React.ReactNode;
    collapsible?: boolean;
    defaultOpen?: boolean;
    className?: string;
}

export const SectionCard: React.FC<SectionCardProps> = ({
    title, icon, hint, badge, actions, children,
    collapsible = false, defaultOpen = true, className = '',
}) => {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div
            className={`rounded-2xl overflow-hidden ${className}`}
            style={{ border: '1px solid var(--border)', background: 'var(--surface-0)' }}
        >
            {/* Header */}
            <div
                className={`flex items-center justify-between px-5 py-3.5 ${collapsible ? 'cursor-pointer select-none' : ''}`}
                style={{ background: 'var(--surface-1)', borderBottom: open ? '1px solid var(--border)' : 'none' }}
                onClick={collapsible ? () => setOpen(p => !p) : undefined}
            >
                <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                    {icon && (
                        <span style={{ color: 'var(--primary)' }} className="flex-shrink-0">
                            {icon}
                        </span>
                    )}
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--ink-1)' }}>
                        {title}
                    </span>
                    {hint && <HintButton hint={hint} title={title} />}
                    {badge}
                </div>
                <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                    {actions}
                    {collapsible && (
                        <button
                            onClick={e => { e.stopPropagation(); setOpen(p => !p); }}
                            className="w-6 h-6 flex items-center justify-center rounded-md transition-colors hover:bg-[var(--surface-2)]"
                            style={{ color: 'var(--ink-2)' }}
                        >
                            {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                    )}
                </div>
            </div>

            {/* Body */}
            {open && <div>{children}</div>}
        </div>
    );
};
