import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Receipt, Search,
    FileEdit, Send, TrendingUp,
} from 'lucide-react';
import { useI18n } from '../../i18n/i18n.tsx';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/ui/StatCard';
import { StatusToggle, QUOTATION_STATUS_CONFIGS } from '../../components/ui/StatusToggle';
import { HubHeader } from '../../components/ui/hub/HubHeader';
import { HubStatsGrid } from '../../components/ui/hub/HubStatsGrid';
import { HubToolbar } from '../../components/ui/hub/HubToolbar';
import { HubViewToggle, ViewMode } from '../../components/ui/hub/HubViewToggle';
import { usePreferences } from '../../hooks/usePreferences';
import { HubButton } from '../../components/ui/hub/HubButton';
import { HubGridCard, CoverStatusVariant } from '../../components/ui/hub/HubGridCard';
import { HubStatusFilter } from '../../components/ui/hub/HubStatusFilter';
import { HubDateFilter, DateRange, DATE_RANGE_OPTIONS, isWithinDateRange } from '../../components/ui/hub/HubDateFilter';
import { PaymentModelsModal } from '../../components/modals/PaymentModelsModal';
import { QuotationTable } from '../../components/features/Quotations/QuotationTable';
import { Quotation, QuotationStatus } from '../../types';

type FilterStatus = 'all' | QuotationStatus;

// ─── Status variant mapping ────────────────────────────────────
function quotationStatusVariant(status: QuotationStatus): CoverStatusVariant {
    switch (status) {
        case 'APROVADO': return 'green';
        case 'ENVIADO':  return 'blue';
        case 'RECUSADO': return 'red';
        default: return 'gray';
    }
}

// ─── Main page ────────────────────────────────────────────────
export const QuotationsPage: React.FC = () => {
    const { t, locale } = useI18n();
    const { quotations, deleteQuotation, updateQuotationStatus, addToast, isFavorite, toggleFavorite } = useApp();
    const navigate = useNavigate();

    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
    const [dateRange, setDateRange] = useState<DateRange>('all');
    const [isModelsOpen, setIsModelsOpen] = useState(false);
    const { prefs, updatePrefs } = usePreferences();
    const view = prefs.quotationsView as ViewMode;
    const setView = (v: ViewMode) => updatePrefs({ quotationsView: v });
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

    const dateRangeLabel = DATE_RANGE_OPTIONS.find(o => o.value === dateRange)?.label ?? '';

    const statusConfigs = QUOTATION_STATUS_CONFIGS({
        draft: t('quotations.statusDraft'),
        sent: t('quotations.statusSent'),
        approved: t('quotations.statusApproved'),
        rejected: t('quotations.statusRejected'),
    });

    const statusFilterOptions: { value: FilterStatus; label: string }[] = [
        { value: 'all', label: t('quotations.filterAll') },
        { value: 'RASCUNHO', label: t('quotations.filterDraft') },
        { value: 'ENVIADO', label: t('quotations.filterSent') },
        { value: 'APROVADO', label: t('quotations.filterApproved') },
    ];

    const filtered = quotations.filter(q => {
        const matchSearch = !search
            || q.title.toLowerCase().includes(search.toLowerCase())
            || q.clientName.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'all' || q.status === filterStatus;
        const matchDate = isWithinDateRange(q.date, dateRange);
        const matchFav = !showFavoritesOnly || isFavorite(q.id);
        return matchSearch && matchStatus && matchDate && matchFav;
    });

    const handleDeleteSelected = () => {
        selectedIds.forEach(id => deleteQuotation(id));
        addToast(`${selectedIds.size} orçamento(s) excluído(s)`, 'success');
        setSelectedIds(new Set());
    };

    const handleExport = (format: 'pdf' | 'json' | 'xml') => {
        addToast(`Exportação em ${format.toUpperCase()} em breve!`, 'info');
    };

    const sortedFiltered = [...filtered].sort((a, b) => {
        const af = isFavorite(a.id) ? 0 : 1;
        const bf = isFavorite(b.id) ? 0 : 1;
        return af - bf;
    });

    const handleDelete = (id: string) => {
        deleteQuotation(id);
        addToast(t('quotations.deleted'), 'success');
    };

    const toggleSelection = (id: string) => {
        const next = new Set(selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedIds(next);
    };

    const formatCurrency = (v: number) =>
        new Intl.NumberFormat(locale, { style: 'currency', currency: 'BRL' }).format(v);

    // Stats computed over date-filtered quotations
    const statsBase = quotations.filter(q => isWithinDateRange(q.date, dateRange));
    const stats = {
        total: statsBase.length,
        drafts: statsBase.filter(q => q.status === 'RASCUNHO').length,
        sent: statsBase.filter(q => q.status === 'ENVIADO').length,
        approvedTotal: statsBase.filter(q => q.status === 'APROVADO').reduce((s, q) => s + (q.payment?.total || 0), 0),
    };

    // Status label for cover badge
    const statusLabel = (q: Quotation): string => {
        const cfg = statusConfigs.find(c => c.value === q.status);
        return cfg?.label ?? q.status;
    };

    return (
        <div className="p-6 lg:p-8 animate-in fade-in duration-300">

            <HubHeader
                title={t('quotations.pageTitle')}
                subtitle={`${quotations.length} ${quotations.length === 1 ? 'orçamento cadastrado' : 'orçamentos cadastrados'}`}
            />

            {/* KPIs */}
            {quotations.length > 0 && (
                <HubStatsGrid
                    headerRight={
                        <HubDateFilter value={dateRange} onChange={setDateRange} />
                    }
                >
                    <StatCard
                        title="Total de Orçamentos"
                        value={stats.total}
                        icon={<Receipt size={20} />}
                        dateRangeLabel={dateRange !== 'all' ? dateRangeLabel : undefined}
                    />
                    <StatCard
                        title="Aguardando Envio"
                        value={stats.drafts}
                        icon={<FileEdit size={20} />}
                        dateRangeLabel={dateRange !== 'all' ? dateRangeLabel : undefined}
                    />
                    <StatCard
                        title="Aguardando Resposta"
                        value={stats.sent}
                        icon={<Send size={20} />}
                        dateRangeLabel={dateRange !== 'all' ? dateRangeLabel : undefined}
                    />
                    <StatCard
                        title="Receita Aprovada"
                        value={formatCurrency(stats.approvedTotal)}
                        icon={<TrendingUp size={20} />}
                        dateRangeLabel={dateRange !== 'all' ? dateRangeLabel : undefined}
                    />
                </HubStatsGrid>
            )}

            {/* Toolbar */}
            <HubToolbar
                primaryAction={
                    <HubButton
                        variant="primary"
                        label={t('quotations.newQuotation')}
                        onClick={() => navigate('/orcamentos/novo')}
                    />
                }
                secondaryActions={
                    <>
                        <HubButton
                            variant="secondary"
                            label="Assistente de IA"
                            onClick={() => addToast('Geração de orçamentos por IA em breve!', 'info')}
                        />
                        <HubButton
                            variant="secondary"
                            label="Modelos de Pagamento"
                            onClick={() => setIsModelsOpen(true)}
                        />
                    </>
                }
                searchVariant={
                    <div className="relative w-full min-w-[200px]">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--ink-2)' }} />
                        <input
                            className="ds-input w-full pl-9"
                            placeholder={t('quotations.searchPlaceholder')}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                }
                filterViews={
                    <div className="flex items-center gap-2">
                        <HubStatusFilter
                            options={statusFilterOptions}
                            value={filterStatus}
                            onChange={setFilterStatus}
                        />
                        <HubDateFilter value={dateRange} onChange={setDateRange} />
                    </div>
                }
                viewToggle={<HubViewToggle view={view} onChange={setView} />}
                showFavoritesOnly={showFavoritesOnly}
                onToggleFavoritesOnly={() => setShowFavoritesOnly(p => !p)}
                selectionCount={selectedIds.size}
                onClearSelection={() => setSelectedIds(new Set())}
                onDeleteSelected={handleDeleteSelected}
                onExport={handleExport}
            />

            {/* Content */}
            {filtered.length > 0 ? (
                view === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {sortedFiltered.map(q => (
                            <HubGridCard
                                key={q.id}
                                name={q.title}
                                coverAspectRatio="4/3"
                                coverColor={q.accentColor}
                                statusText={statusLabel(q)}
                                statusVariant={quotationStatusVariant(q.status)}
                                onEdit={() => navigate(`/orcamentos/${q.id}/editar`)}
                                onPreview={() => navigate(`/orcamentos/${q.id}/preview`)}
                                onDelete={() => handleDelete(q.id)}
                                selected={selectedIds.has(q.id)}
                                onToggleSelect={() => toggleSelection(q.id)}
                                pinned={isFavorite(q.id)}
                                onTogglePin={() => toggleFavorite(q.id)}
                                infoSlot={
                                    <>
                                        {q.clientName && (
                                            <p className="text-xs truncate -mt-1 mb-1.5" style={{ color: 'var(--ink-1)' }}>
                                                {q.clientName}
                                            </p>
                                        )}
                                        {q.payment.total > 0 && (
                                            <p className="text-base font-black mb-1.5" style={{ color: 'var(--primary)' }}>
                                                {formatCurrency(q.payment.total)}
                                            </p>
                                        )}
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-xs font-mono" style={{ color: 'var(--ink-2)' }}>
                                                {new Intl.DateTimeFormat(locale).format(new Date(q.date))}
                                                {q.items.length > 0 ? ` · ${q.items.length} itens` : ''}
                                            </span>
                                            <StatusToggle
                                                value={q.status}
                                                configs={statusConfigs}
                                                size="sm"
                                                onChange={next => updateQuotationStatus(q.id, next as QuotationStatus)}
                                            />
                                        </div>
                                    </>
                                }
                            />
                        ))}
                    </div>
                ) : (
                    <QuotationTable
                        quotations={filtered}
                        locale={locale}
                        statusConfigs={statusConfigs}
                        selectedIds={selectedIds}
                        onToggleSelect={toggleSelection}
                        onEdit={id => navigate(`/orcamentos/${id}/editar`)}
                        onPreview={id => navigate(`/orcamentos/${id}/preview`)}
                        onDelete={id => handleDelete(id)}
                        onStatusChange={(q, next) => updateQuotationStatus(q.id, next as QuotationStatus)}
                        isFavorite={isFavorite}
                        onTogglePin={toggleFavorite}
                        t={t}
                    />
                )
            ) : quotations.length === 0 ? (
                <div
                    className="flex flex-col items-center justify-center py-24 text-center rounded-2xl border border-dashed"
                    style={{ borderColor: 'var(--border)' }}
                >
                    <Receipt size={40} className="mb-4 opacity-20" style={{ color: 'var(--ink-1)' }} />
                    <p className="font-semibold mb-1" style={{ color: 'var(--ink-1)' }}>{t('quotations.emptyTitle')}</p>
                    <p className="text-sm mb-5" style={{ color: 'var(--ink-2)' }}>{t('quotations.emptyDesc')}</p>
                    <HubButton variant="primary" label={t('quotations.newQuotation')} onClick={() => navigate('/orcamentos/novo')} />
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Search size={32} className="mb-3 opacity-20" style={{ color: 'var(--ink-1)' }} />
                    <p className="text-sm" style={{ color: 'var(--ink-2)' }}>{t('quotations.noResults')}</p>
                    <button
                        onClick={() => { setSearch(''); setFilterStatus('all'); setDateRange('all'); }}
                        className="mt-2 text-sm font-bold hover:underline"
                        style={{ color: 'var(--primary)' }}
                    >
                        {t('quotations.clearFilter')}
                    </button>
                </div>
            )}

            <PaymentModelsModal
                isOpen={isModelsOpen}
                onClose={() => setIsModelsOpen(false)}
            />
        </div>
    );
};
