import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { BookOpen, ThumbsUp, ThumbsDown } from 'lucide-react';

export const PANEL_W = 288;

export interface PopoverPos {
    top: number | 'auto';
    bottom: number | 'auto';
    left: number;
    placement: 'below' | 'above';
    arrowLeft: number;
    maxHeight: number; // Exigido para cortar/scrollar a caixa
}

interface HintPopoverProps {
    pos: PopoverPos;
    title?: string;
    hint: React.ReactNode;
    docsLink?: string;
    /** Permite customizar o texto "Ver na documentação" */
    docsLinkLabel?: string;
    mediaUrl?: string;
    onFeedback?: (isHelpful: boolean) => void;
    panelRef: React.RefObject<HTMLDivElement>;
    onMouseDown: (e: React.MouseEvent) => void;
    onClick: (e: React.MouseEvent) => void;
}

// Utilitário de segurança para prevenir injeção de scripts em links (XSS)
const isSafeUrl = (url?: string) => {
    if (!url) return false;
    return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/');
};

export const HintPopover: React.FC<HintPopoverProps> = ({
    pos, title, hint, docsLink, docsLinkLabel, mediaUrl, onFeedback, panelRef, onMouseDown, onClick,
}) => {
    const [feedbackGiven, setFeedbackGiven] = useState(false);

    const handleFeedback = (isHelpful: boolean) => {
        setFeedbackGiven(true);
        if (onFeedback) onFeedback(isHelpful);
    };

    // Seta matemática original mantida intocada
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
            // Acessibilidade: Como possui botões/links internos, deve ser um dialog e não tooltip
            role="dialog"
            aria-modal="false"
            aria-label={title || "Informação de ajuda"}
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
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                pointerEvents: 'auto',
                overflow: 'hidden',
            }}
        >
            {arrow}
            
            {/* CONTAINER COM SCROLL INTERNO */}
            <div style={{
                maxHeight: pos.maxHeight,
                overflowY: 'auto',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                scrollbarWidth: 'thin',
                scrollbarColor: 'var(--ink-2) transparent'
            }}>
                {title && (
                    <p style={{
                        margin: '0 0 7px',
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: '0.07em',
                        textTransform: 'uppercase',
                        color: 'var(--primary)',
                        flexShrink: 0
                    }}>
                        {title}
                    </p>
                )}

                {/* Reprodutor de Mídia Otimizado em MP4 (Substitui o GIF) */}
                {isSafeUrl(mediaUrl) && (
                    <div style={{ 
                        width: '100%', 
                        height: 140, 
                        marginBottom: 10, 
                        background: '#000000', // Fundo preto melhora a transição de carregamento do vídeo
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border)',
                        overflow: 'hidden',
                        flexShrink: 0
                    }}>
                        <video 
                            src={mediaUrl}
                            autoPlay 
                            loop 
                            muted 
                            playsInline // Crucial para não abrir tela cheia em dispositivos móveis
                            preload="none"
                            style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover',
                                pointerEvents: 'none' // Impede que o usuário pause o vídeo acidentalmente
                            }} 
                        />
                    </div>
                )}

                <div style={{
                    margin: 0,
                    fontSize: 12,
                    lineHeight: 1.65,
                    color: 'var(--ink-1)',
                    fontWeight: 500,
                }}>
                    {hint}
                </div>

                {(docsLink || onFeedback) && (
                    <div style={{ flexShrink: 0 }}>
                        <hr style={{ margin: '12px 0 8px 0', border: 'none', borderTop: '1px solid var(--border)' }} />
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                            
                            {isSafeUrl(docsLink) ? (
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
                                    {docsLinkLabel || 'Ver na documentação'}
                                </a>
                            ) : <div />}

                            {onFeedback && (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {!feedbackGiven ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <span style={{ fontSize: 10, color: 'var(--ink-2)', fontWeight: 600 }}>Útil?</span>
                                            <div style={{ display: 'flex', gap: 2 }}>
                                                <button 
                                                    onClick={() => handleFeedback(true)}
                                                    aria-label="Sim, foi útil"
                                                    style={{ background: 'none', border: 'none', color: 'var(--ink-2)', cursor: 'pointer', padding: 2, display: 'flex' }}
                                                    onMouseEnter={e => e.currentTarget.style.color = 'var(--status-success-text)'}
                                                    onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-2)'}
                                                    title="Sim"
                                                >
                                                    <ThumbsUp size={12} />
                                                </button>
                                                <button 
                                                    onClick={() => handleFeedback(false)}
                                                    aria-label="Não foi útil"
                                                    style={{ background: 'none', border: 'none', color: 'var(--ink-2)', cursor: 'pointer', padding: 2, display: 'flex' }}
                                                    onMouseEnter={e => e.currentTarget.style.color = 'var(--status-error-text)'}
                                                    onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-2)'}
                                                    title="Não"
                                                >
                                                    <ThumbsDown size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <span style={{ fontSize: 10, color: 'var(--status-success-text)', fontWeight: 600 }} aria-live="polite">
                                            Obrigado!
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>,
        document.body,
    );
};