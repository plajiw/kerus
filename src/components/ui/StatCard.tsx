import React from 'react';

export type StatCardVariant = 'primary' | 'success' | 'warning' | 'info' | 'neutral' | 'error';

export const ICON_STYLES: Record<StatCardVariant, React.CSSProperties> = {
    primary: { background: 'var(--primary)',            color: '#fff'                        },
    success: { background: 'var(--status-success-bg)',  color: 'var(--status-success-text)'  },
    warning: { background: 'var(--status-warning-bg)',  color: 'var(--status-warning-text)'  },
    info:    { background: 'var(--status-info-bg)',     color: 'var(--status-info-text)'     },
    neutral: { background: 'var(--status-neutral-bg)',  color: 'var(--status-neutral-text)'  },
    error:   { background: 'var(--status-error-bg)',    color: 'var(--status-error-text)'    },
};

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: React.ReactNode;
    /** Semantic color for the icon container. Defaults to 'primary'. */
    variant?: StatCardVariant;
    trend?: {
        value: string;
        positive?: boolean;
    };
    /** Label shown at the bottom of the card to indicate the active date range */
    dateRangeLabel?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, variant = 'primary', trend, dateRangeLabel }) => (
    <div
        className="p-6 rounded-2xl flex flex-col gap-4 transition-transform duration-200 hover:-translate-y-0.5 cursor-default"
        style={{ background: 'var(--surface-2)' }}
    >
        {/* Top row: icon + optional trend */}
        <div className="flex items-start justify-between">
            <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={ICON_STYLES[variant]}
            >
                {icon}
            </div>
            {trend && (
                <span
                    className="text-[10px] font-bold px-2 py-1 rounded-lg"
                    style={{
                        background: trend.positive ? 'var(--status-success-bg)' : 'var(--status-error-bg)',
                        color: trend.positive ? 'var(--status-success-text)' : 'var(--status-error-text)',
                    }}
                >
                    {trend.positive ? '↑' : '↓'} {trend.value}
                </span>
            )}
        </div>

        {/* Bottom: label + value */}
        <div>
            <p
                className="text-[10px] font-bold uppercase tracking-widest mb-1.5"
                style={{ color: 'var(--ink-2)' }}
            >
                {title}
            </p>
            <div
                className="text-3xl font-black tracking-tight leading-none font-display"
                style={{ color: 'var(--ink-0)' }}
            >
                {value}
            </div>
            {subtitle && (
                <p className="text-xs mt-1.5" style={{ color: 'var(--ink-2)' }}>
                    {subtitle}
                </p>
            )}
        </div>

        {/* Date range indicator */}
        {dateRangeLabel && (
            <div
                className="flex items-center gap-1.5 pt-3 mt-auto"
                style={{ borderTop: '1px solid var(--border)' }}
            >
                <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--ink-2)' }}>
                    {dateRangeLabel}
                </span>
            </div>
        )}
    </div>
);
