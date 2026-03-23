import React, { useState } from 'react';
import { useI18n } from '../i18n/i18n.tsx';
import { useTheme } from '../hooks/useTheme';
import { useCompanySettings } from '../hooks/useCompanySettings';
import { useAdvancedMode } from '../hooks/useAdvancedMode';
import { useApp } from '../context/AppContext';
import { Building2, User, Phone, Palette, Globe, Sun, Moon, Zap } from 'lucide-react';
import { HintButton } from '../components/ui/HintButton';

export const SettingsPage: React.FC = () => {
    const { t, locale, setLocale } = useI18n();
    const { primaryColor, setPrimaryColor, isDark, toggleDark, UI_THEMES } = useTheme();
    const { settings, updateSettings } = useCompanySettings();
    const { addToast } = useApp();

    const { advancedMode, setAdvancedMode } = useAdvancedMode();
    const [form, setForm] = useState(settings);

    const handleSave = () => {
        updateSettings(form);
        addToast(t('settings.saved'), 'success');
    };

    return (
        <div className="p-6 lg:p-8 max-w-2xl animate-in fade-in duration-300">
            <div className="mb-8">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    {t('nav.settings')}
                </h1>
            </div>

            <div className="space-y-6">
                {/* Company */}
                <section className="ds-card p-6">
                    <h2 className="text-sm font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-widest mb-5 flex items-center gap-2">
                        <Building2 size={14} />
                        {t('settings.company')}
                        <HintButton hint={t('hints.company')} />
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-neutral-400 mb-1.5 flex items-center gap-1.5">
                                <Building2 size={12} /> {t('settings.companyName')}
                            </label>
                            <input
                                className="ds-input w-full"
                                value={form.nomeEmpresa}
                                onChange={e => setForm(p => ({ ...p, nomeEmpresa: e.target.value }))}
                                placeholder={t('settings.companyName')}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-neutral-400 mb-1.5 flex items-center gap-1.5">
                                <User size={12} /> {t('settings.responsibleName')}
                            </label>
                            <input
                                className="ds-input w-full"
                                value={form.nomeResponsavel}
                                onChange={e => setForm(p => ({ ...p, nomeResponsavel: e.target.value }))}
                                placeholder={t('settings.responsibleName')}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-neutral-400 mb-1.5 flex items-center gap-1.5">
                                <Phone size={12} /> {t('settings.phone')}
                            </label>
                            <input
                                className="ds-input w-full"
                                value={form.telefone}
                                onChange={e => setForm(p => ({ ...p, telefone: e.target.value }))}
                                placeholder={t('settings.phone')}
                            />
                        </div>
                        <button
                            onClick={handleSave}
                            className="ds-button-primary px-5 py-2 text-sm font-bold"
                        >
                            {t('common.save')}
                        </button>
                    </div>
                </section>

                {/* Appearance */}
                <section className="ds-card p-6">
                    <h2 className="text-sm font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-widest mb-5 flex items-center gap-2">
                        <Palette size={14} />
                        {t('settings.appearance')}
                    </h2>
                    <div className="space-y-5">
                        <div>
                            <div className="flex items-center gap-1.5 mb-2">
                                <p className="text-xs font-semibold text-slate-500 dark:text-neutral-400">{t('settings.primaryColor')}</p>
                                <HintButton hint={t('hints.primaryColor')} />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {UI_THEMES.map(theme => (
                                    <button
                                        key={theme.nameKey}
                                        onClick={() => setPrimaryColor(theme.color)}
                                        className={`w-8 h-8 rounded-full border-2 transition-all ${primaryColor === theme.color ? 'ring-2 ring-offset-2 ring-[var(--primary)] border-white' : 'border-transparent'}`}
                                        style={{ backgroundColor: theme.color }}
                                        title={t(theme.nameKey)}
                                    />
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500 dark:text-neutral-400 mb-2">{t('settings.theme')}</p>
                            <button
                                onClick={toggleDark}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-lg ds-button text-sm font-semibold hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
                            >
                                {isDark ? <Sun size={15} /> : <Moon size={15} />}
                                {isDark ? t('nav.lightMode') : t('nav.darkMode')}
                            </button>
                        </div>
                    </div>
                </section>

                {/* Language */}
                <section className="ds-card p-6">
                    <h2 className="text-sm font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-widest mb-5 flex items-center gap-2">
                        <Globe size={14} />
                        {t('settings.language')}
                    </h2>
                    <select
                        className="ds-select w-full max-w-xs p-3 text-sm font-medium"
                        value={locale}
                        onChange={(e) => setLocale(e.target.value as any)}
                    >
                        <option value="pt-BR">{t('languages.pt-BR')}</option>
                        <option value="en">{t('languages.en')}</option>
                        <option value="es">{t('languages.es')}</option>
                    </select>
                </section>

                {/* Advanced */}
                <section className="ds-card p-6">
                    <h2 className="text-sm font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-widest mb-1 flex items-center gap-2">
                        <Zap size={14} />
                        {t('settings.advanced')}
                        <HintButton hint={t('hints.advancedMode')} />
                    </h2>
                    <p className="text-xs mb-5" style={{ color: 'var(--ink-2)' }}>{t('settings.advancedDesc')}</p>
                    <label className="flex items-center gap-3 cursor-pointer select-none w-fit">
                        <div
                            onClick={() => setAdvancedMode(!advancedMode)}
                            className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
                            style={{ background: advancedMode ? 'var(--primary)' : 'var(--surface-3)' }}
                        >
                            <span
                                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all"
                                style={{ left: advancedMode ? '26px' : '4px' }}
                            />
                        </div>
                        <span className="text-sm font-semibold" style={{ color: 'var(--ink-0)' }}>
                            {t('settings.advancedToggle')}
                        </span>
                    </label>
                    {advancedMode && (
                        <p className="mt-3 text-xs px-3 py-2 rounded-lg" style={{ background: 'var(--surface-2)', color: 'var(--ink-2)' }}>
                            {t('settings.advancedActive')}
                        </p>
                    )}
                </section>
            </div>
        </div>
    );
};
