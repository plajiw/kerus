import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
    Wand2, FileInput, FileJson,
    X, FlaskConical, Eye, Edit3, Search, ChevronDown,
} from 'lucide-react';
import { useI18n } from '../i18n/i18n.tsx';
import { useApp } from '../context/AppContext';
import { AppOutletContext } from '../components/layout/AppLayout';
import { ImportModal, ImportType } from '../components/modals/ImportModal';
import { HintButton } from '../components/ui/HintButton';
import { StatusToggle, FORMULA_STATUS_CONFIGS } from '../components/ui/StatusToggle';

type FilterStatus = 'all' | 'FINAL' | 'RASCUNHO';

// ─── Import dropdown ──────────────────────────────────────────
const ImportDropdown: React.FC<{ onSelect: (type: ImportType) => void }> = ({ onSelect }) => {
    const { t } = useI18n();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
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
                    style={{ background: 'var(--surface-0)', border: '1px solid var(--border)' }}
                >
                    <button
                        onClick={() => { onSelect('xml'); setOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-left transition-colors hover:bg-[var(--surface-2)]"
                        style={{ color: 'var(--ink-0)' }}
                    >
                        <FileInput size={14} className="text-emerald-500" />
                        {t('buttons.importXml')}
                    </button>
                    <button
                        onClick={() => { onSelect('json'); setOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-left transition-colors hover:bg-[var(--surface-2)]"
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

// ─── Main page ────────────────────────────────────────────────
export const FormulasPage: React.FC = () => {
    const { t, locale } = useI18n();
    const { history, deleteRecipe, recipeManager, addToast, saveToHistory } = useApp();
    const { openWizard } = useOutletContext<AppOutletContext>();
    const navigate = useNavigate();

    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
    const [importType, setImportType] = useState<ImportType | null>(null);

    const filtered = history.filter(r => {
        const matchSearch = !search || r.nome_formula.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'all'
            || (filterStatus === 'FINAL' && r.status === 'FINAL')
            || (filterStatus === 'RASCUNHO' && r.status !== 'FINAL');
        return matchSearch && matchStatus;
    });

    const statusConfigs = FORMULA_STATUS_CONFIGS({
        draft: t('status.draft'),
        final: t('status.final'),
    });

    const filterDefs: { value: FilterStatus; label: string }[] = [
        { value: 'all', label: t('formulas.filterAll') },
        { value: 'FINAL', label: t('formulas.filterFinal') },
        { value: 'RASCUNHO', label: t('formulas.filterDraft') },
    ];

    return (
        <div className="p-6 lg:p-8 animate-in fade-in duration-300">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight" style={{ color: 'var(--ink-0)' }}>
                        {t('nav.formulas')}
                    </h1>
                    <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--ink-2)' }}>
                        {history.length} {t('history.count')}
                    </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                        onClick={() => navigate('/formulas/nova')}
                        className="ds-button-primary"
                    >
                        {t('buttons.newSheet')}
                    </button>
                    <HintButton hint={t('hints.newFormula')} />
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
                <div className="flex items-center gap-1">
                    <button onClick={openWizard} className="ds-button text-xs">
                        {t('buttons.openWizard')}
                    </button>
                    <HintButton hint={t('hints.wizard')} />
                </div>
                <div className="flex items-center gap-1">
                    <ImportDropdown onSelect={type => setImportType(type)} />
                    <HintButton hint={t('hints.import')} />
                </div>
            </div>

            {/* Search + Filter */}
            {history.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1 max-w-xs">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--ink-2)' }} />
                        <input
                            className="ds-input w-full pl-9"
                            placeholder={t('formulas.searchPlaceholder')}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1 rounded-lg p-1" style={{ background: 'var(--surface-2)' }}>
                            {filterDefs.map(f => (
                                <button
                                    key={f.value}
                                    onClick={() => setFilterStatus(f.value)}
                                    className="px-3 py-1.5 rounded-md text-xs font-semibold transition-all"
                                    style={filterStatus === f.value
                                        ? { background: 'var(--surface-0)', color: 'var(--ink-0)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }
                                        : { color: 'var(--ink-2)' }
                                    }
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                        <HintButton hint={t('hints.filterStatus')} />
                    </div>
                </div>
            )}

            {/* Formula Grid */}
            {filtered.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filtered.map((recipe) => (
                        <div
                            key={recipe.id}
                            className="group relative rounded-2xl border transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
                            style={{ background: 'var(--surface-0)', borderColor: 'var(--border)' }}
                        >
                            {/* Delete */}
                            <button
                                onClick={(e) => { e.stopPropagation(); deleteRecipe(recipe.id); }}
                                className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-100 dark:hover:bg-red-900/30"
                                style={{ color: 'var(--ink-2)' }}
                            >
                                <X size={12} />
                            </button>

                            <div className="p-5">
                                {/* Avatar */}
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm mb-4"
                                    style={{ background: 'var(--surface-2)', color: 'var(--ink-1)' }}
                                >
                                    {recipe.nome_formula.charAt(0).toUpperCase()}
                                </div>

                                {/* Title */}
                                <h3 className="font-bold text-base truncate mb-1 pr-6" style={{ color: 'var(--ink-0)' }}>
                                    {recipe.nome_formula}
                                </h3>
                                <p className="text-xs font-mono mb-3" style={{ color: 'var(--ink-2)' }}>
                                    {new Intl.DateTimeFormat(locale).format(new Date(recipe.data))}
                                    {' · '}{recipe.ingredientes.length} {t('editor.item')}
                                </p>

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                                    {/* Status toggle inline */}
                                    <StatusToggle
                                        value={recipe.status ?? 'RASCUNHO'}
                                        configs={statusConfigs}
                                        size="sm"
                                        onChange={next => saveToHistory({ ...recipe, status: next })}
                                    />

                                    {/* Actions */}
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => navigate(`/formulas/${recipe.id}/editar`)}
                                            className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--surface-2)]"
                                            style={{ color: 'var(--ink-2)' }}
                                            title={t('common.edit')}
                                        >
                                            <Edit3 size={13} />
                                        </button>
                                        <button
                                            onClick={() => navigate(`/formulas/${recipe.id}/preview`)}
                                            className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
                                            style={{ color: 'var(--primary)' }}
                                            title={t('common.preview')}
                                        >
                                            <Eye size={13} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center rounded-2xl border border-dashed" style={{ borderColor: 'var(--border)' }}>
                    <FlaskConical size={40} className="mb-4 opacity-20" style={{ color: 'var(--ink-1)' }} />
                    <p className="font-semibold mb-1" style={{ color: 'var(--ink-1)' }}>{t('formulas.emptyTitle')}</p>
                    <p className="text-sm mb-5" style={{ color: 'var(--ink-2)' }}>{t('formulas.emptyDesc')}</p>
                    <button
                        onClick={() => navigate('/formulas/nova')}
                        className="ds-button-primary"
                    >
                        {t('buttons.newSheet')}
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Search size={32} className="mb-3 opacity-20" style={{ color: 'var(--ink-1)' }} />
                    <p className="text-sm" style={{ color: 'var(--ink-2)' }}>{t('formulas.noResults')}</p>
                    <button
                        onClick={() => { setSearch(''); setFilterStatus('all'); }}
                        className="mt-2 text-sm font-bold hover:underline"
                        style={{ color: 'var(--primary)' }}
                    >
                        {t('formulas.clearFilter')}
                    </button>
                </div>
            )}

            {/* Modals */}
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
