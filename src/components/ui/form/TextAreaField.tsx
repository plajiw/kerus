import React from 'react';

interface TextAreaFieldProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
    hint?: React.ReactNode;
    disabled?: boolean;
    maxLength?: number;
    rows?: number;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
    label,
    value,
    onChange,
    placeholder,
    error,
    hint,
    disabled = false,
    maxLength = 500,
    rows = 4,
}) => {
    const charCount = value.length;
    const isNearLimit = maxLength > 0 && (charCount / maxLength) > 0.8;

    return (
        <div className="flex flex-col gap-1 w-full">
            {label && (
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--ink-2)' }}>
                    {label}
                    {hint}
                </label>
            )}
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                maxLength={maxLength > 0 ? maxLength : undefined}
                rows={rows}
                placeholder={placeholder}
                disabled={disabled}
                className={`ds-textarea w-full p-3 resize-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${error ? 'border border-[var(--status-error-text)]' : ''}`}
            />
            <div className="flex items-center justify-between gap-2 text-xs">
                {error && (
                    <p style={{ color: 'var(--status-error-text)' }}>⚠️ {error}</p>
                )}
                {maxLength > 0 && (
                    <p className="ml-auto" style={{ color: isNearLimit ? 'var(--status-warning-text)' : 'var(--ink-2)' }}>
                        {charCount} / {maxLength}
                    </p>
                )}
            </div>
        </div>
    );
};
