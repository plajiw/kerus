import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useI18n } from './i18n/i18n.tsx';
import { AppLayout } from './components/layout/AppLayout';
import { PageSkeleton, EditorSkeleton } from './components/ui/PageSkeleton';

// ─── Lazy page chunks ──────────────────────────────────────────
// Each page is a separate JS chunk loaded on first navigation.
// Subsequent visits are instant (cached by the browser).
const DashboardPage        = lazy(() => import('./pages/dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })));
const SheetsPage           = lazy(() => import('./pages/sheets/SheetsPage').then(m => ({ default: m.SheetsPage })));
const SheetEditorPage      = lazy(() => import('./pages/sheets/SheetEditorPage').then(m => ({ default: m.SheetEditorPage })));
const SheetPreviewPage     = lazy(() => import('./pages/sheets/SheetPreviewPage').then(m => ({ default: m.SheetPreviewPage })));
const QuotationsPage       = lazy(() => import('./pages/quotations/QuotationsPage').then(m => ({ default: m.QuotationsPage })));
const QuotationEditorPage  = lazy(() => import('./pages/quotations/QuotationEditorPage').then(m => ({ default: m.QuotationEditorPage })));
const QuotationPreviewPage = lazy(() => import('./pages/quotations/QuotationPreviewPage').then(m => ({ default: m.QuotationPreviewPage })));
const SettingsPage         = lazy(() => import('./pages/settings/SettingsPage').then(m => ({ default: m.SettingsPage })));

// ─── Suspense wrappers ─────────────────────────────────────────
const PageFallback: React.FC = () => <PageSkeleton />;
const EditorFallback: React.FC = () => <EditorSkeleton />;

const App: React.FC = () => {
    const { t } = useI18n();

    useEffect(() => {
        document.title = t('common.appName');
    }, [t]);

    return (
        <Routes>
            <Route element={<AppLayout />}>

                {/* Dashboard */}
                <Route index element={
                    <Suspense fallback={<PageFallback />}>
                        <DashboardPage />
                    </Suspense>
                } />

                {/* Sheets — list */}
                <Route path="fichas-tecnicas" element={
                    <Suspense fallback={<PageFallback />}>
                        <SheetsPage />
                    </Suspense>
                } />

                {/* Sheets — editor (create / edit) */}
                <Route path="fichas-tecnicas/nova" element={
                    <Suspense fallback={<EditorFallback />}>
                        <SheetEditorPage />
                    </Suspense>
                } />
                <Route path="fichas-tecnicas/:id/editar" element={
                    <Suspense fallback={<EditorFallback />}>
                        <SheetEditorPage />
                    </Suspense>
                } />

                {/* Sheets — preview */}
                <Route path="fichas-tecnicas/:id/preview" element={
                    <Suspense fallback={<PageFallback />}>
                        <SheetPreviewPage />
                    </Suspense>
                } />

                {/* Quotations — list */}
                <Route path="orcamentos" element={
                    <Suspense fallback={<PageFallback />}>
                        <QuotationsPage />
                    </Suspense>
                } />

                {/* Quotations — editor (create / edit) */}
                <Route path="orcamentos/novo" element={
                    <Suspense fallback={<EditorFallback />}>
                        <QuotationEditorPage />
                    </Suspense>
                } />
                <Route path="orcamentos/:id/editar" element={
                    <Suspense fallback={<EditorFallback />}>
                        <QuotationEditorPage />
                    </Suspense>
                } />

                {/* Quotations — preview */}
                <Route path="orcamentos/:id/preview" element={
                    <Suspense fallback={<PageFallback />}>
                        <QuotationPreviewPage />
                    </Suspense>
                } />

                {/* Settings */}
                <Route path="configuracoes" element={
                    <Suspense fallback={<PageFallback />}>
                        <SettingsPage />
                    </Suspense>
                } />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    );
};

export default App;
