import React from 'react';

interface HubStatsGridProps {
    children: React.ReactNode;
    /** Optional element rendered in the top-right of the stats section header (e.g. a date filter) */
    headerRight?: React.ReactNode;
}

export const HubStatsGrid: React.FC<HubStatsGridProps> = ({ children, headerRight }) => {
    return (
        <div className="mb-8">
            {headerRight && (
                <div className="flex justify-end mb-3">
                    {headerRight}
                </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {children}
            </div>
        </div>
    );
};
