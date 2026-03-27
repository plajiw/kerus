import React, { useRef, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileDown, Printer, FileCode2, Edit3 } from 'lucide-react';
import { useI18n } from '../../i18n/i18n.tsx';
import { useApp } from '../../context/AppContext.tsx';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts.ts';
import { SheetPrintable } from '../../components/SheetPrintable.tsx';
import { HintButton } from '../../components/ui/HintButton.tsx';
import { StatusToggle, FORMULA_STATUS_CONFIGS } from '../../components/ui/StatusToggle.tsx';
import { exportToXML } from '../../services/xmlService.ts';
import { isoToday } from '../../utils/dateUtils.ts';

export const SheetPreviewPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { t } = useI18n();
    const { history, saveToHistory, addToast } = useApp();
    const navigate = useNavigate();
    const previewRef = useRef<HTMLDivElement | null>(null);

    // Load recipe from history by ID, or fall back to the last viewed
    const recipe = useMemo(() => history.find(r => r.id === id) ?? null, [history, id]);

    const fileBaseName = useMemo(() => {
        if (!recipe) return 'ficha';
        const rawName = recipe.nome_formula || t('common.file');
        const safeName = rawName
            .normalize('NFKD')
            .replace(/[^\w\s-]/g, '')
            .trim()
            .replace(/\s+/g, '_');
        return `Ficha_${safeName}_${recipe.status || 'RASCUNHO'}_${recipe.data || isoToday()}`;
    }, [recipe, t]);

    const handleExportPDF = async () => {
        if (!recipe || (recipe.status || 'RASCUNHO') !== 'FINAL') {
            addToast(t('messages.draftPdfBlock'), 'warning');
            return;
        }
        const target = previewRef.current;
        if (!target) return;

        const pageNodes = Array.from(target.querySelectorAll<HTMLElement>('.print-page'))
            .filter(n => !n.classList.contains('print-measure'));
        const pages = pageNodes.length ? pageNodes : [target];
        const pagesHtml = pages.map(p => p.outerHTML).join('');

        const headStyles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
            .map(n => n.outerHTML).join('');

        const html = `<!doctype html>
<html lang="${document.documentElement.lang || 'pt-BR'}" class="${document.documentElement.className}">
<head>
  <meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${fileBaseName}</title>${headStyles}
  <style>html,body{margin:0;padding:0;background:#fff;}body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}.print-pages{display:flex;flex-direction:column;gap:0;}@page{size:A4;margin:0;}</style>
</head>
<body><div class="print-pages">${pagesHtml}</div></body></html>`;

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

    useKeyboardShortcuts({
        onAddIngredient: () => {},
        onSave: () => {},
        onPreview: () => {},
        onEscape: () => navigate(id ? `/fichas-tecnicas/${id}/editar` : '/fichas-tecnicas'),
        isEditor: false,
        isPreview: true,
        hasModalOpen: false,
    });

    if (!recipe) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center p-6">
                <p className="text-sm mb-4" style={{ color: 'var(--ink-2)' }}>{t('preview.noRecipe')}</p>
                <button onClick={() => navigate('/fichas-tecnicas')} className="ds-button-primary">
                    {t('nav.sheets')}
                </button>
            </div>
        );
    }

    const statusConfigs = FORMULA_STATUS_CONFIGS({
        draft: t('status.draft'),
        final: t('status.final'),
    });

    return (
        <div className="max-w-[210mm] mx-auto flex flex-col items-center py-6 px-4 animate-in zoom-in-95 duration-300">

            {/* Toolbar */}
            <div className="w-full no-print mb-5">
                <div className="flex items-center gap-3 mb-3">
                    <button
                        onClick={() => navigate(`/fichas-tecnicas/${recipe.id}/editar`)}
                        className="ds-icon-button"
                        title={t('common.edit')}
                    >
                        <ArrowLeft size={14} />
                    </button>
                    <span className="text-xs font-mono truncate flex-1" style={{ color: 'var(--ink-2)' }}>
                        {fileBaseName}.pdf
                    </span>
                    <div className="flex items-center gap-1.5">
                        <StatusToggle
                            value={recipe.status ?? 'RASCUNHO'}
                            configs={statusConfigs}
                            onChange={next => {
                                saveToHistory({ ...recipe, status: next });
                            }}
                        />
                        <HintButton hint={t('hints.statusBadge')} />
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={() => navigate(`/fichas-tecnicas/${recipe.id}/editar`)}
                        className="ds-button flex items-center gap-1.5 text-sm"
                    >
                        <Edit3 size={13} /> {t('common.edit')}
                    </button>

                    <div className="flex items-center gap-1">
                        <button onClick={handleExportPDF} className="ds-button-primary flex items-center gap-1.5 text-sm">
                            <FileDown size={13} /> {t('buttons.exportPdf')}
                        </button>
                        <HintButton hint={t('hints.exportPdf')} />
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => {
                                if ((recipe.status || 'RASCUNHO') !== 'FINAL') {
                                    addToast(t('messages.draftExportBlock'), 'warning');
                                    return;
                                }
                                exportToXML(recipe);
                            }}
                            className="ds-button flex items-center gap-1.5 text-sm"
                        >
                            <FileCode2 size={13} /> {t('buttons.exportXml')}
                        </button>
                        <HintButton hint={t('hints.exportXml')} />
                    </div>

                    <button onClick={() => window.print()} className="ds-button flex items-center gap-1.5 text-sm">
                        <Printer size={13} /> {t('buttons.print')}
                    </button>
                </div>
            </div>

            {/* Draft warning */}
            {recipe.status !== 'FINAL' && (
                <div className="w-full no-print mb-4 px-4 py-2.5 rounded-xl text-xs font-semibold text-center"
                    style={{ background: 'var(--surface-2)', color: 'var(--ink-2)' }}>
                    {t('preview.draftBadge')}
                </div>
            )}

            {/* Preview card */}
            <div className="w-full rounded-2xl overflow-hidden" style={{ background: 'var(--surface-2)' }}>
                <div ref={previewRef}>
                    <SheetPrintable recipe={recipe} mode="print" />
                </div>
            </div>
        </div>
    );
};
