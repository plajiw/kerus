import React from 'react';
import { LayoutGrid, List } from 'lucide-react';

export type ViewMode = 'grid' | 'table';

interface HubViewToggleProps {
    view: ViewMode;
    onChange: (v: ViewMode) => void;
}

export const HubViewToggle: React.FC<HubViewToggleProps> = ({ view, onChange }) => (
    <div
        className="flex items-center rounded-xl flex-shrink-0 p-1"
        style={{ background: 'var(--surface-3)', height: 'var(--h-control)' }}
    >
        <button
            onClick={() => onChange('grid')}
            title="Visualização em grid"
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
            style={view === 'grid'
                ? { background: 'var(--primary)', color: '#180800' }
                : { color: 'var(--ink-2)' }
            }
        >
            <LayoutGrid size={13} />
        </button>
        <button
            onClick={() => onChange('table')}
            title="Visualização em tabela"
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
            style={view === 'table'
                ? { background: 'var(--primary)', color: '#180800' }
                : { color: 'var(--ink-2)' }
            }
        >
            <List size={13} />
        </button>
    </div>
);
