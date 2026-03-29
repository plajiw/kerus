import React from 'react';
import { Trash2, Edit3, Eye, Check, Star } from 'lucide-react';
import { IconButton } from '../../ui/IconButton';
import { getCoverGradient } from '../../../utils/coverGradient';

export interface HubGridCardProps {
    name: string;
    coverAspectRatio?: string;
    coverFixedHeight?: string;
    coverIcon?: React.ReactNode;
    coverColor?: string;
    infoSlot: React.ReactNode;
    selected?: boolean;
    pinned?: boolean;
    onEdit: () => void;
    onPreview: () => void;
    onDelete: () => void;
    onToggleSelect: () => void;
    onTogglePin?: () => void;
}

export const HubGridCard: React.FC<HubGridCardProps> = ({
    name, coverAspectRatio, coverFixedHeight, coverIcon, coverColor,
    infoSlot, selected = false, pinned = false,
    onEdit, onPreview, onDelete, onToggleSelect, onTogglePin,
}) => {
    return (
        <div
            className={`group relative overflow-hidden rounded-2xl transition-all duration-300 ${!selected ? 'hover:-translate-y-1' : ''}`}
            style={{ background: 'var(--surface-2)' }}
        >
            {/* Contorno de seleção — div interna evita o clip do overflow-hidden */}
            {selected && (
                <div
                    className="absolute inset-0 rounded-2xl pointer-events-none z-30"
                    style={{ border: '2px solid var(--primary)' }}
                />
            )}

            {/* --- Cover --- */}
            <div
                className="relative w-full overflow-hidden flex items-center justify-center cursor-pointer"
                onClick={onToggleSelect}
                style={coverFixedHeight ? { height: coverFixedHeight } : { aspectRatio: coverAspectRatio ?? '4/3' }}
            >
                {/* Background isolado — recebe o scale no hover sem afetar os botões */}
                <div
                    className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                    style={{ background: coverColor || getCoverGradient(name) }}
                />

                {/* Watermark sutil */}
                <span className="absolute inset-0 flex items-center justify-center text-[6.5rem] font-black opacity-10 select-none pointer-events-none" style={{ color: 'var(--ink-0)' }}>
                    {name.charAt(0).toUpperCase()}
                </span>

                {coverIcon && <div className="relative z-10">{coverIcon}</div>}

                {/* Botão de seleção — sempre visível quando selecionado, aparece no hover caso contrário */}
                <IconButton
                    size="xs"
                    variant={selected ? 'primary' : 'surface'}
                    title={selected ? "Remover seleção" : "Selecionar"}
                    icon={selected ? <Check strokeWidth={4} /> : <div />}
                    onClick={onToggleSelect}
                    className={`absolute top-3 left-3 z-20 transition-opacity duration-200 ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                />

                {/* Ações de edição — ocultas quando o card está selecionado */}
                {!selected && <>
                    <IconButton
                        size="sm"
                        variant="surface"
                        title="Excluir"
                        icon={<Trash2 />}
                        onClick={onDelete}
                        customColor="var(--status-error-text)"
                        className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    />

                    <div className="absolute bottom-3 right-3 flex items-center gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <IconButton
                            variant="surface"
                            size="sm"
                            title="Editar"
                            icon={<Edit3 />}
                            onClick={onEdit}
                        />
                        <IconButton
                            variant="surface"
                            size="sm"
                            title="Preview"
                            icon={<Eye />}
                            onClick={onPreview}
                        />
                    </div>
                </>}
            </div>

            {/* --- Content --- */}
            <div className="p-4">
                <div className="flex items-center justify-between gap-3 mb-1">
                    <h4 className="font-bold text-sm truncate flex-1" style={{ color: 'var(--ink-0)' }}>{name}</h4>
                    
                    {onTogglePin && (
                        <IconButton
                            size="xs"
                            variant="transparent"
                            title={pinned ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                            icon={<Star fill={pinned ? 'currentColor' : 'none'} />}
                            onClick={onTogglePin}
                            customColor={pinned ? '#FFB800' : 'var(--ink-2)'}
                            className={!pinned ? 'opacity-0 group-hover:opacity-40 hover:!opacity-100 transition-opacity duration-200' : ''}
                        />
                    )}
                </div>
                {infoSlot}
            </div>
        </div>
    );
};