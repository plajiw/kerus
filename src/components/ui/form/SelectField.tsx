import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectFieldProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[] | string[];
    placeholder?: string;
    error?: string;
    hint?: React.ReactNode;
    disabled?: boolean;
    fullWidth?: boolean;
}

export const SelectField: React.FC<SelectFieldProps> = ({
    label,
    value,
    onChange,
    options,
    placeholder = 'Selecionar...',
    error,
    hint,
    disabled = false,
    fullWidth = true,
}) => {
    const normalizedOptions: SelectOption[] = options.map(opt =>
        typeof opt === 'string' ? { value: opt, label: opt } : opt
    );

    return (
        <div className={`flex flex-col gap-1 ${fullWidth ? 'w-full' : ''}`}>
            {label && (
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--ink-2)' }}>
                    {label}
                    {hint}
                </label>
            )}
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    className={`ds-select w-full appearance-none pr-8 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <option value="" disabled>{placeholder}</option>
                    {normalizedOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <ChevronDown
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: 'var(--ink-2)' }}
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
