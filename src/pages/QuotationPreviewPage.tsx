import React, { useRef, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit3, FileDown, Printer } from 'lucide-react';
import { useI18n } from '../i18n/i18n.tsx';
import { useApp } from '../context/AppContext';
import { QuotationPrintable } from '../components/QuotationPrintable';
import { StatusToggle, QUOTATION_STATUS_CONFIGS } from '../components/ui/StatusToggle';
import { HintButton } from '../components/ui/HintButton';
import { QuotationStatus } from '../types';

export const QuotationPreviewPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useI18n();
    const { quotations, updateQuotationStatus, addToast } = useApp();
    const previewRef = useRef<HTMLDivElement>(null);

    const quotation = quotations.find(q => q.id === id);

    const fileBaseName = useMemo(() => {
        if (!quotation) return 'orcamento';
        const safe = quotation.title
            .normalize('NFKD')
            .replace(/[^\w\s-]/g, '')
            .trim()
            .replace(/\s+/g, '_');
        return `Orcamento_${safe}_${quotation.date}`;
    }, [quotation]);

    if (!quotation) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center p-6">
                <p className="text-sm mb-4" style={{ color: 'var(--ink-2)' }}>Orçamento não encontrado.</p>
                <button onClick={() => navigate('/orcamentos')} className="ds-button-primary">
                    {t('quotations.pageTitle')}
                </button>
            </div>
        );
    }

    const handleExportPDF = () => {
        const target = previewRef.current;
        if (!target) return;

        const headStyles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
            .map(n => n.outerHTML).join('');

        const html = `<!doctype html>
<html lang="${document.documentElement.lang || 'pt-BR'}">
<head>
  <meta charset="utf-8" />
  <title>${fileBaseName}</title>${headStyles}
  <style>html,body{margin:0;padding:0;background:#fff;}@page{size:A4;margin:0;}</style>
</head>
<body>${target.innerHTML}</body></html>`;

        const iframe = document.createElement('iframe');
        iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;opacity:0;';
        iframe.setAttribute('aria-hidden', 'true');
        document.body.appendChild(iframe);
        const win = iframe.contentWindow;
        if (!win) { iframe.remove(); addToast(t('messages.exportToolsMissing'), 'error'); return; }
        win.document.open(); win.document.write(html); win.document.close();
        iframe.onload = () => {
            win.requestAnimationFrame(() => setTimeout(() => {
                win.focus(); win.print();
                win.onafterprint = () => iframe.remove();
            }, 150));
        };
    };

    const handleExportJSON = () => {
        const blob = new Blob([JSON.stringify(quotation, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileBaseName}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const statusConfigs = QUOTATION_STATUS_CONFIGS({
        draft: t('quotations.statusDraft'),
        sent: t('quotations.statusSent'),
        approved: t('quotations.statusApproved'),
        rejected: t('quotations.statusRejected'),
    });

    return (
        <div className="max-w-[210mm] mx-auto flex flex-col items-center py-6 px-4 animate-in zoom-in-95 duration-300">

            {/* Toolbar */}
            <div className="w-full no-print mb-5">
                {/* Top row */}
                <div className="flex items-center gap-3 mb-3">
                    <button onClick={() => navigate('/orcamentos')} className="ds-icon-button" title={t('common.back')}>
                        <ArrowLeft size={14} />
                    </button>
                    <span className="text-xs font-mono truncate flex-1" style={{ color: 'var(--ink-2)' }}>
                        {fileBaseName}.pdf
                    </span>
                    <div className="flex items-center gap-1.5">
                        <StatusToggle
                            value={quotation.status}
                            configs={statusConfigs}
                            onChange={v => updateQuotationStatus(quotation.id, v as QuotationStatus)}
                        />
                        <HintButton hint={t('hints.statusBadge')} />
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={() => navigate(`/orcamentos/${quotation.id}/editar`)}
                        className="ds-button flex items-center gap-1.5 text-sm"
                    >
                        <Edit3 size={13} /> {t('quotations.editQuotation')}
                    </button>
                    <button onClick={handleExportPDF} className="ds-button-primary flex items-center gap-1.5 text-sm">
                        <FileDown size={13} /> {t('quotations.exportPdf')}
                    </button>
                    <button onClick={handleExportJSON} className="ds-button flex items-center gap-1.5 text-sm">
                        <FileDown size={13} /> {t('quotations.exportJson')}
                    </button>
                    <button onClick={() => window.print()} className="ds-button flex items-center gap-1.5 text-sm">
                        <Printer size={13} /> {t('buttons.print')}
                    </button>
                </div>
            </div>

            {/* Preview card */}
            <div className="w-full rounded-2xl border overflow-hidden shadow-sm" style={{ borderColor: 'var(--border)' }}>
                <div ref={previewRef}>
                    <QuotationPrintable quotation={quotation} mode="print" />
                </div>
            </div>
        </div>
    );
};
