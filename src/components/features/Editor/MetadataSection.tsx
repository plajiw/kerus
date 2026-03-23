import React from 'react';
import { FileText, Building2, FlaskConical, Layers } from 'lucide-react';
import { useI18n } from '../../../i18n/i18n.tsx';
import { useAdvancedMode } from '../../../hooks/useAdvancedMode';
import { toISODate } from '../../../utils/dateUtils';
import { useRecipeManager } from '../../../hooks/useRecipeManager';

interface MetadataSectionProps {
    nomeFormula: string;
    nomeEmpresa: string;
    data: string;
    manager: ReturnType<typeof useRecipeManager>;
}

const FieldLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: 'var(--ink-2)' }}>
        {children}
    </label>
);

const VISCOSITY_OPTIONS = [
    { value: '', label: '—' },
    { value: 'fluido', label: 'Fluido' },
    { value: 'loção', label: 'Loção' },
    { value: 'creme', label: 'Creme' },
    { value: 'gel', label: 'Gel' },
    { value: 'pomada', label: 'Pomada / Manteiga' },
    { value: 'sólido', label: 'Sólido / Barra' },
];

export const MetadataSection: React.FC<MetadataSectionProps> = ({
    nomeFormula,
    nomeEmpresa,
    data,
    manager,
}) => {
    const { t } = useI18n();
    const { advancedMode } = useAdvancedMode();
    const r = manager.currentRecipe;

    return (
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--surface-0)' }}>

            {/* Header */}
            <div
                className="flex items-center gap-2 px-5 py-3.5"
                style={{ background: 'var(--surface-1)', borderBottom: '1px solid var(--border)' }}
            >
                <FileText size={14} style={{ color: 'var(--primary)' }} />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--ink-1)' }}>
                    {t('editor.mainData')}
                </span>
            </div>

            {/* Basic fields */}
            <div className="p-5 space-y-4">
                <div>
                    <FieldLabel>{t('editor.productName')} *</FieldLabel>
                    <input
                        className="ds-input ds-input-lg w-full font-bold"
                        style={{ height: 'var(--h-control-lg)' }}
                        placeholder={t('placeholders.productName')}
                        value={nomeFormula}
                        onChange={e => manager.handleFieldChange('nome_formula', e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <FieldLabel>{t('editor.company')}</FieldLabel>
                        <div className="relative">
                            <Building2
                                size={14}
                                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                                style={{ color: 'var(--ink-2)' }}
                            />
                            <input
                                className="ds-input w-full pl-9"
                                placeholder={t('placeholders.company')}
                                value={nomeEmpresa || ''}
                                onChange={e => manager.handleFieldChange('nome_empresa', e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <FieldLabel>{t('editor.creationDate')}</FieldLabel>
                        <input
                            type="date"
                            className="ds-input w-full"
                            value={toISODate(data)}
                            onChange={e => manager.handleFieldChange('data', e.target.value)}
                        />
                    </div>
                </div>

                {/* ── Advanced fields ───────────────────────────────── */}
                {advancedMode && (
                    <div
                        className="mt-1 pt-4 space-y-4"
                        style={{ borderTop: '1px dashed var(--border)' }}
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <FlaskConical size={12} style={{ color: 'var(--primary)' }} />
                            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--primary)' }}>
                                Dados Técnicos
                            </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {/* Batch size */}
                            <div>
                                <FieldLabel>Tamanho do Lote (g)</FieldLabel>
                                <input
                                    type="number"
                                    min="0"
                                    step="10"
                                    className="ds-input w-full text-right font-mono"
                                    placeholder="100"
                                    value={r.batch_size || ''}
                                    onChange={e => manager.handleFieldChange('batch_size', parseFloat(e.target.value) || 0)}
                                    onFocus={e => e.currentTarget.select()}
                                />
                            </div>

                            {/* pH min */}
                            <div>
                                <FieldLabel>pH Mínimo</FieldLabel>
                                <input
                                    type="number"
                                    min="0"
                                    max="14"
                                    step="0.1"
                                    className="ds-input w-full text-right font-mono"
                                    placeholder="4.5"
                                    value={r.ph_min || ''}
                                    onChange={e => manager.handleFieldChange('ph_min', parseFloat(e.target.value) || 0)}
                                    onFocus={e => e.currentTarget.select()}
                                />
                            </div>

                            {/* pH max */}
                            <div>
                                <FieldLabel>pH Máximo</FieldLabel>
                                <input
                                    type="number"
                                    min="0"
                                    max="14"
                                    step="0.1"
                                    className="ds-input w-full text-right font-mono"
                                    placeholder="6.0"
                                    value={r.ph_max || ''}
                                    onChange={e => manager.handleFieldChange('ph_max', parseFloat(e.target.value) || 0)}
                                    onFocus={e => e.currentTarget.select()}
                                />
                            </div>

                            {/* Viscosity */}
                            <div>
                                <FieldLabel>Perfil de Viscosidade</FieldLabel>
                                <select
                                    className="ds-select w-full"
                                    value={r.viscosity || ''}
                                    onChange={e => manager.handleFieldChange('viscosity', e.target.value)}
                                >
                                    {VISCOSITY_OPTIONS.map(o => (
                                        <option key={o.value} value={o.value}>{o.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Version */}
                            <div>
                                <FieldLabel>Versão da Fórmula</FieldLabel>
                                <div className="relative">
                                    <Layers
                                        size={13}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                                        style={{ color: 'var(--ink-2)' }}
                                    />
                                    <input
                                        className="ds-input w-full pl-9 font-mono"
                                        placeholder="1.0"
                                        value={r.formula_version || ''}
                                        onChange={e => manager.handleFieldChange('formula_version', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* pH visual indicator */}
                        {(r.ph_min || r.ph_max) && (
                            <div className="rounded-lg px-3 py-2.5" style={{ background: 'var(--surface-2)' }}>
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--ink-2)' }}>
                                        Faixa de pH alvo
                                    </span>
                                    <span className="text-xs font-mono font-bold" style={{ color: 'var(--ink-0)' }}>
                                        {r.ph_min ?? '?'} — {r.ph_max ?? '?'}
                                    </span>
                                </div>
                                {/* pH scale bar 0-14 */}
                                <div className="relative h-2 rounded-full overflow-hidden"
                                    style={{
                                        background: 'linear-gradient(to right, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #8b5cf6)'
                                    }}
                                >
                                    {r.ph_min !== undefined && r.ph_max !== undefined && (
                                        <div
                                            className="absolute h-full rounded-full"
                                            style={{
                                                left: `${(r.ph_min / 14) * 100}%`,
                                                width: `${((r.ph_max - r.ph_min) / 14) * 100}%`,
                                                background: 'rgba(255,255,255,0.35)',
                                                border: '1.5px solid white',
                                            }}
                                        />
                                    )}
                                </div>
                                <div className="flex justify-between text-[9px] font-mono mt-0.5" style={{ color: 'var(--ink-2)' }}>
                                    <span>0</span><span>7</span><span>14</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
