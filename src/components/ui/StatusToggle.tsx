import React from 'react';

type StatusConfig<T extends string> = {
    value: T;
    label: string;
    color: string;       // bg color
    textColor: string;   // text color
    next: T;
};

interface StatusToggleProps<T extends string> {
    value: T;
    configs: StatusConfig<T>[];
    onChange: (next: T) => void;
    readOnly?: boolean;
    size?: 'sm' | 'md';
}

export function StatusToggle<T extends string>({
    value, configs, onChange, readOnly = false, size = 'md',
}: StatusToggleProps<T>) {
    const current = configs.find(c => c.value === value) ?? configs[0];

    const handleClick = () => {
        if (readOnly) return;
        onChange(current.next);
    };

    const px = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs';

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={readOnly}
            className={`inline-flex items-center rounded-full font-bold uppercase tracking-widest transition-all duration-150 ${px} ${readOnly ? 'cursor-default' : 'cursor-pointer hover:brightness-110'}`}
            style={{ background: current.color, color: current.textColor }}
            title={readOnly ? undefined : `Clique para: ${configs.find(c => c.value === current.next)?.label}`}
        >
            {current.label}
        </button>
    );
}

// ─── Preset config: Formula status ────────────────────────────
export const FORMULA_STATUS_CONFIGS = (labels: { draft: string; final: string }) => [
    {
        value: 'RASCUNHO' as const,
        label: labels.draft,
        color: 'var(--status-warning-bg)',
        textColor: 'var(--status-warning-text)',
        next: 'FINAL' as const,
    },
    {
        value: 'FINAL' as const,
        label: labels.final,
        color: 'var(--status-success-bg)',
        textColor: 'var(--status-success-text)',
        next: 'RASCUNHO' as const,
    },
];

// ─── Preset config: Quotation status ──────────────────────────
export const QUOTATION_STATUS_CONFIGS = (labels: {
    draft: string; sent: string; approved: string; rejected: string;
}) => [
    {
        value: 'RASCUNHO' as const,
        label: labels.draft,
        color: 'var(--status-warning-bg)',
        textColor: 'var(--status-warning-text)',
        next: 'ENVIADO' as const,
    },
    {
        value: 'ENVIADO' as const,
        label: labels.sent,
        color: 'var(--status-info-bg)',
        textColor: 'var(--status-info-text)',
        next: 'APROVADO' as const,
    },
    {
        value: 'APROVADO' as const,
        label: labels.approved,
        color: 'var(--status-success-bg)',
        textColor: 'var(--status-success-text)',
        next: 'RECUSADO' as const,
    },
    {
        value: 'RECUSADO' as const,
        label: labels.rejected,
        color: 'var(--status-error-bg)',
        textColor: 'var(--status-error-text)',
        next: 'RASCUNHO' as const,
    },
];
