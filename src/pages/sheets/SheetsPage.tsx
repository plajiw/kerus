import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
    FileInput, FileJson, FlaskConical,
    Edit3, Search, ChevronDown, CheckCircle2, Clock,
} from 'lucide-react';
import { useI18n } from '../../i18n/i18n.tsx';
import { useApp } from '../../context/AppContext.tsx';
import { AppOutletContext } from '../../components/layout/AppLayout.tsx';
import { SheetTable } from '../../components/features/Sheets/SheetTable.tsx';
import { ImportModal, ImportType } from '../../components/modals/ImportModal.tsx';
import { StatCard } from '../../components/ui/StatCard.tsx';
import { StatusToggle, FORMULA_STATUS_CONFIGS } from '../../components/ui/StatusToggle.tsx';
import { HubHeader } from '../../components/ui/hub/HubHeader.tsx';
import { HubStatsGrid } from '../../components/ui/hub/HubStatsGrid.tsx';
import { HubToolbar } from '../../components/ui/hub/HubToolbar.tsx';
import { HubViewToggle, ViewMode } from '../../components/ui/hub/HubViewToggle.tsx';
import { usePreferences } from '../../hooks/usePreferences.ts';
import { HubButton } from '../../components/ui/hub/HubButton.tsx';
import { HubGridCard, CoverStatusVariant } from '../../components/ui/hub/HubGridCard.tsx';
import { buildAccentGradient } from '../../utils/coverGradient';
import { HubStatusFilter } from '../../components/ui/hub/HubStatusFilter.tsx';
import { HubDateFilter, DateRange, DATE_RANGE_OPTIONS, isWithinDateRange } from '../../components/ui/hub/HubDateFilter.tsx';
import { Recipe } from '../../types/index.ts';

type FilterStatus = 'all' | 'FINAL' | 'RASCUNHO';

// ─── Import dropdown ──────────────────────────────────────────
const ImportDropdown: React.FC<{ onSelect: (type: ImportType) => void }> = ({ onSelect }) => {
    const { t } = useI18n();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const h = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, [open]);

    return (
        <div ref={ref} className="relative">
            <button onClick={() => setOpen(p => !p)} className="ds-button flex items-center gap-1.5 text-xs">
                {t('import.button')}
                <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
                <div
                    className="absolute top-full left-0 mt-1.5 w-44 rounded-xl z-50 overflow-hidden py-1"
                    style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
                >
                    <button
                        onClick={() => { onSelect('xml'); setOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-left transition-colors hover:bg-[var(--surface-3)]"
                        style={{ color: 'var(--ink-0)' }}
                    >
                        <FileInput size={14} className="text-emerald-500" />
                        {t('buttons.importXml')}
                    </button>
                    <button
                        onClick={() => { onSelect('json'); setOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-left transition-colors hover:bg-[var(--surface-3)]"
                        style={{ color: 'var(--ink-0)' }}
                    >
                        <FileJson size={14} className="text-sky-500" />
                        {t('buttons.importJson')}
                    </button>
                </div>
            )}
        </div>
    );
};

// ─── Empty states ─────────────────────────────────────────────
const EmptyCreate: React.FC<{ label: string; desc: string; btnLabel: string; onAction: () => void }> = ({
    label, desc, btnLabel, onAction,
}) => (
    <div
        className="flex flex-col items-center justify-center py-24 text-center rounded-2xl border border-dashed"
        style={{ borderColor: 'var(--border)' }}
    >
        <FlaskConical size={40} className="mb-4 opacity-20" style={{ color: 'var(--ink-1)' }} />
        <p className="font-semibold mb-1" style={{ color: 'var(--ink-1)' }}>{label}</p>
        <p className="text-sm mb-5" style={{ color: 'var(--ink-2)' }}>{desc}</p>
        <button onClick={onAction} className="ds-button-primary">{btnLabel}</button>
    </div>
);

const EmptySearch: React.FC<{ onClear: () => void; t: (k: string) => string }> = ({ onClear, t }) => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
        <Search size={32} className="mb-3 opacity-20" style={{ color: 'var(--ink-1)' }} />
        <p className="text-sm" style={{ color: 'var(--ink-2)' }}>{t('sheets.noResults')}</p>
        <button onClick={onClear} className="mt-2 text-sm font-bold hover:underline" style={{ color: 'var(--primary)' }}>
            {t('sheets.clearFilter')}
        </button>
    </div>
);

// ─── Status variant helper ────────────────────────────────────
function sheetStatusVariant(status: string | undefined): CoverStatusVariant {
    return status === 'FINAL' ? 'green' : 'gray';
}

// ─── Main page ────────────────────────────────────────────────
export const SheetsPage: React.FC = () => {
    const { t, locale } = useI18n();
    const { history, deleteRecipe, recipeManager, addToast, saveToHistory, isFavorite, toggleFavorite } = useApp();
    const { openWizard } = useOutletContext<AppOutletContext>();
    const navigate = useNavigate();

    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
    const [dateRange, setDateRange] = useState<DateRange>('all');
    const [importType, setImportType] = useState<ImportType | null>(null);
    const { prefs, updatePrefs } = usePreferences();
    const view = prefs.sheetsView as ViewMode;
    const setView = (v: ViewMode) => updatePrefs({ sheetsView: v });
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

    const dateRangeLabel = DATE_RANGE_OPTIONS.find(o => o.value === dateRange)?.label ?? '';

    const toggleSelection = (id: string) => {
        const next = new Set(selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedIds(next);
    };

    const filtered = history.filter(r => {
        const matchSearch = !search || r.nome_formula.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'all'
            || (filterStatus === 'FINAL' && r.status === 'FINAL')
            || (filterStatus === 'RASCUNHO' && r.status !== 'FINAL');
        const matchDate = isWithinDateRange(r.data, dateRange);
        const matchFav = !showFavoritesOnly || isFavorite(r.id);
        return matchSearch && matchStatus && matchDate && matchFav;
    });

    const handleDeleteSelected = () => {
        selectedIds.forEach(id => deleteRecipe(id));
        addToast(`${selectedIds.size} ficha(s) excluída(s)`, 'success');
        setSelectedIds(new Set());
    };

    const handleExport = (format: 'pdf' | 'json' | 'xml') => {
        addToast(`Exportação em ${format.toUpperCase()} em breve!`, 'info');
    };

    const statusConfigs = FORMULA_STATUS_CONFIGS({
        draft: t('status.draft'),
        final: t('status.final'),
    });

    const statusFilterOptions: { value: FilterStatus; label: string }[] = [
        { value: 'all', label: t('sheets.filterAll') },
        { value: 'FINAL', label: t('sheets.filterFinal') },
        { value: 'RASCUNHO', label: t('sheets.filterDraft') },
    ];

    const sortedFiltered = [...filtered].sort((a, b) => {
        const af = isFavorite(a.id) ? 0 : 1;
        const bf = isFavorite(b.id) ? 0 : 1;
        return af - bf;
    });

    // Stats computed over date-filtered history
    const statsBase = history.filter(r => isWithinDateRange(r.data, dateRange));
    const stats = {
        total: statsBase.length,
        final: statsBase.filter(r => r.status === 'FINAL').length,
        draft: statsBase.filter(r => r.status !== 'FINAL').length,
        recent: history.filter(r => {
            const diff = (Date.now() - new Date(r.data).getTime()) / 86400000;
            return diff <= 7;
        }).length,
    };

    return (
        <div className="p-6 lg:p-8 animate-in fade-in duration-300">

            <HubHeader
                title={t('nav.sheets')}
                subtitle={`${history.length} ${history.length === 1 ? 'ficha cadastrada' : 'fichas cadastradas'}`}
            />

            {/* KPIs */}
            {history.length > 0 && (
                <HubStatsGrid
                    headerRight={
                        <HubDateFilter value={dateRange} onChange={setDateRange} />
                    }
                >
                    <StatCard
                        title="Total de Fichas"
                        value={stats.total}
                        icon={<FlaskConical size={20} />}
                        dateRangeLabel={dateRange !== 'all' ? dateRangeLabel : undefined}
                    />
                    <StatCard
                        title="Fichas Finais"
                        value={stats.final}
                        icon={<CheckCircle2 size={20} />}
                        dateRangeLabel={dateRange !== 'all' ? dateRangeLabel : undefined}
                    />
                    <StatCard
                        title="Em Rascunho"
                        value={stats.draft}
                        icon={<Edit3 size={20} />}
                        dateRangeLabel={dateRange !== 'all' ? dateRangeLabel : undefined}
                    />
                    <StatCard
                        title="Atualizadas Recente"
                        value={stats.recent}
                        icon={<Clock size={20} />}
                        dateRangeLabel={dateRange !== 'all' ? dateRangeLabel : undefined}
                    />
                </HubStatsGrid>
            )}

            {/* Toolbar */}
            <HubToolbar
                primaryAction={
                    <HubButton variant="primary" label="Nova Ficha" onClick={() => navigate('/fichas-tecnicas/nova')} />
                }
                secondaryActions={
                    <>
                        <HubButton variant="secondary" label="Criar com IA" onClick={openWizard} />
                        <ImportDropdown onSelect={type => setImportType(type)} />
                    </>
                }
                searchVariant={
                    <div className="relative w-full min-w-[200px]">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--ink-2)' }} />
                        <input
                            className="ds-input w-full pl-9"
                            placeholder={t('sheets.searchPlaceholder')}
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
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                        {sortedFiltered.map((recipe) => (
                            <HubGridCard
                                key={recipe.id}
                                name={recipe.nome_formula}
                                coverAspectRatio="16/9"
                                coverColor={recipe.accentColor ? buildAccentGradient(recipe.accentColor) : undefined}
                                statusText={recipe.status === 'FINAL' ? t('status.final') : t('status.draft')}
                                statusVariant={sheetStatusVariant(recipe.status)}
                                onEdit={() => navigate(`/fichas-tecnicas/${recipe.id}/editar`)}
                                onPreview={() => navigate(`/fichas-tecnicas/${recipe.id}/preview`)}
                                onDelete={() => deleteRecipe(recipe.id)}
                                selected={selectedIds.has(recipe.id)}
                                onToggleSelect={() => toggleSelection(recipe.id)}
                                pinned={isFavorite(recipe.id)}
                                onTogglePin={() => toggleFavorite(recipe.id)}
                                infoSlot={
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-xs font-mono flex-shrink-0" style={{ color: 'var(--ink-2)' }}>
                                            {new Intl.DateTimeFormat(locale).format(new Date(recipe.data))}
                                            {' · '}{recipe.ingredientes.length} itens
                                        </span>
                                        <StatusToggle
                                            value={recipe.status ?? 'RASCUNHO'}
                                            configs={statusConfigs}
                                            size="sm"
                                            onChange={next => saveToHistory({ ...recipe, status: next as any })}
                                        />
                                    </div>
                                }
                            />
                        ))}
                    </div>
                ) : (
                    <SheetTable
                        recipes={filtered}
                        locale={locale}
                        statusConfigs={statusConfigs}
                        selectedIds={selectedIds}
                        onToggleSelect={toggleSelection}
                        onEdit={id => navigate(`/fichas-tecnicas/${id}/editar`)}
                        onPreview={id => navigate(`/fichas-tecnicas/${id}/preview`)}
                        onDelete={id => deleteRecipe(id)}
                        onStatusChange={(recipe, next) => saveToHistory({ ...recipe, status: next as any })}
                        isFavorite={isFavorite}
                        onTogglePin={toggleFavorite}
                        t={t}
                    />
                )
            ) : history.length === 0 ? (
                <EmptyCreate
                    label={t('sheets.emptyTitle')}
                    desc={t('sheets.emptyDesc')}
                    btnLabel={t('buttons.newSheet')}
                    onAction={() => navigate('/fichas-tecnicas/nova')}
                />
            ) : (
                <EmptySearch onClear={() => { setSearch(''); setFilterStatus('all'); setDateRange('all'); }} t={t} />
            )}

            {/* Import modal */}
            {importType && (
                <ImportModal
                    type={importType}
                    isOpen={true}
                    onClose={() => setImportType(null)}
                    onSuccess={(recipe) => {
                        saveToHistory(recipe);
                        navigate(`/fichas-tecnicas/${recipe.id}/preview`);
                    }}
                    onError={() => addToast(t('messages.invalidJson'), 'error')}
                    sanitizeRecipe={recipeManager.sanitizeRecipe}
                />
            )}
        </div>
    );
};
