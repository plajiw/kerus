import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FlaskConical, Receipt, Package, CheckCircle2, FileEdit, Clock, ArrowRight, TrendingUp } from 'lucide-react';
import { HintButton } from '../components/ui/HintButton';
import { useI18n } from '../i18n/i18n.tsx';
import { useApp } from '../context/AppContext';

export const DashboardPage: React.FC = () => {
    const { t, locale } = useI18n();
    const { history, quotations } = useApp();
    const navigate = useNavigate();

    const totalFormulas = history.length;
    const finalFormulas = history.filter(r => r.status === 'FINAL').length;
    const draftFormulas = history.filter(r => r.status !== 'FINAL').length;
    const recent = history.slice(0, 5);

    const today = new Date().toLocaleDateString(locale, {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });

    const metrics = [
        {
            label: t('dashboard.totalFormulas'),
            value: totalFormulas,
            icon: <FlaskConical size={18} />,
            color: 'var(--primary)',
            bg: 'var(--primary)',
            action: () => navigate('/formulas'),
        },
        {
            label: t('dashboard.finalFormulas'),
            value: finalFormulas,
            icon: <CheckCircle2 size={18} />,
            color: '#10b981',
            bg: '#10b981',
            action: () => navigate('/formulas'),
        },
        {
            label: t('dashboard.drafts'),
            value: draftFormulas,
            icon: <FileEdit size={18} />,
            color: '#f59e0b',
            bg: '#f59e0b',
            action: () => navigate('/formulas'),
        },
        {
            label: t('dashboard.quotations'),
            value: quotations.length,
            icon: <Receipt size={18} />,
            color: '#6366f1',
            bg: '#6366f1',
            action: () => navigate('/orcamentos'),
        },
    ];

    const modules = [
        {
            to: '/formulas',
            icon: <FlaskConical size={22} />,
            color: 'var(--primary)',
            label: t('nav.formulas'),
            desc: t('dashboard.formulasModuleDesc'),
            count: totalFormulas,
        },
        {
            to: '/orcamentos',
            icon: <Receipt size={22} />,
            color: '#6366f1',
            label: t('nav.quotations'),
            desc: t('dashboard.quotationsModuleDesc'),
        },
        {
            to: '/estoque',
            icon: <Package size={22} />,
            color: '#10b981',
            label: t('nav.stock'),
            desc: t('dashboard.stockModuleDesc'),
            badge: t('nav.soon'),
        },
    ];

    return (
        <div className="p-6 lg:p-8 space-y-8 animate-in fade-in duration-300">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-black text-[var(--ink-0)] uppercase tracking-tight">
                    Dashboard
                </h1>
                <p className="text-sm text-[var(--ink-2)] mt-1 capitalize">{today}</p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" role="region" aria-label="metrics">
                {metrics.map((m) => (
                    <button
                        key={m.label}
                        onClick={m.action}
                        className="group text-left p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                        style={{ background: 'var(--surface-0)', borderColor: 'var(--border)' }}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-1.5">
                                <div
                                    className="w-9 h-9 rounded-lg flex items-center justify-center text-white opacity-90"
                                    style={{ backgroundColor: m.bg }}
                                >
                                    {m.icon}
                                </div>
                                <HintButton hint={t('hints.metrics')} />
                            </div>
                            {m.badge && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"
                                    style={{ background: 'var(--surface-2)', color: 'var(--ink-2)' }}>
                                    {m.badge}
                                </span>
                            )}
                        </div>
                        <p className="text-3xl font-black" style={{ color: m.color }}>{m.value}</p>
                        <p className="text-xs font-semibold mt-1" style={{ color: 'var(--ink-2)' }}>{m.label}</p>
                    </button>
                ))}
            </div>

            {/* Recent Activity + Modules (side by side on desktop) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Recent Activity */}
                <div className="lg:col-span-2 rounded-2xl border" style={{ background: 'var(--surface-0)', borderColor: 'var(--border)' }}>
                    <div className="px-5 pt-5 pb-3 flex items-center justify-between border-b" style={{ borderColor: 'var(--border)' }}>
                        <div className="flex items-center gap-2">
                            <Clock size={14} style={{ color: 'var(--ink-2)' }} />
                            <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--ink-2)' }}>
                                {t('dashboard.recentActivity')}
                            </h2>
                            <HintButton hint={t('hints.recentActivity')} />
                        </div>
                        <button
                            onClick={() => navigate('/formulas')}
                            className="text-xs font-bold hover:underline transition-colors"
                            style={{ color: 'var(--primary)' }}
                        >
                            {t('hub.viewAll')} →
                        </button>
                    </div>

                    {recent.length > 0 ? (
                        <div className="divide-y" style={{ '--tw-divide-opacity': 1 } as any}>
                            {recent.map((recipe) => (
                                <button
                                    key={recipe.id}
                                    onClick={() => navigate(`/formulas/${recipe.id}/preview`)}
                                    className="w-full flex items-center gap-4 px-5 py-3.5 transition-colors group text-left hover:bg-[var(--surface-1)]"
                                    style={{ borderColor: 'var(--border)' }}
                                >
                                    <div
                                        className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 transition-colors"
                                        style={{ background: 'var(--surface-2)', color: 'var(--ink-1)' }}
                                    >
                                        {recipe.nome_formula.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm truncate" style={{ color: 'var(--ink-0)' }}>{recipe.nome_formula}</p>
                                        <p className="text-xs mt-0.5" style={{ color: 'var(--ink-2)' }}>
                                            {new Date(recipe.data).toLocaleDateString(locale)} · {recipe.ingredientes.length} {t('editor.item')}
                                        </p>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest flex-shrink-0 ${
                                        recipe.status === 'FINAL'
                                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                    }`}>
                                        {recipe.status === 'FINAL' ? t('status.final') : t('status.draft')}
                                    </span>
                                    <ArrowRight size={14} className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--primary)' }} />
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <TrendingUp size={32} className="mb-3 opacity-20" style={{ color: 'var(--ink-1)' }} />
                            <p className="text-sm font-medium" style={{ color: 'var(--ink-2)' }}>{t('dashboard.noActivity')}</p>
                            <button
                                onClick={() => navigate('/formulas')}
                                className="mt-3 text-sm font-bold hover:underline"
                                style={{ color: 'var(--primary)' }}
                            >
                                {t('buttons.newSheet')} →
                            </button>
                        </div>
                    )}
                </div>

                {/* Modules Quick Access */}
                <div className="space-y-3">
                    <h2 className="text-xs font-bold uppercase tracking-widest px-1" style={{ color: 'var(--ink-2)' }}>
                        {t('dashboard.modules')}
                    </h2>
                    {modules.map((mod) => (
                        <button
                            key={mod.to}
                            onClick={() => navigate(mod.to)}
                            className="group w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
                            style={{ background: 'var(--surface-0)', borderColor: 'var(--border)' }}
                        >
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                                style={{ backgroundColor: mod.color }}
                            >
                                {mod.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-sm" style={{ color: 'var(--ink-0)' }}>{mod.label}</span>
                                    {mod.badge && (
                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"
                                            style={{ background: 'var(--surface-2)', color: 'var(--ink-2)' }}>
                                            {mod.badge}
                                        </span>
                                    )}
                                    {mod.count !== undefined && (
                                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ backgroundColor: mod.color }}>
                                            {mod.count}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--ink-2)' }}>{mod.desc}</p>
                            </div>
                            <ArrowRight size={14} className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: mod.color }} />
                        </button>
                    ))}
                </div>

            </div>
        </div>
    );
};
