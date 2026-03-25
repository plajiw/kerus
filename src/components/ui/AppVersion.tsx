import React from 'react';
import { APP_CONFIG } from '../../constants/appConfig';

interface AppVersionProps {
    /** Additional tailwind classes (opacity, margin, etc.) */
    className?: string;
}

/**
 * Reusable component to display the current application version.
 * Centralizes the source of truth from constants/appConfig.ts.
 */
export const AppVersion: React.FC<AppVersionProps> = ({ className = '' }) => {
    return (
        <span 
            className={`text-[8px] font-mono uppercase tracking-[0.15em] select-none ${className}`}
            style={{ color: 'var(--ink-2)' }}
        >
            {APP_CONFIG.VERSION}
        </span>
    );
};
