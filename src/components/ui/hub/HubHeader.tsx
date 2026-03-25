import React from 'react';

interface HubHeaderProps {
    title: string;
    subtitle: React.ReactNode;
}

export const HubHeader: React.FC<HubHeaderProps> = ({ title, subtitle }) => (
    <div className="mb-10">
        <h1
            className="text-4xl font-extrabold uppercase tracking-tight leading-none font-display"
            style={{ color: 'var(--ink-0)' }}
        >
            {title}
        </h1>
        <p className="text-sm font-medium mt-2" style={{ color: 'var(--ink-2)' }}>
            {subtitle}
        </p>
    </div>
);
