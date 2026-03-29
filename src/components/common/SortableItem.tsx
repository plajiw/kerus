import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface SortableItemProps {
    id: string;
    children: React.ReactNode;
    newlyAddedId: string | null;
    animationsEnabled?: boolean;
    /** Vertical alignment of inner items. 'center' (default) for single-line rows, 'start' for multi-line */
    align?: 'center' | 'start';
}

export const SortableItem: React.FC<SortableItemProps> = ({ id, children, newlyAddedId, align = 'center' }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const isNew = id === newlyAddedId;

    return (
        <div
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition: isDragging ? 'none' : transition,
                zIndex: isDragging ? 10 : 1,
                opacity: isDragging ? 0.8 : 1,
            }}
        >
            <div
                className={`flex gap-2 px-3 py-2.5 rounded-xl transition-colors ${align === 'start' ? 'items-start' : 'items-center'}`}
                style={{
                    background: 'var(--surface-3)',
                    border: isNew ? '2px solid var(--primary)' : '1px solid var(--border)',
                }}
            >
                <div
                    {...attributes}
                    {...listeners}
                    className={`flex-shrink-0 cursor-grab touch-none transition-opacity opacity-30 hover:opacity-70 ${align === 'start' ? 'mt-1' : ''}`}
                    style={{ color: 'var(--ink-2)' }}
                    title="Arrastar para reorganizar"
                >
                    <GripVertical size={15} />
                </div>
                {children}
            </div>
        </div>
    );
};
