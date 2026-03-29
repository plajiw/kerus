import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FlaskConical, Receipt, Package, Wrench, CheckCircle2, FileEdit,
    Clock, ArrowRight, TrendingUp,
} from 'lucide-react';
import { useI18n } from '../../i18n/i18n.tsx';
import { useApp } from '../../context/AppContext';
import { HubHeader } from '../../components/ui/hub/HubHeader';
import { HubStatsGrid } from '../../components/ui/hub/HubStatsGrid';
import { HubDateFilter, DateRange, DATE_RANGE_OPTIONS, isWithinDateRange } from '../../components/ui/hub/HubDateFilter';
import { StatCard, StatCardVariant, ICON_STYLES } from '../../components/ui/StatCard';
import { getCoverGradient, buildAccentGradient, getAvatarTextColor } from '../../utils/coverGradient';

export const DashboardPage: React.FC = () => {
    const { t, locale } = useI18n();
    const { history, quotations } = useApp();
    const navigate = useNavigate();

    const [dateRange, setDateRange] = useState<DateRange>('all');
    const dateRangeLabel = DATE_RANGE_OPTIONS.find(o => o.value === dateRange)?.label ?? '';

    const statsBase = history.filter(r => isWithinDateRange(r.data, dateRange));
    const totalSheets = statsBase.length;
    const finalSheets = statsBase.filter(r => r.status === 'FINAL').length;
    const draftSheets = statsBase.filter(r => r.status !== 'FINAL').length;
    const quotationsInRange = quotations.filter(q => isWithinDateRange(q.date, dateRange));

    const allActivities = [
        ...history.map(r => ({
            id: r.id,
            type: 'sheet' as const,
            title: r.nome_formula,
            date: new Date(r.data),
            subtitle: `${r.ingredientes.length} ${t('editor.item')}`,
            status: r.status,
            statusLabel: r.status === 'FINAL' ? t('status.final') : t('status.draft'),
            isFinal: r.status === 'FINAL',
            path: `/fichas-tecnicas/${r.id}/preview`,
            color: 'var(--primary)',
            accentColor: r.accentColor,
        })),
        ...quotations.map(q => ({
            id: q.id,
            type: 'quotation' as const,
            title: q.title,
            date: new Date(q.date),
            subtitle: q.clientName,
            status: q.status,
            statusLabel: q.status,
            isFinal: q.status === 'APROVADO' || q.status === 'ENVIADO',
            path: `/orcamentos`,
            color: '#6366f1',
            accentColor: q.accentColor,
        }))
    ].sort((a, b) => b.date.getTime() - a.date.getTime());

    const recent = allActivities.slice(0, 6);

    const today = new Date().toLocaleDateString(locale, {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });

    const modules: { to: string; icon: React.ReactNode; variant: StatCardVariant; label: string; desc: string; count?: number; badge?: string }[] = [
        {
            to: '/fichas-tecnicas',
            icon: <FlaskConical size={20} />,
            variant: 'primary',
            label: t('nav.sheets'),
            desc: t('dashboard.sheetsModuleDesc'),
            count: totalSheets,
        },
        {
            to: '/orcamentos',
            icon: <Receipt size={20} />,
            variant: 'info',
            label: t('nav.quotations'),
            desc: t('dashboard.quotationsModuleDesc'),
            count: quotations.length,
        },
        {
            to: '/servicos',
            icon: <Wrench size={20} />,
            variant: 'warning',
            label: t('nav.services'),
            desc: t('dashboard.servicesModuleDesc'),
        },
        {
            to: '/estoque',
            icon: <Package size={20} />,
            variant: 'success',
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
                    value={totalSheets}
                    variant="primary"
                    icon={<FlaskConical size={20} />}
                    dateRangeLabel={dateRange !== 'all' ? dateRangeLabel : undefined}
                />
                <StatCard
                    title={t('dashboard.finalFormulas')}
                    value={finalSheets}
                    variant="success"
                    icon={<CheckCircle2 size={20} />}
                    dateRangeLabel={dateRange !== 'all' ? dateRangeLabel : undefined}
                />
                <StatCard
                    title={t('dashboard.drafts')}
                    value={draftSheets}
                    variant="warning"
                    icon={<FileEdit size={20} />}
                    dateRangeLabel={dateRange !== 'all' ? dateRangeLabel : undefined}
                />
                <StatCard
                    title={t('dashboard.quotations')}
                    value={quotationsInRange.length}
                    variant="info"
                    icon={<Receipt size={20} />}
                    dateRangeLabel={dateRange !== 'all' ? dateRangeLabel : undefined}
                />
            </HubStatsGrid>

            {/* Body: recent activity + modules */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Recent Activity — 8/12 */}
                <div
                    className="lg:col-span-8 rounded-2xl overflow-hidden pt-4"
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
                    </div>

                    {/* List */}
                    {recent.length > 0 ? (
                        <div>
                            {recent.map((act) => (
                                <button
                                    key={`${act.type}-${act.id}`}
                                    onClick={() => navigate(act.path)}
                                    className="w-full flex items-center gap-4 px-6 py-4 text-left group transition-colors hover:bg-[var(--surface-3)]"
                                >
                                    {/* Mini cover / Icon container */}
                                    <div
                                        className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-sm font-black select-none relative overflow-hidden"
                                        style={{
                                            background: act.accentColor
                                                ? buildAccentGradient(act.accentColor)
                                                : getCoverGradient(act.title),
                                            color: getAvatarTextColor()
                                        }}
                                    >
                                        {act.type === 'sheet' ? (
                                            act.title.charAt(0).toUpperCase()
                                        ) : (
                                            <Receipt size={16} />
                                        )}
                                        {/* Type indicator dot */}
                                        <div 
                                            className="absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-[var(--surface-2)] rounded-full"
                                            style={{ background: act.color }}
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm truncate" style={{ color: 'var(--ink-0)' }}>
                                            {act.title}
                                        </p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <p className="text-xs font-mono" style={{ color: 'var(--ink-2)' }}>
                                                {new Intl.DateTimeFormat(locale).format(act.date)}
                                            </p>
                                            <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
                                            <p className="text-xs italic truncate" style={{ color: 'var(--ink-2)' }}>
                                                {act.subtitle}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status badge */}
                                    <span
                                        className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex-shrink-0"
                                        style={{
                                            background: act.isFinal
                                                ? 'var(--status-success-bg)'
                                                : 'var(--status-warning-bg)',
                                            color: act.isFinal
                                                ? 'var(--status-success-text)'
                                                : 'var(--status-warning-text)',
                                        }}
                                    >
                                        {act.statusLabel}
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
                                onClick={() => navigate('/fichas-tecnicas')}
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
                                style={ICON_STYLES[mod.variant]}
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
