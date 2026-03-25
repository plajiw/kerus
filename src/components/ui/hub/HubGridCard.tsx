import React from 'react';
import { X, Edit3, Eye } from 'lucide-react';
import { getCoverGradient } from '../../../utils/coverGradient';

export type CoverStatusVariant = 'green' | 'gray' | 'blue' | 'purple' | 'red' | 'orange';

const STATUS_COLORS: Record<CoverStatusVariant, { bg: string; border: string; text: string }> = {
    green:  { bg: 'rgba(22,163,74,0.35)',   border: 'rgba(74,222,128,0.3)',   text: '#4ade80' },
    gray:   { bg: 'rgba(71,71,71,0.45)',    border: 'rgba(72,72,71,0.3)',     text: '#adaaaa' },
    blue:   { bg: 'rgba(37,99,235,0.35)',   border: 'rgba(96,165,250,0.3)',   text: '#60a5fa' },
    purple: { bg: 'rgba(126,34,206,0.35)',  border: 'rgba(167,139,250,0.3)', text: '#a78bfa' },
    red:    { bg: 'rgba(185,28,28,0.35)',   border: 'rgba(248,113,113,0.3)', text: '#f87171' },
    orange: { bg: 'rgba(230,126,0,0.35)',   border: 'rgba(251,191,36,0.3)',  text: '#fbbf24' },
};

interface HubGridCardProps {
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
    onEdit: () => void;
    onPreview: () => void;
    onDelete: () => void;
}

export const HubGridCard: React.FC<HubGridCardProps> = ({
    name,
    coverAspectRatio,
    coverFixedHeight,
    coverIcon,
    statusText,
    statusVariant,
    infoSlot,
    onEdit,
    onPreview,
    onDelete,
}) => {
    const colors = STATUS_COLORS[statusVariant];

    return (
        <div
            className="group relative overflow-hidden rounded-2xl transition-all duration-150 hover:-translate-y-0.5"
            style={{ background: 'var(--surface-2)' }}
        >
            {/* Cover */}
            <div
                className="relative w-full overflow-hidden flex items-center justify-center"
                style={{
                    background: getCoverGradient(name),
                    ...(coverFixedHeight
                        ? { height: coverFixedHeight }
                        : { aspectRatio: coverAspectRatio ?? '4/3' }),
                }}
            >
                {/* Watermark letter */}
                <span
                    className="absolute inset-0 flex items-center justify-center text-[6rem] font-black select-none pointer-events-none leading-none"
                    style={{ color: 'rgba(255,255,255,0.06)' }}
                >
                    {name.charAt(0).toUpperCase()}
                </span>

                {/* Optional center icon */}
                {coverIcon && (
                    <span className="relative" style={{ zIndex: 1 }}>{coverIcon}</span>
                )}

                {/* Status badge — top right */}
                <div
                    className="absolute top-3 right-3 px-3 py-1 rounded-full"
                    style={{
                        background: colors.bg,
                        border: `1px solid ${colors.border}`,
                        backdropFilter: 'blur(8px)',
                    }}
                >
                    <span className="text-[10px] font-bold tracking-widest" style={{ color: colors.text }}>
                        {statusText}
                    </span>
                </div>

                {/* Delete — top left on hover */}
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    className="absolute top-3 left-3 w-7 h-7 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-all"
                    style={{
                        background: 'rgba(185,41,2,0.75)',
                        border: '1px solid rgba(255,115,81,0.35)',
                        backdropFilter: 'blur(8px)',
                    }}
                    title="Excluir"
                >
                    <X size={12} style={{ color: '#ffd2c8' }} />
                </button>

                {/* Hover overlay with edit / preview */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end gap-2 p-3"
                    style={{ background: 'rgba(0,0,0,0.45)' }}
                >
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(); }}
                        className="w-9 h-9 flex items-center justify-center rounded-xl transition-all"
                        style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
                        title="Editar"
                    >
                        <Edit3 size={14} style={{ color: 'white' }} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onPreview(); }}
                        className="w-9 h-9 flex items-center justify-center rounded-xl transition-all"
                        style={{ background: 'rgba(255,159,74,0.85)', backdropFilter: 'blur(8px)' }}
                        title="Preview"
                    >
                        <Eye size={14} style={{ color: '#180800' }} />
                    </button>
                </div>
            </div>

            {/* Card body */}
            <div className="p-4">
                <h4 className="font-bold text-sm truncate mb-2" style={{ color: 'var(--ink-0)' }}>
                    {name}
                </h4>
                {infoSlot}
            </div>
        </div>
    );
};
