import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useHelpMode } from '../../hooks/useHelpMode';

interface HintButtonProps {
    hint: string;
    /** Label displayed at the top of the popover in primary color */
    title?: string;
    className?: string;
}

interface PopoverPos {
    top: number | 'auto';
    bottom: number | 'auto';
    left: number;
    placement: 'below' | 'above';
    arrowLeft: number;
}

const PANEL_W = 288;
// Aumentei um pouco a estimativa só para a regra de "quando" virar para cima
const PANEL_H_EST = 220; 

export const HintButton: React.FC<HintButtonProps> = ({ hint, title, className = '' }) => {
    // ── ALL hooks must come before any conditional return ────────
    const { helpMode } = useHelpMode();
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState<PopoverPos>({ top: 0, bottom: 'auto', left: 0, placement: 'below', arrowLeft: 12 });
    const btnRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    // Close when help mode is disabled
    useEffect(() => {
        if (!helpMode) setOpen(false);
    }, [helpMode]);

    const calcPos = useCallback(() => {
        if (!btnRef.current) return;
        const rect = btnRef.current.getBoundingClientRect();

        let left = rect.left + rect.width / 2 - PANEL_W / 2;
        left = Math.max(12, Math.min(left, window.innerWidth - PANEL_W - 12));

        const spaceBelow = window.innerHeight - rect.bottom;
        const placement: 'below' | 'above' = spaceBelow < PANEL_H_EST ? 'above' : 'below';

        // O TRUQUE MÁGICO AQUI:
        let top: number | 'auto' = 'auto';
        let bottom: number | 'auto' = 'auto';

        if (placement === 'above') {
            // Se for pra cima, ancoramos a base (bottom) do popover 8px acima do topo do botão
            bottom = window.innerHeight - rect.top + 8;
        } else {
            // Se for pra baixo, ancoramos o topo (top) do popover 8px abaixo da base do botão
            top = rect.bottom + 8;
        }

        const arrowLeft = Math.max(10, Math.min(
            (rect.left + rect.width / 2) - left - 6,
            PANEL_W - 24,
        ));

        setPos({ top, bottom, left, placement, arrowLeft });
    }, []);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (!open) calcPos();
        setOpen(p => !p);
    };

    // Global close + scroll re-anchor
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
        const onOutside = (e: MouseEvent) => {
            if (
                panelRef.current && !panelRef.current.contains(e.target as Node) &&
                btnRef.current && !btnRef.current.contains(e.target as Node)
            ) setOpen(false);
        };
        const onScroll = () => calcPos();

        document.addEventListener('keydown', onKey);
        document.addEventListener('mousedown', onOutside);
        window.addEventListener('scroll', onScroll, true);
        return () => {
            document.removeEventListener('keydown', onKey);
            document.removeEventListener('mousedown', onOutside);
            window.removeEventListener('scroll', onScroll, true);
        };
    }, [open, calcPos]);

    // ── Guard: invisible when help mode is off ───────────────────
    if (!helpMode) return null;

    // ── Arrow decoration ─────────────────────────────────────────
    const arrow = (
        <span
            aria-hidden="true"
            style={{
                position: 'absolute',
                ...(pos.placement === 'below'
                    ? { top: -7, borderBottom: '7px solid var(--border)', borderTop: 'none' }
                    : { bottom: -7, borderTop: '7px solid var(--border)', borderBottom: 'none' }),
                left: pos.arrowLeft,
                width: 0,
                height: 0,
                borderLeft: '7px solid transparent',
                borderRight: '7px solid transparent',
            }}
        >
            <span style={{
                position: 'absolute',
                left: -6,
                ...(pos.placement === 'below'
                    ? { top: 1, borderBottom: '6px solid var(--surface-2)', borderTop: 'none' }
                    : { bottom: 1, borderTop: '6px solid var(--surface-2)', borderBottom: 'none' }),
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
            }} />
        </span>
    );

    // ── Portal popover ───────────────────────────────────────────
    const panel = open ? ReactDOM.createPortal(
        <div
            ref={panelRef}
            role="tooltip"
            onMouseDown={e => e.stopPropagation()}
            onClick={e => e.stopPropagation()}
            className="animate-in fade-in zoom-in-95 duration-150"
            style={{
                position: 'fixed',
                zIndex: 9999,
                top: pos.top,       // Aplica a regra dinâmica
                bottom: pos.bottom, // Aplica a regra dinâmica
                left: pos.left,
                width: PANEL_W,
                borderRadius: 12,
                padding: '14px 16px',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                pointerEvents: 'auto',
            }}
        >
            {arrow}
            {title && (
                <p style={{
                    margin: '0 0 7px',
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.07em',
                    textTransform: 'uppercase',
                    color: 'var(--primary)',
                }}>
                    {title}
                </p>
            )}
            <p style={{
                margin: 0,
                fontSize: 12,
                lineHeight: 1.65,
                color: 'var(--ink-1)',
                fontWeight: 500,
            }}>
                {hint}
            </p>
        </div>,
        document.body,
    ) : null;

    // ── Trigger button ───────────────────────────────────────────
    return (
        <span
            className={`inline-flex items-center flex-shrink-0 ${className}`}
            style={{ verticalAlign: 'middle' }}
        >
            <button
                ref={btnRef}
                type="button"
                onClick={handleClick}
                aria-label="Dica de ajuda"
                aria-expanded={open}
                style={{
                    position: 'relative',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    border: `1.5px solid ${open ? 'var(--primary)' : 'rgba(var(--primary-rgb), 0.45)'}`,
                    background: open ? 'var(--primary)' : 'transparent',
                    color: open ? '#ffffff' : 'var(--primary)',
                    cursor: 'pointer',
                    padding: 0,
                    fontSize: 10,
                    fontWeight: 800,
                    lineHeight: 1,
                    flexShrink: 0,
                    transition: 'all 0.18s ease',
                    outline: 'none',
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: 'normal',
                    textTransform: 'none',
                    userSelect: 'none',
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                    if (!open) {
                        e.currentTarget.style.background = 'var(--primary)';
                        e.currentTarget.style.color = '#ffffff';
                        e.currentTarget.style.borderColor = 'var(--primary)';
                    }
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                    if (!open) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--primary)';
                        e.currentTarget.style.borderColor = 'rgba(var(--primary-rgb), 0.45)';
                    }
                }}
            >
                <span style={{ 
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)', 
                    lineHeight: 1, 
                }}>
                    ?
                </span>
            </button>
            {panel}
        </span>
    );
};