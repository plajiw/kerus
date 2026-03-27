import React from 'react';

interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  error?: string;
  unit?: string;
  disabled?: boolean;
}

export const QuantityInput: React.FC<QuantityInputProps> = ({
  value,
  onChange,
  step = 0.1,
  min = 0,
  max,
  error,
  unit,
  disabled = false
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 0;
    if (max === undefined || val <= max) {
      onChange(val);
    }
  };

  const handleIncrement = () => {
    const newVal = value + step;
    if (max === undefined || newVal <= max) {
      onChange(newVal);
    }
  };

  const handleDecrement = () => {
    const newVal = Math.max(min, value - step);
    onChange(newVal);
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--ink-2)' }}>
        Quantidade {unit && `(${unit})`}
      </label>
      <div className="relative flex items-center">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || value <= min}
          className="absolute left-2 h-8 w-8 flex items-center justify-center rounded ds-icon-button disabled:opacity-50 disabled:cursor-not-allowed"
        >
          −
        </button>
        <input
          type="number"
          value={value}
          onChange={handleChange}
          step={step}
          min={min}
          max={max}
          disabled={disabled}
          className={`ds-input w-full text-center font-mono px-10 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || (max !== undefined && value >= max)}
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
      {value === 0 && (
        <p className="text-xs mt-0.5" style={{ color: 'var(--status-warning-text)' }}>
          ⚠️ Quantidade zerada
        </p>
      )}
    </div>
  );
};
