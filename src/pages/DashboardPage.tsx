import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FlaskConical, Receipt, Package, CheckCircle2, FileEdit,
    Clock, ArrowRight, TrendingUp,
} from 'lucide-react';
import { useI18n } from '../i18n/i18n.tsx';
import { useApp } from '../context/AppContext';
import { HubHeader } from '../components/ui/hub/HubHeader';
import { HubStatsGrid } from '../components/ui/hub/HubStatsGrid';
import { HubDateFilter, DateRange, DATE_RANGE_OPTIONS, isWithinDateRange } from '../components/ui/hub/HubDateFilter';
import { StatCard } from '../components/ui/StatCard';
import { getCoverGradient } from '../utils/coverGradient';

export const DashboardPage: React.FC = () => {
    const { t, locale } = useI18n();
    const { history, quotations } = useApp();
    const navigate = useNavigate();

    const [dateRange, setDateRange] = useState<DateRange>('all');
    const dateRangeLabel = DATE_RANGE_OPTIONS.find(o => o.value === dateRange)?.label ?? '';

    const statsBase = history.filter(r => isWithinDateRange(r.data, dateRange));
    const totalFormulas = statsBase.length;
    const finalFormulas = statsBase.filter(r => r.status === 'FINAL').length;
    const draftFormulas = statsBase.filter(r => r.status !== 'FINAL').length;
    const quotationsInRange = quotations.filter(q => isWithinDateRange(q.date, dateRange));

    const recent = history.slice(0, 6);

    const today = new Date().toLocaleDateString(locale, {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });

    const modules = [
        {
            to: '/formulas',
            icon: <FlaskConical size={20} />,
            color: 'var(--primary)',
            label: t('nav.formulas'),
            desc: t('dashboard.formulasModuleDesc'),
            count: totalFormulas,
        },
        {
            to: '/orcamentos',
            icon: <Receipt size={20} />,
            color: '#6366f1',
            label: t('nav.quotations'),
            desc: t('dashboard.quotationsModuleDesc'),
            count: quotations.length,
        },
        {
            to: '/estoque',
            icon: <Package size={20} />,
            color: '#10b981',
            label: t('nav.stock'),
            desc: t('dashboard.stockModuleDesc'),
            badge: t('nav.soon'),
        },
    ];

    return (
        <div className="p-6 lg:p-8 animate-in fade-in duration-300">

            <HubHeader title="Dashboard" subtitle={today} />

            {/* Stats */}
            <HubStatsGrid
                headerRight={
                    <HubDateFilter value={dateRange} onChange={setDateRange} />
                }
            >
                <StatCard
                    title={t('dashboard.totalFormulas')}
                    value={totalFormulas}
                    icon={<FlaskConical size={20} />}
                    dateRangeLabel={dateRange !== 'all' ? dateRangeLabel : undefined}
                />
                <StatCard
                    title={t('dashboard.finalFormulas')}
                    value={finalFormulas}
                    icon={<CheckCircle2 size={20} />}
                    dateRangeLabel={dateRange !== 'all' ? dateRangeLabel : undefined}
                />
                <StatCard
                    title={t('dashboard.drafts')}
                    value={draftFormulas}
                    icon={<FileEdit size={20} />}
                    dateRangeLabel={dateRange !== 'all' ? dateRangeLabel : undefined}
                />
                <StatCard
                    title={t('dashboard.quotations')}
                    value={quotationsInRange.length}
                    icon={<Receipt size={20} />}
                    dateRangeLabel={dateRange !== 'all' ? dateRangeLabel : undefined}
                />
            </HubStatsGrid>

            {/* Body: recent activity + modules */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Recent Activity — 8/12 */}
                <div
                    className="lg:col-span-8 rounded-2xl overflow-hidden"
                    style={{ background: 'var(--surface-2)' }}
                >
                    {/* Header */}
                    <div className="px-6 py-5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Clock size={14} style={{ color: 'var(--ink-2)' }} />
                            <h2
                                className="text-xs font-bold uppercase tracking-widest"
                                style={{ color: 'var(--ink-2)' }}
                            >
                                {t('dashboard.recentActivity')}
                            </h2>
                        </div>
                        <button
                            onClick={() => navigate('/formulas')}
                            className="text-xs font-bold transition-colors hover:underline"
                            style={{ color: 'var(--primary)' }}
                        >
                            {t('hub.viewAll')} →
                        </button>
                    </div>

                    {/* List */}
                    {recent.length > 0 ? (
                        <div>
                            {recent.map((recipe) => (
                                <button
                                    key={recipe.id}
                                    onClick={() => navigate(`/formulas/${recipe.id}/preview`)}
                                    className="w-full flex items-center gap-4 px-6 py-4 text-left group transition-colors hover:bg-[var(--surface-3)]"
                                >
                                    {/* Mini cover */}
                                    <div
                                        className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-sm font-black text-white select-none"
                                        style={{ background: getCoverGradient(recipe.nome_formula) }}
                                    >
                                        {recipe.nome_formula.charAt(0).toUpperCase()}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm truncate" style={{ color: 'var(--ink-0)' }}>
                                            {recipe.nome_formula}
                                        </p>
                                        <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--ink-2)' }}>
                                            {new Intl.DateTimeFormat(locale).format(new Date(recipe.data))}
                                            {' · '}{recipe.ingredientes.length} {t('editor.item')}
                                        </p>
                                    </div>

                                    {/* Status badge */}
                                    <span
                                        className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex-shrink-0"
                                        style={{
                                            background: recipe.status === 'FINAL'
                                                ? 'var(--status-success-bg)'
                                                : 'var(--status-warning-bg)',
                                            color: recipe.status === 'FINAL'
                                                ? 'var(--status-success-text)'
                                                : 'var(--status-warning-text)',
                                        }}
                                    >
                                        {recipe.status === 'FINAL' ? t('status.final') : t('status.draft')}
                                    </span>

                                    <ArrowRight
                                        size={14}
                                        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                        style={{ color: 'var(--primary)' }}
                                    />
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-14 text-center px-6">
                            <TrendingUp size={32} className="mb-3 opacity-20" style={{ color: 'var(--ink-1)' }} />
                            <p className="text-sm font-medium" style={{ color: 'var(--ink-2)' }}>
                                {t('dashboard.noActivity')}
                            </p>
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

                {/* Modules quick access — 4/12 */}
                <div className="lg:col-span-4 flex flex-col gap-3">
                    <h2
                        className="text-xs font-bold uppercase tracking-widest px-1"
                        style={{ color: 'var(--ink-2)' }}
                    >
                        {t('dashboard.modules')}
                    </h2>

                    {modules.map((mod) => (
                        <button
                            key={mod.to}
                            onClick={() => navigate(mod.to)}
                            className="group flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-150 hover:-translate-y-0.5"
                            style={{ background: 'var(--surface-2)' }}
                        >
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{ background: mod.color, color: '#ffffff' }}
                            >
                                {mod.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-sm" style={{ color: 'var(--ink-0)' }}>
                                        {mod.label}
                                    </span>
                                    {mod.badge && (
                                        <span
                                            className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"
                                            style={{ background: 'var(--surface-3)', color: 'var(--ink-2)' }}
                                        >
                                            {mod.badge}
                                        </span>
                                    )}
                                    {mod.count !== undefined && mod.count > 0 && (
                                        <span
                                            className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                                            style={{ background: 'var(--surface-3)', color: 'var(--ink-2)' }}
                                        >
                                            {mod.count}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--ink-2)' }}>
                                    {mod.desc}
                                </p>
                            </div>
                            <ArrowRight
                                size={14}
                                className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                style={{ color: 'var(--primary)' }}
                            />
                        </button>
                    ))}
                </div>

            </div>
        </div>
    );
};
