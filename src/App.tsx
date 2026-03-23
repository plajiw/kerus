import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useI18n } from './i18n/i18n.tsx';
import { AppLayout } from './components/layout/AppLayout';
import { PageSkeleton, EditorSkeleton } from './components/ui/PageSkeleton';

// ─── Lazy page chunks ──────────────────────────────────────────
// Each page is a separate JS chunk loaded on first navigation.
// Subsequent visits are instant (cached by the browser).
const DashboardPage        = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const FormulasPage         = lazy(() => import('./pages/FormulasPage').then(m => ({ default: m.FormulasPage })));
const FormulaEditorPage    = lazy(() => import('./pages/FormulaEditorPage').then(m => ({ default: m.FormulaEditorPage })));
const FormulaPreviewPage   = lazy(() => import('./pages/FormulaPreviewPage').then(m => ({ default: m.FormulaPreviewPage })));
const QuotationsPage       = lazy(() => import('./pages/QuotationsPage').then(m => ({ default: m.QuotationsPage })));
const QuotationEditorPage  = lazy(() => import('./pages/QuotationEditorPage').then(m => ({ default: m.QuotationEditorPage })));
const QuotationPreviewPage = lazy(() => import('./pages/QuotationPreviewPage').then(m => ({ default: m.QuotationPreviewPage })));
const SettingsPage         = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));

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

                {/* Formulas — list */}
                <Route path="formulas" element={
                    <Suspense fallback={<PageFallback />}>
                        <FormulasPage />
                    </Suspense>
                } />

                {/* Formulas — editor (create / edit) */}
                <Route path="formulas/nova" element={
                    <Suspense fallback={<EditorFallback />}>
                        <FormulaEditorPage />
                    </Suspense>
                } />
                <Route path="formulas/:id/editar" element={
                    <Suspense fallback={<EditorFallback />}>
                        <FormulaEditorPage />
                    </Suspense>
                } />

                {/* Formulas — preview */}
                <Route path="formulas/:id/preview" element={
                    <Suspense fallback={<PageFallback />}>
                        <FormulaPreviewPage />
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
