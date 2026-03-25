import React from 'react';

interface HubToolbarProps {
    primaryAction?: React.ReactNode;
    secondaryActions?: React.ReactNode;
    searchVariant?: React.ReactNode;
    filterViews?: React.ReactNode;
    viewToggle?: React.ReactNode;
}

export const HubToolbar: React.FC<HubToolbarProps> = ({
    primaryAction,
    secondaryActions,
    searchVariant,
    filterViews,
    viewToggle,
}) => (
    <div
        className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 mb-8 w-full"
        style={{
            background: 'var(--surface-2)',
        boxShadow: 'var(--shadow-1)',
            borderRadius: '16px',
        }}
    >
        {/* Left: primary + secondary actions */}
        <div className="flex flex-wrap items-center gap-3">
            {primaryAction}
            {secondaryActions}
        </div>

        {/* Right: search + filters + view toggle */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="flex-1 lg:flex-none">
                {searchVariant}
            </div>
            {filterViews && (
                <div className="flex items-center gap-2 flex-wrap">
                    {filterViews}
                </div>
            )}
            {viewToggle}
        </div>
    </div>
);
