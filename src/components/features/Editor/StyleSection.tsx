import React from 'react';
import { useI18n } from '../../../i18n/i18n.tsx';
import { FORMULA_THEMES, SHEET_FONTS } from '../../../constants/themes';
import { useRecipeManager } from '../../../hooks/useRecipeManager';
import { SectionCard } from '../../ui/SectionCard';

interface StyleSectionProps {
  accentColor: string;
  fontFamily: string;
  stripedRows: boolean;
  manager: ReturnType<typeof useRecipeManager>;
}

export const StyleSection: React.FC<StyleSectionProps> = ({
  accentColor,
  fontFamily,
  stripedRows,
  manager,
}) => {
  const { t } = useI18n();

  return (
    <div className="space-y-6">

      {/* Color themes */}
      <SectionCard title={t('editor.themes')} collapsible={false}>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3">
            {FORMULA_THEMES.map(theme => {
              const isSelected = accentColor === theme.color;
              return (
                <button
                  key={theme.nameKey}
                  onClick={() => manager.handleFieldChange('accentColor', theme.color)}
                  className="h-11 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all"
                  style={{
                    background: isSelected ? `${theme.color}15` : 'var(--surface-3)',
                    color: isSelected ? theme.color : 'var(--ink-1)',
                    border: 'none',
                    // Design System v3.0: Outline ao invés de border para seleção
                    outline: isSelected ? `2px solid ${theme.color}` : 'none',
                    outlineOffset: '2px'
                  }}
                >
                  <div className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm" style={{ background: theme.color }} />
                  {t(theme.nameKey)}
                </button>
              );
            })}
          </div>
        </div>
      </SectionCard>

      {/* Typography (Novo Padrão Visual "Grid de Cards") */}
      <SectionCard title={t('editor.typography')} collapsible={false}>
        <div className="p-4">
          {/* Responsive: 2 colunas no celular, 3 em telas maiores */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {SHEET_FONTS.map(font => {
              const selected = (fontFamily || SHEET_FONTS[0].value) === font.value;
              return (
                <button
                  key={font.value}
                  onClick={() => manager.handleFieldChange('fontFamily', font.value)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 ${
                    selected ? 'outline outline-2 outline-[var(--primary)] outline-offset-2' : 'hover:-translate-y-0.5 hover:brightness-95'
                  }`}
                  style={{
                    background: selected ? 'rgba(var(--primary-rgb), 0.1)' : 'var(--surface-3)',
                    border: 'none',
                  }}
                >
                  {/* Prévia Visual da Fonte (Grande) */}
                  <span
                    className="text-2xl mb-1.5 leading-none"
                    style={{ fontFamily: font.value, color: selected ? 'var(--primary)' : 'var(--ink-0)' }}
                  >
                    Ag
                  </span>
                  
                  {/* Nome da Fonte (Pequeno e em caixa alta para contraste) */}
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest truncate w-full text-center"
                    style={{ color: selected ? 'var(--primary)' : 'var(--ink-2)' }}
                  >
                    {font.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </SectionCard>

      {/* Options */}
      <SectionCard title={t('editor.options')} collapsible={false}>
        <div className="p-4">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                id="striped"
                checked={stripedRows}
                onChange={e => manager.handleFieldChange('stripedRows', e.target.checked)}
                className="w-4 h-4 rounded cursor-pointer transition-all"
                style={{ accentColor: 'var(--primary)' }}
              />
            </div>
            <span className="text-sm font-medium transition-colors group-hover:text-[var(--primary)]" style={{ color: 'var(--ink-0)' }}>
              {t('editor.stripedRows')}
            </span>
          </label>
        </div>
      </SectionCard>

    </div>
  );
};