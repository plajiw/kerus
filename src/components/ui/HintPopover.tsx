import React from 'react';
import ReactDOM from 'react-dom';
import { BookOpen } from 'lucide-react';

const PANEL_W = 288;

interface PopoverPos {
    top: number | 'auto';
    bottom: number | 'auto';
    left: number;
    placement: 'below' | 'above';
    arrowLeft: number;
}

interface HintPopoverProps {
    pos: PopoverPos;
    title?: string;
    hint: string;
    docsLink?: string;
    panelRef: React.RefObject<HTMLDivElement>;
    onMouseDown: (e: React.MouseEvent) => void;
    onClick: (e: React.MouseEvent) => void;
}

export const HintPopover: React.FC<HintPopoverProps> = ({
    pos, title, hint, docsLink, panelRef, onMouseDown, onClick,
}) => {
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

    return ReactDOM.createPortal(
        <div
            ref={panelRef}
            role="tooltip"
            onMouseDown={onMouseDown}
            onClick={onClick}
            className="animate-in fade-in zoom-in-95 duration-150"
            style={{
                position: 'fixed',
                zIndex: 9999,
                top: pos.top,
                bottom: pos.bottom,
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
            {docsLink && (
                <>
                    <hr style={{ margin: '10px 0', border: 'none', borderTop: '1px solid var(--border)' }} />
                    <a
                        href={docsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            fontSize: 11,
                            fontWeight: 600,
                            color: 'var(--primary)',
                            textDecoration: 'none',
                            opacity: 0.85,
                        }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                        onMouseLeave={e => (e.currentTarget.style.opacity = '0.85')}
                    >
                        <BookOpen size={12} />
                        Ver na documentação
                    </a>
                </>
            )}
        </div>,
        document.body,
    );
};

export { PANEL_W };
export type { PopoverPos };
