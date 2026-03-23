import React from 'react';
import { useI18n } from '../../../i18n/i18n.tsx';
import { FORMULA_THEMES, FORMULA_FONTS } from '../../../constants/themes';
import { useRecipeManager } from '../../../hooks/useRecipeManager';

interface StyleSectionProps {
  accentColor: string;
  fontFamily: string;
  stripedRows: boolean;
  manager: ReturnType<typeof useRecipeManager>;
}

const SectionBlock: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--surface-0)' }}>
        <div className="px-5 py-3.5" style={{ background: 'var(--surface-1)', borderBottom: '1px solid var(--border)' }}>
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--ink-1)' }}>{title}</span>
        </div>
        <div className="p-5">{children}</div>
    </div>
);

export const StyleSection: React.FC<StyleSectionProps> = ({
  accentColor,
  fontFamily,
  stripedRows,
  manager,
}) => {
  const { t } = useI18n();

  return (
    <div className="space-y-5">

      {/* Color themes */}
      <SectionBlock title={t('editor.themes')}>
        <div className="grid grid-cols-2 gap-3">
          {FORMULA_THEMES.map(theme => (
            <button
              key={theme.nameKey}
              onClick={() => manager.handleFieldChange('accentColor', theme.color)}
              className="h-11 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all"
              style={{
                border: `2px solid ${accentColor === theme.color ? theme.color : 'var(--border)'}`,
                background: accentColor === theme.color ? `${theme.color}18` : 'var(--surface-1)',
                color: accentColor === theme.color ? theme.color : 'var(--ink-1)',
              }}
            >
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: theme.color }} />
              {t(theme.nameKey)}
            </button>
          ))}
        </div>
      </SectionBlock>

      {/* Typography */}
      <SectionBlock title={t('editor.typography')}>
        <select
          className="ds-select w-full text-sm"
          value={fontFamily || FORMULA_FONTS[0].value}
          onChange={e => manager.handleFieldChange('fontFamily', e.target.value)}
        >
          {FORMULA_FONTS.map(font => (
            <option key={font.value} value={font.value}>{font.name}</option>
          ))}
        </select>
      </SectionBlock>

      {/* Options */}
      <SectionBlock title={t('editor.options')}>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            id="striped"
            checked={stripedRows}
            onChange={e => manager.handleFieldChange('stripedRows', e.target.checked)}
            className="w-4 h-4 rounded"
            style={{ accentColor: 'var(--primary)' }}
          />
          <span className="text-sm font-medium" style={{ color: 'var(--ink-0)' }}>
            {t('editor.stripedRows')}
          </span>
        </label>
      </SectionBlock>

    </div>
  );
};
