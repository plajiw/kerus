import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Receipt, Plus, Wand2, Search, X, Eye, Edit3 } from 'lucide-react';
import { useI18n } from '../i18n/i18n.tsx';
import { useApp } from '../context/AppContext';
import { HintButton } from '../components/ui/HintButton';
import { StatusToggle, QUOTATION_STATUS_CONFIGS } from '../components/ui/StatusToggle';
import { AppOutletContext } from '../components/layout/AppLayout';
import { Quotation, QuotationStatus } from '../types';

type FilterStatus = 'all' | QuotationStatus;

export const QuotationsPage: React.FC = () => {
    const { t, locale } = useI18n();
    const { quotations, deleteQuotation, updateQuotationStatus, addToast } = useApp();
    const { openWizard } = useOutletContext<AppOutletContext>();
    const navigate = useNavigate();

    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

    const filters: { value: FilterStatus; label: string }[] = [
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
        return matchSearch && matchStatus;
    });

    const statusConfigs = QUOTATION_STATUS_CONFIGS({
        draft: t('quotations.statusDraft'),
        sent: t('quotations.statusSent'),
        approved: t('quotations.statusApproved'),
        rejected: t('quotations.statusRejected'),
    });

    const handleDelete = (id: string) => {
        deleteQuotation(id);
        addToast(t('quotations.deleted'), 'success');
    };

    return (
        <div className="p-6 lg:p-8 animate-in fade-in duration-300">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight" style={{ color: 'var(--ink-0)' }}>
                        {t('quotations.pageTitle')}
                    </h1>
                    <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--ink-2)' }}>
                        {quotations.length} {t('quotations.items')}
                    </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                        onClick={() => navigate('/orcamentos/novo')}
                        className="ds-button-primary flex items-center gap-2"
                    >
                        <Plus size={15} />
                        {t('quotations.newQuotation')}
                    </button>
                    <HintButton hint={t('hints.newQuotation')} />
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
                <div className="flex items-center gap-1">
                    <button onClick={openWizard} className="ds-button flex items-center gap-1.5 text-xs">
                        <Wand2 size={13} style={{ color: '#6366f1' }} />
                        {t('buttons.openWizard')}
                    </button>
                    <HintButton hint={t('hints.quotationAI')} />
                </div>
            </div>

            {/* Search + filter */}
            {quotations.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1 max-w-xs">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--ink-2)' }} />
                        <input
                            className="ds-input w-full pl-9"
                            placeholder={t('quotations.searchPlaceholder')}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-1 rounded-lg p-1" style={{ background: 'var(--surface-2)' }}>
                        {filters.map(f => (
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
                </div>
            )}

            {/* Cards grid */}
            {filtered.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filtered.map(q => (
                        <div
                            key={q.id}
                            className="group relative rounded-2xl border transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
                            style={{ background: 'var(--surface-0)', borderColor: 'var(--border)' }}
                        >
                            {/* Delete */}
                            <button
                                onClick={() => handleDelete(q.id)}
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
                                    {q.title.charAt(0).toUpperCase() || <Receipt size={16} />}
                                </div>

                                {/* Info */}
                                <h3 className="font-bold text-base truncate mb-0.5 pr-6" style={{ color: 'var(--ink-0)' }}>
                                    {q.title}
                                </h3>
                                {q.clientName && (
                                    <p className="text-xs truncate mb-0.5" style={{ color: 'var(--ink-1)' }}>{q.clientName}</p>
                                )}
                                <p className="text-xs font-mono mb-3" style={{ color: 'var(--ink-2)' }}>
                                    {new Intl.DateTimeFormat(locale).format(new Date(q.date))}
                                    {q.items.length > 0 ? ` · ${q.items.length} ${t('quotations.items')}` : ''}
                                </p>

                                {/* Total value */}
                                {q.payment.total > 0 && (
                                    <p className="text-sm font-black mb-3" style={{ color: 'var(--primary)' }}>
                                        {new Intl.NumberFormat(locale, { style: 'currency', currency: 'BRL' }).format(q.payment.total)}
                                    </p>
                                )}

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                                    <StatusToggle
                                        value={q.status}
                                        configs={statusConfigs}
                                        size="sm"
                                        onChange={next => updateQuotationStatus(q.id, next as QuotationStatus)}
                                    />
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => navigate(`/orcamentos/${q.id}/editar`)}
                                            className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--surface-2)]"
                                            style={{ color: 'var(--ink-2)' }}
                                            title={t('quotations.editQuotation')}
                                        >
                                            <Edit3 size={13} />
                                        </button>
                                        <button
                                            onClick={() => navigate(`/orcamentos/${q.id}/preview`)}
                                            className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
                                            style={{ color: 'var(--primary)' }}
                                            title="Preview"
                                        >
                                            <Eye size={13} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : quotations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center rounded-2xl border border-dashed" style={{ borderColor: 'var(--border)' }}>
                    <Receipt size={40} className="mb-4 opacity-20" style={{ color: 'var(--ink-1)' }} />
                    <p className="font-semibold mb-1" style={{ color: 'var(--ink-1)' }}>{t('quotations.emptyTitle')}</p>
                    <p className="text-sm mb-5" style={{ color: 'var(--ink-2)' }}>{t('quotations.emptyDesc')}</p>
                    <button onClick={() => navigate('/orcamentos/novo')} className="ds-button-primary flex items-center gap-2">
                        <Plus size={14} /> {t('quotations.newQuotation')}
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Search size={32} className="mb-3 opacity-20" style={{ color: 'var(--ink-1)' }} />
                    <p className="text-sm" style={{ color: 'var(--ink-2)' }}>{t('quotations.noResults')}</p>
                    <button
                        onClick={() => { setSearch(''); setFilterStatus('all'); }}
                        className="mt-2 text-sm font-bold hover:underline"
                        style={{ color: 'var(--primary)' }}
                    >
                        {t('quotations.clearFilter')}
                    </button>
                </div>
            )}
        </div>
    );
};
