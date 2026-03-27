import React from 'react';
import { DollarSign } from 'lucide-react';

interface PriceInputProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  currency?: string;
}

export const PriceInput: React.FC<PriceInputProps> = ({
  value,
  onChange,
  label = 'Preço Unitário',
  error,
  disabled = false,
  currency = 'R$'
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 0;
    onChange(Math.max(0, val));
  };

  const handleIncrement = () => {
    onChange(parseFloat((value + 0.01).toFixed(2)));
  };

  const handleDecrement = () => {
    onChange(Math.max(0, parseFloat((value - 0.01).toFixed(2))));
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--ink-2)' }}>
        {label}
      </label>
      <div className="relative flex items-center">
        <div className="absolute left-3 flex items-center gap-1 pointer-events-none" style={{ color: 'var(--ink-2)' }}>
          <DollarSign size={14} />
          <span className="text-xs font-bold">{currency}</span>
        </div>
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || value <= 0}
          className="absolute left-16 h-8 w-8 flex items-center justify-center rounded ds-icon-button disabled:opacity-50 disabled:cursor-not-allowed"
        >
          −
        </button>
        <input
          type="number"
          value={value}
          onChange={handleChange}
          step="0.01"
          min="0"
          disabled={disabled}
          className={`ds-input w-full text-right font-mono pl-20 pr-10 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled}
          className="absolute right-2 h-8 w-8 flex items-center justify-center rounded ds-icon-button disabled:opacity-50 disabled:cursor-not-allowed"
        >
          +
        </button>
      </div>
      {error && (
        <p className="text-xs mt-0.5" style={{ color: 'var(--status-error-text)' }}>
          ⚠️ {error}
        </p>
      )}
    </div>
  );
};
