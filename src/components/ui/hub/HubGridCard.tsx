import React from 'react';
import { X, Edit3, Eye, Check, Star } from 'lucide-react';
import { getCoverGradient } from '../../../utils/coverGradient';
import { useTheme } from '../../../context/ThemeContext';

export type CoverStatusVariant = 'green' | 'gray' | 'blue' | 'purple' | 'red' | 'orange';

const STATUS_COLORS: Record<CoverStatusVariant, { bg: string; border: string; text: string }> = {
    green: { bg: 'rgba(22,163,74,0.35)', border: 'rgba(74,222,128,0.3)', text: '#4ade80' },
    gray: { bg: 'rgba(71,71,71,0.45)', border: 'rgba(72,72,71,0.3)', text: '#adaaaa' },
    blue: { bg: 'rgba(37,99,235,0.35)', border: 'rgba(96,165,250,0.3)', text: '#60a5fa' },
    purple: { bg: 'rgba(126,34,206,0.35)', border: 'rgba(167,139,250,0.3)', text: '#a78bfa' },
    red: { bg: 'rgba(185,28,28,0.35)', border: 'rgba(248,113,113,0.3)', text: '#f87171' },
    orange: { bg: 'rgba(230,126,0,0.35)', border: 'rgba(251,191,36,0.3)', text: '#fbbf24' },
};

export interface HubGridCardProps {
    name: string;
    /** CSS aspect-ratio value (e.g. '4/3'). Used when coverFixedHeight is not set. */
    coverAspectRatio?: string;
    /** Fixed pixel height for the cover (e.g. '120px'). Overrides coverAspectRatio. */
    coverFixedHeight?: string;
    /** Optional icon rendered centered in the cover */
    coverIcon?: React.ReactNode;
    statusText: string;
    statusVariant: CoverStatusVariant;
    /** Content rendered inside the card body, below the name */
    infoSlot: React.ReactNode;
    /** Indicates if the card is currently pinned as a favorite */
    pinned?: boolean;
    onEdit: () => void;
    onPreview: () => void;
    onDelete: () => void;
    /** Callback when the selection button is clicked. If not provided, the button is not rendered. */
    onToggleSelect?: () => void;
    /** Callback when the favorite/pin button is clicked. If not provided, the button is not rendered. */
    onTogglePin?: () => void;
}

export const HubGridCard: React.FC<HubGridCardProps> = ({
    name,
    coverAspectRatio,
    coverFixedHeight,
    coverIcon,
    statusText,
    statusVariant,
    infoSlot,
    selected = false,
    pinned = false,
    onEdit,
    onPreview,
    onDelete,
    onToggleSelect,
    onTogglePin,
}) => {
    const { isDark } = useTheme();

    return (
        <div
            className={`group relative overflow-hidden rounded-2xl transition-all duration-150 ${
                selected ? 'ring-2 ring-[var(--primary)]' : 'hover:-translate-y-0.5'
            }`}
            style={{ background: 'var(--surface-2)' }}
        >
            {/* Cover */}
            <div
                className="relative w-full overflow-hidden flex items-center justify-center cursor-pointer"
                onClick={onToggleSelect}
                style={{
                    background: getCoverGradient(name, isDark),
                    ...(coverFixedHeight
                        ? { height: coverFixedHeight }
                        : { aspectRatio: coverAspectRatio ?? '4/3' }),
                }}
            >
                {/* Watermark letter */}
                <span
                    className="absolute inset-0 flex items-center justify-center text-[6rem] font-black select-none pointer-events-none leading-none"
                    style={{ color: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)' }}
                >
                    {name.charAt(0).toUpperCase()}
                </span>

                {/* Optional center icon */}
                {coverIcon && (
                    <span className="relative" style={{ zIndex: 1 }}>{coverIcon}</span>
                )}

                {/* Selection Checkbox — top left (independente do hover overlay) */}
                {onToggleSelect && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleSelect(); }}
                        className={`absolute top-3 left-3 w-6 h-6 flex items-center justify-center rounded-lg transition-all z-10 shadow-sm
                            ${selected 
                                ? 'opacity-100 scale-100' 
                                : 'opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100'
                            }
                        `}
                        style={selected ? {
                            background: 'var(--primary)',
                            color: isDark ? '#180800' : '#ffffff',
                            border: 'none',
                        } : {
                            background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.3)',
                            border: `2px solid ${isDark ? '#767575' : '#7C7370'}`, // #767575 is the outline token
                            color: 'transparent',
                            backdropFilter: 'blur(4px)',
                        }}
                        title={selected ? "Remover seleção" : "Selecionar"}
                    >
                        {selected && <Check size={14} strokeWidth={4} />}
                    </button>
                )}

                {/* Hover overlay with actions */}
                <div
                    className={`absolute inset-0 transition-opacity ${
                        selected ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
                    } pointer-events-none`}
                    style={{ background: isDark ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.35)' }}
                >
                    {/* Delete — top right */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full transition-transform hover:scale-105 pointer-events-auto"
                        style={{
                            background: isDark ? 'rgba(185,28,28,0.85)' : 'rgba(254,226,226,0.9)',
                            border: `1px solid ${isDark ? 'rgba(248,113,113,0.3)' : 'rgba(239,68,68,0.4)'}`,
                            color: isDark ? '#fca5a5' : '#b91c1c',
                            backdropFilter: 'blur(8px)',
                        }}
                        title="Excluir"
                    >
                        <X size={14} />
                    </button>

                    {/* Edit / Preview — bottom right */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-2 pointer-events-auto">
                        <button
                            onClick={(e) => { e.stopPropagation(); onEdit(); }}
                            className="w-9 h-9 flex items-center justify-center rounded-xl transition-transform hover:scale-105 shadow-sm"
                            style={{
                                background: isDark ? 'rgba(255,255,255,0.15)' : 'var(--surface-2)',
                                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'var(--border)'}`,
                                color: 'var(--ink-0)',
                                backdropFilter: 'blur(8px)'
                            }}
                            title="Editar"
                        >
                            <Edit3 size={14} />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onPreview(); }}
                            className="w-9 h-9 flex items-center justify-center rounded-xl transition-transform hover:scale-105 shadow-md"
                            style={{
                                background: 'var(--primary)',
                                color: isDark ? '#180800' : '#ffffff',
                                backdropFilter: 'blur(8px)'
                            }}
                            title="Preview"
                        >
                            <Eye size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Card body */}
            <div className="p-4">
                <div className="flex items-center justify-between gap-2 mb-2">
                    <h4 className="font-bold text-sm truncate" style={{ color: 'var(--ink-0)' }}>
                        {name}
                    </h4>
                    {onTogglePin && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onTogglePin(); }}
                            className={`flex-shrink-0 transition-all duration-150 ${
                                pinned 
                                    ? 'opacity-100' 
                                    : 'opacity-0 group-hover:opacity-60 hover:!opacity-100'
                            }`}
                            style={{ color: pinned ? '#ffe393' : 'var(--ink-2)' }}
                            title={pinned ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                        >
                            <Star
                                size={14}
                                strokeWidth={2}
                                fill={pinned ? '#ffe393' : 'none'}
                            />
                        </button>
                    )}
                </div>
                {infoSlot}
            </div>
        </div>
    );
};
