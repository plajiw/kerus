import React from 'react';

// ─── Base shimmer block ────────────────────────────────────────
interface SkeletonProps {
    width?: string | number;
    height?: string | number;
    className?: string;
    rounded?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    width = '100%',
    height = 16,
    className = '',
    rounded = false,
}) => (
    <div
        className={`skeleton ${className}`}
        style={{
            width,
            height,
            borderRadius: rounded ? '9999px' : undefined,
            flexShrink: 0,
        }}
    />
);

// ─── Multi-line text skeleton ──────────────────────────────────
interface SkeletonTextProps {
    lines?: number;
    className?: string;
    /** Last line width (e.g. "60%") to look more natural */
    lastLineWidth?: string;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({
    lines = 3,
    className = '',
    lastLineWidth = '65%',
}) => (
    <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
            <Skeleton
                key={i}
                height={12}
                width={i === lines - 1 ? lastLineWidth : '100%'}
            />
        ))}
    </div>
);

// ─── Card skeleton ─────────────────────────────────────────────
interface SkeletonCardProps {
    className?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ className = '' }) => (
    <div
        className={`rounded-2xl p-5 space-y-4 ${className}`}
        style={{ border: '1px solid var(--border)', background: 'var(--surface-0)' }}
    >
        {/* Header row */}
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Skeleton width={28} height={28} rounded />
                <Skeleton width={120} height={14} />
            </div>
            <Skeleton width={64} height={14} />
        </div>
        {/* Body lines */}
        <SkeletonText lines={2} lastLineWidth="75%" />
        {/* Footer */}
        <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid var(--border)' }}>
            <Skeleton width={56} height={22} rounded />
            <div className="flex gap-1">
                <Skeleton width={28} height={28} rounded />
                <Skeleton width={28} height={28} rounded />
            </div>
        </div>
    </div>
);

// ─── Row skeleton (for list items) ────────────────────────────
export const SkeletonRow: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${className}`}
        style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}
    >
        <Skeleton width={15} height={20} />
        <Skeleton className="flex-1" height={14} />
        <Skeleton width={64} height={14} />
        <Skeleton width={28} height={28} rounded />
    </div>
);
