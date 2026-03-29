import React, { useState } from 'react';
import { useI18n } from '../../i18n/i18n.tsx';
import { useTheme } from '../../hooks/useTheme';
import { useCompanySettings } from '../../hooks/useCompanySettings';
import { useAdvancedMode } from '../../hooks/useAdvancedMode';
import { useHelpMode } from '../../hooks/useHelpMode';
import { useApp } from '../../context/AppContext';
import { Building2, User, Phone, Palette, Globe, Zap, HelpCircle } from 'lucide-react';
import { HintButton } from '../../components/ui/HintButton';

export const SettingsPage: React.FC = () => {
    const { t, locale, setLocale } = useI18n();
    const { themeMode, setThemeMode } = useTheme();
    const { settings, updateSettings } = useCompanySettings();
    const { addToast } = useApp();

    const { advancedMode, setAdvancedMode } = useAdvancedMode();
    const { helpMode, setHelpMode } = useHelpMode();
    const [form, setForm] = useState(settings);

    const handleSave = () => {
        updateSettings(form);
        addToast(t('settings.saved'), 'success');
    };

    return (
        /* max-w-6xl expande o limite no desktop. grid gap-6 organiza as colunas */
        <div className="p-6 lg:p-8 max-w-6xl mx-auto animate-in fade-in duration-300">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-2xl font-black uppercase tracking-tight" style={{ color: 'var(--ink-0)' }}>
                    {t('nav.settings')}
                </h1>

                {/* O botão salvar movido para o topo no desktop, comum em painéis robustos */}
                <button onClick={handleSave} className="ds-button-primary hidden sm:inline-flex">
                    {t('common.save')}
                </button>
            </div>

            {/* Início do Grid Principal (2 colunas no Desktop, items-start evita que estiquem a altura) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

                {/* ── COLUNA ESQUERDA ───────────────────────────────────────── */}
                <div className="space-y-6 flex flex-col">

                    {/* Company */}
                    <section className="ds-card p-6">
                        <h2 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2" style={{ color: 'var(--ink-0)' }}>
                            <Building2 size={14} />
                            {t('settings.company')}
                            <HintButton
                                title={t('settings.company')}
                                hint={t('hints.company')}
                                docsLink="/docs/guide/settings#perfil-da-empresa"
                            />
                        </h2>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-semibold mb-2 flex items-center gap-1.5 uppercase" style={{ color: 'var(--ink-1)' }}>
                                    <Building2 size={12} /> {t('settings.companyName')}
                                </label>
                                <input
                                    className="ds-input w-full"
                                    value={form.nomeEmpresa}
                                    onChange={e => setForm(p => ({ ...p, nomeEmpresa: e.target.value }))}
                                    placeholder={t('settings.companyName')}
                                />
                            </div>

                            {/* Inputs lado a lado no desktop para não perder espaço */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-semibold mb-2 flex items-center gap-1.5 uppercase" style={{ color: 'var(--ink-1)' }}>
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
                                    <label className="block text-xs font-semibold mb-2 flex items-center gap-1.5 uppercase" style={{ color: 'var(--ink-1)' }}>
                                        <Phone size={12} /> {t('settings.phone')}
                                    </label>
                                    <input
                                        className="ds-input w-full"
                                        value={form.telefone}
                                        onChange={e => setForm(p => ({ ...p, telefone: e.target.value }))}
                                        placeholder={t('settings.phone')}
                                    />
                                </div>
                            </div>

                            {/* Botão salvar duplicado para mobile, alinhado com o DS */}
                            <button onClick={handleSave} className="ds-button-primary w-full sm:hidden mt-4">
                                {t('common.save')}
                            </button>
                        </div>
                    </section>

                    {/* Language */}
                    <section className="ds-card p-6">
                        <h2 className="text-sm font-bold uppercase tracking-widest mb-5 flex items-center gap-2" style={{ color: 'var(--ink-0)' }}>
                            <Globe size={14} />
                            {t('settings.language')}
                        </h2>
                        <select
                            className="ds-select w-full sm:max-w-[200px]"
                            value={locale}
                            onChange={(e) => setLocale(e.target.value as any)}
                        >
                            <option value="pt-BR">{t('languages.pt-BR')}</option>
                            <option value="en">{t('languages.en')}</option>
                            <option value="es">{t('languages.es')}</option>
                        </select>
                    </section>
                </div>

                {/* ── COLUNA DIREITA ────────────────────────────────────────── */}
                <div className="space-y-6 flex flex-col">

                    {/* Appearance */}
                    <section className="ds-card p-6">
                        <h2 className="text-sm font-bold uppercase tracking-widest mb-5 flex items-center gap-2" style={{ color: 'var(--ink-0)' }}>
                            <Palette size={14} />
                            {t('settings.appearance')}
                        </h2>

                        <p className="text-xs font-semibold mb-4 uppercase" style={{ color: 'var(--ink-2)' }}>
                            {t('settings.theme')}
                        </p>

                        {/* Grid responsivo para os temas: 2 colunas mobile, 4 colunas desktop */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {([
                                { mode: 'light', label: 'Claro', bg: '#F6F6F6', card: '#FFFFFF', accent: '#E67E00' },
                                { mode: 'dark', label: 'Escuro', bg: '#131313', card: '#202020', accent: '#FF8C00' },
                                { mode: 'sepia', label: 'Sepia', bg: '#F4EFE6', card: '#FCF9F2', accent: '#C05621' },
                                { mode: 'ocean', label: 'Ocean', bg: '#1E293B', card: '#334155', accent: '#38BDF8' },
                                { mode: 'dracula', label: 'Dracula', bg: '#282A36', card: '#383A59', accent: '#BD93F9' },
                                { mode: 'monokai', label: 'Monokai', bg: '#272822', card: '#3E3D32', accent: '#F92672' },
                                { mode: 'amoled', label: 'Amoled', bg: '#000000', card: '#121212', accent: '#FF8C00' },
                                { mode: 'high-contrast', label: 'Alto Contraste', bg: '#000000', card: '#333333', accent: '#FFFF00' },
                            ] as const).map(({ mode, label, bg, card, accent }) => (
                                <button
                                    key={mode}
                                    type="button"
                                    onClick={() => setThemeMode(mode)}
                                    className="flex flex-col items-center gap-2 p-3 rounded-md transition-all outline-none"
                                    style={{
                                        border: `2px solid ${themeMode === mode ? 'var(--primary)' : 'transparent'}`,
                                        background: 'var(--surface-3)',
                                    }}
                                >
                                    <div
                                        className="w-12 h-8 rounded shrink-0 relative overflow-hidden"
                                        style={{
                                            background: bg,
                                            border: mode === 'high-contrast' ? '1px solid #333' : 'none'
                                        }}
                                    >
                                        <div style={{ position: 'absolute', bottom: 4, left: 4, right: 4, height: 12, borderRadius: 2, background: card }} />
                                        <div style={{ position: 'absolute', top: 4, right: 4, width: 8, height: 8, borderRadius: '50%', background: accent }} />
                                    </div>
                                    <span
                                        className="text-xs font-bold whitespace-nowrap transition-colors"
                                        style={{ color: themeMode === mode ? 'var(--primary)' : 'var(--ink-1)' }}
                                    >
                                        {label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Help Mode */}
                    <section className="ds-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2" style={{ color: 'var(--ink-0)' }}>
                                <HelpCircle size={14} />
                                {t('settings.helpMode')}
                                <HintButton
                                    title={t('settings.helpMode')}
                                    text={t('hints.helpMode')}
                                    callout="icon"
                                    calloutText="Procure por este ícone na interface."
                                    docsLink="/docs/guide/help-mode"
                                    mediaUrl="/assets/demos/help-mode-demo.mp4"
                                    feedbackId="help-mode-setting"
                                    forceVisible
                                />
                            </h2>
                            {/* Toggle Switch */}
                            <button
                                type="button"
                                onClick={() => setHelpMode(!helpMode)}
                                className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0 outline-none"
                                style={{ background: helpMode ? 'var(--primary)' : 'var(--surface-3)' }}
                            >
                                <span
                                    className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all"
                                    style={{ left: helpMode ? '26px' : '4px' }}
                                />
                            </button>
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-2)' }}>
                            {t('settings.helpModeDesc')}
                        </p>
                    </section>

                    {/* Advanced */}
                    <section className="ds-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2" style={{ color: 'var(--ink-0)' }}>
                                <Zap size={14} />
                                {t('settings.advanced')}
                                <HintButton
                                    title={t('settings.advanced')}
                                    hint={
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <p style={{ margin: 0 }}>{t('hints.advancedMode')}</p>
                                            <ul style={{ margin: 0, paddingLeft: '16px', opacity: 0.9 }}>
                                                <li>Habilita o acesso a <strong>campos ocultos</strong> e configurações cruciais do sistema.</li>
                                                <li><strong style={{ color: 'var(--status-warning-text)' }}>Atenção:</strong> Recomendado apenas para usuários administradores.</li>
                                            </ul>
                                        </div>
                                    }
                                    docsLink="/docs/guide/advanced-mode"
                                    onFeedback={(isHelpful) => {
                                        if (isHelpful) {
                                            addToast('Ficamos felizes em ajudar!', 'success');
                                        } else {
                                            addToast('Obrigado pelo feedback. Vamos rever nosso texto!', 'info');
                                        }
                                    }}
                                />
                            </h2>
                            {/* Toggle Switch */}
                            <button
                                type="button"
                                onClick={() => setAdvancedMode(!advancedMode)}
                                className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0 outline-none"
                                style={{ background: advancedMode ? 'var(--primary)' : 'var(--surface-3)' }}
                            >
                                <span
                                    className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all"
                                    style={{ left: advancedMode ? '26px' : '4px' }}
                                />
                            </button>
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-2)' }}>
                            {t('settings.advancedDesc')}
                        </p>

                        {advancedMode && (
                            <div className="mt-4 p-3 rounded-md text-xs font-medium border-l-2"
                                style={{ background: 'var(--surface-1)', color: 'var(--ink-1)', borderColor: 'var(--primary)' }}>
                                {t('settings.advancedActive')}
                            </div>
                        )}
                    </section>

                </div>
            </div>
        </div>
    );
};