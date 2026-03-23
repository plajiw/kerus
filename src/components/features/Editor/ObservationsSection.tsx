import React from 'react';
import { useI18n } from '../../../i18n/i18n.tsx';
import { useRecipeManager } from '../../../hooks/useRecipeManager';

interface ObservationsSectionProps {
  observacoes: string | undefined;
  exibir_observacoes: boolean;
  manager: ReturnType<typeof useRecipeManager>;
}

export const ObservationsSection: React.FC<ObservationsSectionProps> = ({
  observacoes,
  exibir_observacoes,
  manager,
}) => {
  const { t } = useI18n();

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--surface-0)' }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3.5"
        style={{ background: 'var(--surface-1)', borderBottom: '1px solid var(--border)' }}
      >
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--ink-1)' }}>
          {t('editor.observations')}
        </span>
        <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest cursor-pointer" style={{ color: 'var(--ink-2)' }}>
          <input
            type="checkbox"
            checked={exibir_observacoes ?? true}
            onChange={e => manager.handleFieldChange('exibir_observacoes', e.target.checked)}
            className="w-3.5 h-3.5 rounded"
            style={{ accentColor: 'var(--primary)' }}
          />
          {t('editor.showInFile')}
        </label>
      </div>

      <div className="p-5 space-y-2">
        <textarea
          className="ds-textarea w-full text-sm"
          placeholder={t('placeholders.observations')}
          value={observacoes || ''}
          onChange={e => manager.handleFieldChange('observacoes', e.target.value)}
          rows={5}
        />
        <p className="text-[10px] italic" style={{ color: 'var(--ink-2)' }}>{t('editor.optionalHint')}</p>
      </div>
    </div>
  );
};
