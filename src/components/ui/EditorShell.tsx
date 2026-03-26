import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Eye, EyeOff, ZoomIn, ZoomOut, RotateCcw, X, Maximize2 } from 'lucide-react';

interface EditorShellProps {
    /** Left-side form content */
    children: React.ReactNode;
    /** A4 page component rendered inside the preview pane */
    preview: React.ReactNode;
    /** Called when user closes the mobile preview overlay */
    mobilePreviewLabel?: string;
}

/**
 * Shared split-pane shell used by both Formula and Quotation editors.
 * Handles: resize divider, auto-scale preview, zoom controls, show/hide,
 * mobile full-screen overlay, and localStorage persistence for zoom/visibility.
 */
export const EditorShell: React.FC<EditorShellProps> = ({
    children,
    preview,
    mobilePreviewLabel = 'Preview',
}) => {
    const shellRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const pageRef = useRef<HTMLDivElement>(null);

    const [showPreview, setShowPreview] = useState(() => {
        const stored = localStorage.getItem('editorPreviewVisible');
        return stored === null ? true : stored === 'true';
    });
    const [zoomFactor, setZoomFactor] = useState(() => {
        const stored = Number(localStorage.getItem('editorPreviewZoom') || '');
        return Number.isFinite(stored) && stored > 0 ? stored : 1;
    });
    const [previewWidth, setPreviewWidth] = useState(0);
    const [isResizing, setIsResizing] = useState(false);
    const [previewScale, setPreviewScale] = useState(1);
    const [pageSize, setPageSize] = useState({ width: 0, height: 0 });
    const [mobileOpen, setMobileOpen] = useState(false);

    // Initialise preview width to 45% of shell
    useEffect(() => {
        if (shellRef.current) {
            setPreviewWidth(Math.round(shellRef.current.getBoundingClientRect().width * 0.45));
        }
    }, []);

    // Persist preferences
    useEffect(() => { localStorage.setItem('editorPreviewVisible', String(showPreview)); }, [showPreview]);
    useEffect(() => { localStorage.setItem('editorPreviewZoom', String(zoomFactor)); }, [zoomFactor]);

    // Measure A4 page natural size
    useLayoutEffect(() => {
        const page = pageRef.current;
        if (!page) return;
        const update = () => setPageSize({ width: page.offsetWidth, height: page.offsetHeight });
        update();
        const ro = new ResizeObserver(update);
        ro.observe(page);
        return () => ro.disconnect();
    }, []);

    // Scale preview to fit stage
    useLayoutEffect(() => {
        const stage = stageRef.current;
        if (!stage || !pageSize.width) return;
        const update = () => {
            const s = Math.min(1, stage.clientWidth / pageSize.width);
            setPreviewScale(Number.isFinite(s) && s > 0 ? s : 1);
        };
        update();
        const ro = new ResizeObserver(update);
        ro.observe(stage);
        return () => ro.disconnect();
    }, [pageSize.width]);

    // Resize drag
    useEffect(() => {
        if (!isResizing) return;
        const onMove = (e: MouseEvent) => {
            const shell = shellRef.current;
            if (!shell) return;
            const rect = shell.getBoundingClientRect();
            const min = Math.round(rect.width * 0.3);
            const max = Math.round(rect.width * 0.6);
            setPreviewWidth(Math.max(min, Math.min(max, rect.right - e.clientX)));
        };
        const onUp = () => setIsResizing(false);
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'col-resize';
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
        };
    }, [isResizing]);

    return (
        <div
            ref={shellRef}
            className="flex flex-row overflow-hidden"
            style={{ height: 'calc(100vh - 3.5rem)', background: 'var(--surface-1)' }}
        >
            {/* ── Left: scrollable form ────────────────────────── */}
            <div
                className="flex-1 min-w-0 overflow-y-auto"
                style={{ borderRight: '1px solid var(--border)' }}
            >
                {/* Mobile preview button (icon only) */}
                <div className="lg:hidden flex justify-end px-4 pt-3">
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="ds-icon-button"
                        title={mobilePreviewLabel}
                    >
                        <Maximize2 size={14} />
                    </button>
                </div>
                {children}
            </div>

            {/* ── Resize divider ───────────────────────────────── */}
            {showPreview && (
                <div
                    className="hidden lg:flex w-1.5 cursor-col-resize items-stretch flex-shrink-0"
                    onMouseDown={() => setIsResizing(true)}
                    style={{ background: 'var(--border)' }}
                />
            )}

            {/* ── Right: preview pane ──────────────────────────── */}
            {showPreview && (
                <div
                    className="hidden lg:flex flex-col flex-shrink-0"
                    style={{ width: previewWidth, borderLeft: '1px solid var(--border)' }}
                >
                    {/* Toolbar */}
                    <div
                        className="flex items-center justify-between px-3 py-2.5 flex-shrink-0"
                        style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-0)' }}
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--ink-2)' }}>
                                Preview A4
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setZoomFactor(z => Math.max(0.4, +(z - 0.1).toFixed(1)))}
                                className="ds-icon-button" title="Zoom -"
                            >
                                <ZoomOut size={12} />
                            </button>
                            <span className="text-[10px] font-mono px-1.5" style={{ color: 'var(--ink-2)' }}>
                                {Math.round(zoomFactor * 100)}%
                            </span>
                            <button
                                onClick={() => setZoomFactor(1)}
                                className="ds-icon-button" title="Reset zoom"
                            >
                                <RotateCcw size={12} />
                            </button>
                            <button
                                onClick={() => setZoomFactor(z => Math.min(1.8, +(z + 0.1).toFixed(1)))}
                                className="ds-icon-button" title="Zoom +"
                            >
                                <ZoomIn size={12} />
                            </button>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="ds-icon-button ml-1" title="Ocultar preview"
                            >
                                <EyeOff size={12} />
                            </button>
                        </div>
                    </div>

                    {/* Canvas */}
                    <div
                        className="flex-1 overflow-auto p-4 select-none flex justify-center"
                        style={{ background: 'var(--surface-2)' }}
                    >
                        <div
                            ref={stageRef}
                            className="relative w-full"
                            style={{ maxWidth: '210mm', aspectRatio: '210 / 297' }}
                        >
                            <div
                                className="absolute top-0 left-0 origin-top-left"
                                style={{
                                    transform: `scale(${previewScale * zoomFactor})`,
                                    width: pageSize.width || undefined,
                                    height: pageSize.height || undefined,
                                }}
                            >
                                <div ref={pageRef}>{preview}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Show preview FAB when hidden — icon only */}
            {!showPreview && (
                <button
                    onClick={() => setShowPreview(true)}
                    className="hidden lg:flex fixed bottom-6 right-6 ds-icon-button z-50"
                    title="Mostrar preview"
                    style={{ width: 44, height: 44, background: 'var(--primary)', borderColor: 'var(--primary)', color: '#fff' }}
                >
                    <Eye size={16} />
                </button>
            )}

            {/* ── Mobile overlay ───────────────────────────────── */}
            {mobileOpen && (
                <div className="fixed inset-0 z-[220] flex flex-col lg:hidden" style={{ background: 'var(--surface-0)' }}>
                    <div
                        className="flex items-center justify-between px-4 py-3 flex-shrink-0"
                        style={{ borderBottom: '1px solid var(--border)' }}
                    >
                        <span className="text-sm font-bold" style={{ color: 'var(--ink-0)' }}>
                            {mobilePreviewLabel}
                        </span>
                        <button onClick={() => setMobileOpen(false)} className="ds-icon-button">
                            <X size={16} />
                        </button>
                    </div>
                    <div className="flex-1 overflow-auto p-4 select-none" style={{ background: 'var(--surface-2)' }}>
                        {preview}
                    </div>
                </div>
            )}
        </div>
    );
};
