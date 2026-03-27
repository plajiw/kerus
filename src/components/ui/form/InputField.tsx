import React from 'react';

interface InputFieldProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
    hint?: React.ReactNode;
    icon?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    disabled?: boolean;
    type?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
    label,
    value,
    onChange,
    placeholder,
    error,
    hint,
    icon,
    size = 'md',
    fullWidth = true,
    disabled = false,
    type = 'text',
}) => {
    const sizeClass = size === 'sm' ? 'h-8 text-xs px-2' : size === 'lg' ? 'ds-input-lg' : '';

    return (
        <div className={`flex flex-col gap-1 ${fullWidth ? 'w-full' : ''}`}>
            {label && (
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--ink-2)' }}>
                    {label}
                    {hint}
                </label>
            )}
            <div className="relative flex items-center">
                {icon && (
                    <span className="absolute left-3 pointer-events-none" style={{ color: 'var(--ink-2)' }}>
                        {icon}
                    </span>
                )}
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`ds-input w-full ${sizeClass} ${icon ? 'pl-9' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
            </div>
            {error && (
                <p className="text-xs mt-0.5" style={{ color: 'var(--status-error-text)' }}>
                    ⚠️ {error}
                </p>
            )}
        </div>
    );
};
