import React from 'react';
import { SectionCard } from '../ui/SectionCard';
import { RichTextEditor } from '../ui/RichTextEditor';

interface RichTextSectionProps {
    title: string;
    value: string;
    onChange: (html: string) => void;
    placeholder: string;
    helperText?: string;
    actions?: React.ReactNode;
    collapsible?: boolean;
    defaultOpen?: boolean;
    hint?: string;
    minRows?: number;
}

export const RichTextSection: React.FC<RichTextSectionProps> = ({
    title,
    value,
    onChange,
    placeholder,
    helperText,
    actions,
    collapsible = false,
    defaultOpen = true,
    hint,
    minRows = 5,
}) => (
    <SectionCard
        title={title}
        hint={hint}
        actions={actions}
        collapsible={collapsible}
        defaultOpen={defaultOpen}
    >
        <div className="p-5 space-y-2">
            <RichTextEditor
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                minRows={minRows}
            />
            {helperText && (
                <p className="text-[10px] italic" style={{ color: 'var(--ink-2)' }}>
                    {helperText}
                </p>
            )}
        </div>
    </SectionCard>
);
