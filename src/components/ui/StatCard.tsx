import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: React.ReactNode;
    trend?: {
        value: string;
        positive?: boolean;
    };
    /** Label shown at the bottom of the card to indicate the active date range */
    dateRangeLabel?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, trend, dateRangeLabel }) => (
    <div
        className="p-6 rounded-2xl flex flex-col gap-4 transition-transform duration-200 hover:-translate-y-0.5 cursor-default"
        style={{ background: 'var(--surface-card-gradient)' }}
    >
        {/* Top row: icon + optional trend */}
        <div className="flex items-start justify-between">
            <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--primary)', color: '#ffffff' }}
            >
                {icon}
            </div>
            {trend && (
                <span
                    className="text-[10px] font-bold px-2 py-1 rounded-lg"
                    style={{
                        background: trend.positive ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                        color: trend.positive ? '#34d399' : '#f87171',
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
