import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useHelpMode } from '../../hooks/useHelpMode';
import { useApp } from '../../context/AppContext';
import { HintPopover, PANEL_W } from './HintPopover';
import type { PopoverPos } from './HintPopover';

interface HintButtonProps {
    title?: string;
    text: React.ReactNode;
    callout?: 'icon' | 'warning' | 'info';
    calloutText?: React.ReactNode;
    docsLink?: string;
    mediaUrl?: string;
    feedbackId?: string;
    forceVisible?: boolean;
    className?: string;
}

export const HintButton: React.FC<HintButtonProps> = ({ 
    title, text, callout, calloutText, docsLink, mediaUrl, feedbackId, forceVisible = false, className = '' 
}) => {
    const { helpMode } = useHelpMode();
    const { addToast } = useApp();
    const [open, setOpen] = useState(false);
    // Pos adicionado o maxHeight inicial
    const [pos, setPos] = useState<PopoverPos>({ top: 0, bottom: 'auto', left: 0, placement: 'below', arrowLeft: 12, maxHeight: 300 });
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
        
        // MATEMÁTICA DE TELA: Avalia espaço em cima e embaixo
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        
        // Se não couber embaixo (menos de 280px) E tiver mais espaço em cima, inverte
        const placement: 'below' | 'above' = (spaceBelow < 280 && spaceAbove > spaceBelow) ? 'above' : 'below';
        
        let top: number | 'auto' = 'auto';
        let bottom: number | 'auto' = 'auto';
        let maxHeight = 280;

        if (placement === 'above') {
            bottom = window.innerHeight - rect.top + 8;
            maxHeight = Math.max(150, spaceAbove - 24); // Limita a altura deixando 24px de respiro no topo
        } else {
            top = rect.bottom + 8;
            maxHeight = Math.max(150, spaceBelow - 24); // Limita a altura deixando 24px de respiro no fundo
        }
        
        const arrowLeft = Math.max(10, Math.min((rect.left + rect.width / 2) - left - 6, PANEL_W - 24));
        setPos({ top, bottom, left, placement, arrowLeft, maxHeight });
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

    const handleFeedback = (isHelpful: boolean) => {
        if (isHelpful) {
            addToast('Ficamos felizes em ajudar!', 'success');
        } else {
            addToast('Obrigado pelo feedback. Vamos melhorar esta explicação!', 'info');
        }
    };

    const renderHintContent = () => {
        const contentNode = typeof text === 'string' 
            ? <div style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: text }} />
            : <div style={{ margin: 0 }}>{text}</div>;

        if (!callout) return contentNode;

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {contentNode}

                {callout === 'icon' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', background: 'var(--surface-1)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                        <code style={{ background: 'var(--surface-3)', padding: '2px 6px', borderRadius: '4px', color: 'var(--primary)', fontWeight: 800, fontSize: '11px', border: '1px solid var(--border)' }}>?</code>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink-1)' }}>
                            {calloutText || 'Procure por este ícone na interface.'}
                        </span>
                    </div>
                )}

                {callout === 'warning' && (
                    <div style={{ padding: '6px 10px', background: 'var(--status-warning-bg)', borderLeft: '3px solid var(--status-warning-text)', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0' }}>
                        <span style={{ fontSize: '11px', color: 'var(--status-warning-text)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Atenção</span>
                        <div style={{ margin: '2px 0 0 0', fontSize: '11px', color: 'var(--ink-0)', fontWeight: 500 }}>
                            {calloutText}
                        </div>
                    </div>
                )}

                {callout === 'info' && (
                    <div style={{ padding: '6px 10px', background: 'var(--status-info-bg)', borderLeft: '3px solid var(--status-info-text)', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0' }}>
                        <span style={{ fontSize: '11px', color: 'var(--status-info-text)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dica</span>
                        <div style={{ margin: '2px 0 0 0', fontSize: '11px', color: 'var(--ink-0)', fontWeight: 500 }}>
                            {calloutText}
                        </div>
                    </div>
                )}
            </div>
        );
    };

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
                    hint={renderHintContent()}
                    docsLink={docsLink}
                    mediaUrl={mediaUrl}
                    onFeedback={feedbackId ? handleFeedback : undefined}
                    panelRef={panelRef}
                    onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                />
            )}
        </span>
    );
};