import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useHelpMode } from '../../hooks/useHelpMode';
import { HintPopover, PANEL_W } from './HintPopover';
import type { PopoverPos } from './HintPopover';

interface HintButtonProps {
    hint: string;
    /** Label displayed at the top of the popover in primary color */
    title?: string;
    /** Optional link to documentation shown at the bottom of the popover */
    docsLink?: string;
    /** Show this button even when help mode is disabled (use only for the help mode setting itself) */
    forceVisible?: boolean;
    className?: string;
}

const PANEL_H_EST = 220;

export const HintButton: React.FC<HintButtonProps> = ({ hint, title, docsLink, forceVisible = false, className = '' }) => {
    const { helpMode } = useHelpMode();
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState<PopoverPos>({ top: 0, bottom: 'auto', left: 0, placement: 'below', arrowLeft: 12 });
    const btnRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

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

        let top: number | 'auto' = 'auto';
        let bottom: number | 'auto' = 'auto';
        if (placement === 'above') {
            bottom = window.innerHeight - rect.top + 8;
        } else {
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

    if (!helpMode && !forceVisible) return null;

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
            {open && (
                <HintPopover
                    pos={pos}
                    title={title}
                    hint={hint}
                    docsLink={docsLink}
                    panelRef={panelRef}
                    onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                />
            )}
        </span>
    );
};
