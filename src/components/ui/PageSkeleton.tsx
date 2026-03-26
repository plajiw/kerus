import React from 'react';
import { Skeleton, SkeletonCard, SkeletonRow } from './Skeleton';

/**
 * Full-page content skeleton — used as the Suspense fallback while a lazy
 * page chunk is downloading. Mimics the visual weight of the real page so
 * there is no jarring layout shift.
 */
export const PageSkeleton: React.FC = () => (
    <div className="p-6 lg:p-8 space-y-6 animate-in fade-in duration-200">

        {/* Header row */}
        <div className="flex items-center justify-between">
            <div className="space-y-2">
                <Skeleton width={160} height={22} />
                <Skeleton width={80} height={11} />
            </div>
            <div className="flex gap-2">
                <Skeleton width={80} height={36} />
                <Skeleton width={100} height={36} />
            </div>
        </div>

        {/* Toolbar row */}
        <div className="flex gap-2">
            <Skeleton width={96} height={36} />
            <Skeleton width={96} height={36} />
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    </div>
);

/**
 * Editor-specific skeleton — shown while the editor page chunk loads.
 * Mimics the split-pane layout.
 */
export const EditorSkeleton: React.FC = () => (
    <div className="flex" style={{ height: 'calc(100vh - 3.5rem)' }}>

        {/* Left form pane */}
        <div className="flex-1 overflow-hidden p-6 space-y-5" style={{ borderRight: '1px solid var(--border)' }}>

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Skeleton width={36} height={36} rounded />
                    <Skeleton width={140} height={18} />
                </div>
                <div className="flex gap-2">
                    <Skeleton width={80} height={36} />
                    <Skeleton width={80} height={36} />
                    <Skeleton width={100} height={36} />
                </div>
            </div>

            {/* Metadata card */}
            <div className="rounded-2xl p-5 space-y-4" style={{ border: '1px solid var(--border)' }}>
                <Skeleton width="50%" height={40} />
                <div className="grid grid-cols-2 gap-4">
                    <Skeleton height={36} />
                    <Skeleton height={36} />
                </div>
            </div>

            {/* Tab switcher */}
            <Skeleton height={44} />

            {/* Rows */}
            <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonRow key={i} />
                ))}
            </div>
        </div>

        {/* Right preview pane */}
        <div
            className="hidden lg:flex flex-col flex-shrink-0"
            style={{ width: '45%', background: 'var(--surface-2)' }}
        >
            <div className="p-4 flex justify-center">
                <div className="rounded-xl w-full max-w-[210mm] space-y-4" style={{ background: 'var(--surface-0)', padding: 32, border: '1px solid var(--border)' }}>
                    <Skeleton width="70%" height={24} />
                    <Skeleton width="45%" height={12} />
                    <div style={{ marginTop: 24 }}>
                        <Skeleton height={12} className="mb-2" />
                        <Skeleton height={12} className="mb-2" />
                        <Skeleton width="60%" height={12} />
                    </div>
                </div>
            </div>
        </div>
    </div>
);
