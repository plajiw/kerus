import React from 'react';
import { useI18n } from '../../../i18n/i18n.tsx';
import { useRecipeManager } from '../../../hooks/useRecipeManager';
import { RichTextSection } from '../../common/RichTextSection';

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
    <RichTextSection
      title={t('editor.observations')}
      value={observacoes || ''}
      onChange={html => manager.handleFieldChange('observacoes', html)}
      placeholder={t('placeholders.observations')}
      helperText={t('editor.optionalHint')}
      actions={(
        <label
          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest cursor-pointer"
          style={{ color: 'var(--ink-2)' }}
        >
          <input
            type="checkbox"
            checked={exibir_observacoes ?? true}
            onChange={e => manager.handleFieldChange('exibir_observacoes', e.target.checked)}
            className="w-3.5 h-3.5 rounded"
            style={{ accentColor: 'var(--primary)' }}
          />
          {t('editor.showInFile')}
        </label>
      )}
    />
  );
};
