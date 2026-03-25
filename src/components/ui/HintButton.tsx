import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { HelpCircle } from 'lucide-react';
import { useHelpMode } from '../../hooks/useHelpMode';

interface HintButtonProps {
    hint: string;
    className?: string;
}

export const HintButton: React.FC<HintButtonProps> = ({ hint, className = '' }) => {
    const { helpMode } = useHelpMode();
    if (!helpMode) return null;
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState({ top: 0, left: 0, placement: 'below' as 'below' | 'above' });
    const btnRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (!open && btnRef.current) {
            const rect = btnRef.current.getBoundingClientRect();
            const W = 256;
            const PANEL_H = 120;
            let left = rect.left + rect.width / 2 - W / 2;
            left = Math.max(10, Math.min(left, window.innerWidth - W - 10));
            const spaceBelow = window.innerHeight - rect.bottom;
            const placement = spaceBelow < PANEL_H + 16 ? 'above' : 'below';
            const top = placement === 'above'
                ? rect.top + window.scrollY - PANEL_H - 10
                : rect.bottom + window.scrollY + 8;
            setPos({ top, left, placement });
        }
        setOpen(p => !p);
    };

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
        const onMouse = (e: MouseEvent) => {
            if (
                panelRef.current && !panelRef.current.contains(e.target as Node) &&
                btnRef.current && !btnRef.current.contains(e.target as Node)
            ) setOpen(false);
        };
        document.addEventListener('keydown', onKey);
        document.addEventListener('mousedown', onMouse);
        return () => {
            document.removeEventListener('keydown', onKey);
            document.removeEventListener('mousedown', onMouse);
        };
    }, [open]);

    const panel = open ? ReactDOM.createPortal(
        <div
            ref={panelRef}
            role="tooltip"
            onMouseDown={e => e.stopPropagation()}
            onClick={e => e.stopPropagation()}
            className="animate-in fade-in zoom-in-95 duration-100"
            style={{
                position: 'fixed',
                zIndex: 9999,
                top: pos.top,
                left: pos.left,
                width: 256,
                borderRadius: 12,
                padding: '12px 14px',
                background: 'var(--surface-0)',
                border: '1px solid var(--border)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.14), 0 2px 6px rgba(0,0,0,0.06)',
            }}
        >
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
        document.body
    ) : null;

    return (
        <span
            className={`inline-flex items-center flex-shrink-0 ${className}`}
            style={{ verticalAlign: 'middle' }}
        >
            <button
                ref={btnRef}
                type="button"
                onClick={handleClick}
                aria-label="Dica"
                className="inline-flex items-center justify-center w-4 h-4 rounded-full transition-all duration-150 flex-shrink-0"
                style={{
                    color: open ? 'var(--primary)' : 'var(--ink-2)',
                    opacity: open ? 1 : 0.55,
                    background: open ? 'color-mix(in srgb, var(--primary) 10%, transparent)' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                }}
            >
                <HelpCircle size={13} />
            </button>
            {panel}
        </span>
    );
};
