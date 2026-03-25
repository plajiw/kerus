import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
    Wand2, FileInput, FileJson, X, FlaskConical,
    Eye, Edit3, Search, ChevronDown, CheckCircle2, Clock,
} from 'lucide-react';
import { useI18n } from '../i18n/i18n.tsx';
import { useApp } from '../context/AppContext';
import { AppOutletContext } from '../components/layout/AppLayout';
import { ImportModal, ImportType } from '../components/modals/ImportModal';
import { StatCard } from '../components/ui/StatCard';
import { StatusToggle, FORMULA_STATUS_CONFIGS } from '../components/ui/StatusToggle';
import { HubHeader } from '../components/ui/hub/HubHeader';
import { HubStatsGrid } from '../components/ui/hub/HubStatsGrid';
import { HubToolbar } from '../components/ui/hub/HubToolbar';
import { HubViewToggle, ViewMode } from '../components/ui/hub/HubViewToggle';
import { HubGridCard, CoverStatusVariant } from '../components/ui/hub/HubGridCard';
import { HubStatusFilter } from '../components/ui/hub/HubStatusFilter';
import { HubDateFilter, DateRange, DATE_RANGE_OPTIONS, isWithinDateRange } from '../components/ui/hub/HubDateFilter';
import { getCoverGradient } from '../utils/coverGradient';
import { Recipe } from '../types';

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
                    className="absolute top-full left-0 mt-1.5 w-44 rounded-xl shadow-lg z-50 overflow-hidden py-1"
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

// ─── Table view ───────────────────────────────────────────────
interface FormulaTableProps {
    recipes: Recipe[];
    locale: string;
    statusConfigs: ReturnType<typeof FORMULA_STATUS_CONFIGS>;
    onEdit: (id: string) => void;
    onPreview: (id: string) => void;
    onDelete: (id: string) => void;
    onStatusChange: (recipe: Recipe, next: string) => void;
    t: (k: string) => string;
}

const FormulaTable: React.FC<FormulaTableProps> = ({
    recipes, locale, statusConfigs, onEdit, onPreview, onDelete, onStatusChange, t,
}) => (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface-2)' }}>
        <table className="w-full text-left border-collapse">
            <thead>
                <tr style={{ background: 'var(--surface-3)' }}>
                    <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--ink-2)' }}>
                        Fórmula
                    </th>
                    <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--ink-2)' }}>
                        Status
                    </th>
                    <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest hidden md:table-cell" style={{ color: 'var(--ink-2)' }}>
                        Ingredientes
                    </th>
                    <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest hidden lg:table-cell" style={{ color: 'var(--ink-2)' }}>
                        Data
                    </th>
                    <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-right" style={{ color: 'var(--ink-2)' }}>
                        Ações
                    </th>
                </tr>
            </thead>
            <tbody>
                {recipes.map((recipe) => (
                    <tr
                        key={recipe.id}
                        className="group border-t transition-colors hover:bg-[var(--surface-3)]"
                        style={{ borderColor: 'rgba(72,72,71,0.15)' }}
                    >
                        <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-black text-white select-none"
                                    style={{ background: getCoverGradient(recipe.nome_formula) }}
                                >
                                    {recipe.nome_formula.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-semibold text-sm" style={{ color: 'var(--ink-0)' }}>
                                    {recipe.nome_formula}
                                </span>
                            </div>
                        </td>
                        <td className="px-5 py-4">
                            <StatusToggle
                                value={recipe.status ?? 'RASCUNHO'}
                                configs={statusConfigs}
                                size="sm"
                                onChange={(next) => onStatusChange(recipe, next)}
                            />
                        </td>
                        <td className="px-5 py-4 hidden md:table-cell">
                            <span className="text-sm" style={{ color: 'var(--ink-2)' }}>
                                {recipe.ingredientes.length} itens
                            </span>
                        </td>
                        <td className="px-5 py-4 hidden lg:table-cell">
                            <span className="text-sm font-mono" style={{ color: 'var(--ink-2)' }}>
                                {new Intl.DateTimeFormat(locale).format(new Date(recipe.data))}
                            </span>
                        </td>
                        <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-1">
                                <button onClick={() => onEdit(recipe.id)} className="ds-icon-button" title={t('common.edit')}>
                                    <Edit3 size={14} />
                                </button>
                                <button onClick={() => onPreview(recipe.id)} className="ds-icon-button" style={{ color: 'var(--primary)' }} title={t('common.preview')}>
                                    <Eye size={14} />
                                </button>
                                <button onClick={() => onDelete(recipe.id)} className="ds-icon-button" style={{ color: 'var(--ink-2)' }} title="Excluir">
                                    <X size={14} />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

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
        <p className="text-sm" style={{ color: 'var(--ink-2)' }}>{t('formulas.noResults')}</p>
        <button onClick={onClear} className="mt-2 text-sm font-bold hover:underline" style={{ color: 'var(--primary)' }}>
            {t('formulas.clearFilter')}
        </button>
    </div>
);

// ─── Status variant helper ────────────────────────────────────
function formulaStatusVariant(status: string | undefined): CoverStatusVariant {
    return status === 'FINAL' ? 'green' : 'gray';
}

// ─── Main page ────────────────────────────────────────────────
export const FormulasPage: React.FC = () => {
    const { t, locale } = useI18n();
    const { history, deleteRecipe, recipeManager, addToast, saveToHistory } = useApp();
    const { openWizard } = useOutletContext<AppOutletContext>();
    const navigate = useNavigate();

    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
    const [dateRange, setDateRange] = useState<DateRange>('all');
    const [importType, setImportType] = useState<ImportType | null>(null);
    const [view, setView] = useState<ViewMode>('grid');

    const dateRangeLabel = DATE_RANGE_OPTIONS.find(o => o.value === dateRange)?.label ?? '';

    const filtered = history.filter(r => {
        const matchSearch = !search || r.nome_formula.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'all'
            || (filterStatus === 'FINAL' && r.status === 'FINAL')
            || (filterStatus === 'RASCUNHO' && r.status !== 'FINAL');
        const matchDate = isWithinDateRange(r.data, dateRange);
        return matchSearch && matchStatus && matchDate;
    });

    const statusConfigs = FORMULA_STATUS_CONFIGS({
        draft: t('status.draft'),
        final: t('status.final'),
    });

    const statusFilterOptions: { value: FilterStatus; label: string }[] = [
        { value: 'all', label: t('formulas.filterAll') },
        { value: 'FINAL', label: t('formulas.filterFinal') },
        { value: 'RASCUNHO', label: t('formulas.filterDraft') },
    ];

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
                title={t('nav.formulas')}
                subtitle={`${history.length} ${history.length === 1 ? 'fórmula cadastrada' : 'fórmulas cadastradas'}`}
            />

            {/* KPIs */}
            {history.length > 0 && (
                <HubStatsGrid
                    headerRight={
                        <HubDateFilter value={dateRange} onChange={setDateRange} />
                    }
                >
                    <StatCard
                        title="Total de Fórmulas"
                        value={stats.total}
                        icon={<FlaskConical size={20} />}
                        dateRangeLabel={dateRange !== 'all' ? dateRangeLabel : undefined}
                    />
                    <StatCard
                        title="Fórmulas Finais"
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
                        subtitle="Últimos 7 dias"
                    />
                </HubStatsGrid>
            )}

            {/* Toolbar */}
            <HubToolbar
                primaryAction={
                    <button onClick={() => navigate('/formulas/nova')} className="ds-button-primary">
                        Nova Ficha
                    </button>
                }
                secondaryActions={
                    <>
                        <button onClick={openWizard} className="ds-button text-xs">
                            <Wand2 size={14} />
                            Criar com IA
                        </button>
                        <ImportDropdown onSelect={type => setImportType(type)} />
                    </>
                }
                searchVariant={
                    <div className="relative w-full min-w-[200px]">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--ink-2)' }} />
                        <input
                            className="ds-input w-full pl-9"
                            placeholder={t('formulas.searchPlaceholder')}
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
            />

            {/* Content */}
            {filtered.length > 0 ? (
                view === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filtered.map((recipe) => (
                            <HubGridCard
                                key={recipe.id}
                                name={recipe.nome_formula}
                                coverAspectRatio="4/3"
                                statusText={recipe.status === 'FINAL' ? t('status.final') : t('status.draft')}
                                statusVariant={formulaStatusVariant(recipe.status)}
                                onEdit={() => navigate(`/formulas/${recipe.id}/editar`)}
                                onPreview={() => navigate(`/formulas/${recipe.id}/preview`)}
                                onDelete={() => deleteRecipe(recipe.id)}
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
                    <FormulaTable
                        recipes={filtered}
                        locale={locale}
                        statusConfigs={statusConfigs}
                        onEdit={id => navigate(`/formulas/${id}/editar`)}
                        onPreview={id => navigate(`/formulas/${id}/preview`)}
                        onDelete={id => deleteRecipe(id)}
                        onStatusChange={(recipe, next) => saveToHistory({ ...recipe, status: next as any })}
                        t={t}
                    />
                )
            ) : history.length === 0 ? (
                <EmptyCreate
                    label={t('formulas.emptyTitle')}
                    desc={t('formulas.emptyDesc')}
                    btnLabel={t('buttons.newSheet')}
                    onAction={() => navigate('/formulas/nova')}
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
                        navigate(`/formulas/${recipe.id}/preview`);
                    }}
                    onError={() => addToast(t('messages.invalidJson'), 'error')}
                    sanitizeRecipe={recipeManager.sanitizeRecipe}
                />
            )}
        </div>
    );
};
