import React from 'react';
import { Eye, Edit3, Trash2, Check, Star } from 'lucide-react';
import { Recipe } from '../../../types/index';
import { StatusToggle, FORMULA_STATUS_CONFIGS } from '../../ui/StatusToggle';
import { getCoverGradient } from '../../../utils/coverGradient';
import { useTheme } from '../../../context/ThemeContext';

export interface SheetTableProps {
    recipes: Recipe[];
    locale: string;
    statusConfigs: ReturnType<typeof FORMULA_STATUS_CONFIGS>;
    selectedIds: Set<string>;
    onToggleSelect: (id: string) => void;
    onEdit: (id: string) => void;
    onPreview: (id: string) => void;
    onDelete: (id: string) => void;
    onStatusChange: (recipe: Recipe, next: string) => void;
    isFavorite: (id: string) => boolean;
    onTogglePin: (id: string) => void;
    t: (k: string) => string;
}

export const SheetTable: React.FC<SheetTableProps> = ({
    recipes, locale, statusConfigs, selectedIds, onToggleSelect,
    onEdit, onPreview, onDelete, onStatusChange, isFavorite, onTogglePin, t,
}) => {
    const { isDark } = useTheme();

    return (
        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface-2)' }}>
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr style={{ background: 'var(--surface-3)' }}>
                        <th className="w-10 pl-4 pr-0" />
                        <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--ink-2)' }}>
                            Ficha
                        </th>
                        <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--ink-2)' }}>
                            Status
                        </th>
                        <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest hidden md:table-cell" style={{ color: 'var(--ink-2)' }}>
                            Ingredientes
                        </th>
                        <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest hidden lg:table-cell" style={{ color: 'var(--ink-2)' }}>
                            Data
                        </th>
                        <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-right" style={{ color: 'var(--ink-2)' }}>
                            Ações
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {recipes.map((recipe) => {
                        const selected = selectedIds.has(recipe.id);
                        return (
                            <tr
                                key={recipe.id}
                                className="group border-t"
                                style={{ borderColor: 'rgba(72,72,71,0.15)' }}
                            >
                                {/* Checkbox */}
                                <td className="w-10 pl-4 pr-0">
                                    <button
                                        onClick={() => onToggleSelect(recipe.id)}
                                        className={`w-6 h-6 flex items-center justify-center rounded-lg transition-all ${
                                            selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                        }`}
                                        style={selected ? {
                                            background: 'var(--primary)',
                                            color: isDark ? '#180800' : '#ffffff',
                                            border: 'none',
                                        } : {
                                            background: 'transparent',
                                            border: `2px solid ${isDark ? '#767575' : 'var(--ink-2)'}`,
                                        }}
                                        title={selected ? 'Remover seleção' : 'Selecionar'}
                                    >
                                        {selected && <Check size={12} strokeWidth={4} />}
                                    </button>
                                </td>

                                {/* Name + avatar */}
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-black select-none"
                                            style={{
                                                background: recipe.accentColor
                                                    ? `linear-gradient(135deg, ${recipe.accentColor}${isDark ? 'cc' : '99'}, ${recipe.accentColor}${isDark ? '88' : '55'})`
                                                    : getCoverGradient(recipe.nome_formula, isDark),
                                                color: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.6)',
                                            }}
                                        >
                                            {recipe.nome_formula.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-semibold text-sm" style={{ color: 'var(--ink-0)' }}>
                                            {recipe.nome_formula}
                                        </span>
                                    </div>
                                </td>

                                {/* Status */}
                                <td className="px-5 py-4">
                                    <StatusToggle
                                        value={recipe.status ?? 'RASCUNHO'}
                                        configs={statusConfigs}
                                        size="sm"
                                        onChange={(next) => onStatusChange(recipe, next)}
                                    />
                                </td>

                                {/* Ingredients count */}
                                <td className="px-5 py-4 hidden md:table-cell">
                                    <span className="text-sm" style={{ color: 'var(--ink-2)' }}>
                                        {recipe.ingredientes.length} itens
                                    </span>
                                </td>

                                {/* Date */}
                                <td className="px-5 py-4 hidden lg:table-cell">
                                    <span className="text-sm font-mono" style={{ color: 'var(--ink-2)' }}>
                                        {new Intl.DateTimeFormat(locale).format(new Date(recipe.data))}
                                    </span>
                                </td>

                                {/* Actions */}
                                <td className="px-5 py-4">
                                    <div className="flex items-center justify-end gap-1">
                                        <button
                                            onClick={() => onTogglePin(recipe.id)}
                                            className={`ds-icon-button transition-all duration-150 ${
                                                isFavorite(recipe.id) ? 'opacity-100' : ''
                                            }`}
                                            style={{ color: isFavorite(recipe.id) ? '#ffe393' : 'var(--ink-2)' }}
                                            title={isFavorite(recipe.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                                        >
                                            <Star size={14} strokeWidth={2} fill={isFavorite(recipe.id) ? '#ffe393' : 'none'} />
                                        </button>
                                        <button onClick={() => onEdit(recipe.id)} className="ds-icon-button" title={t('common.edit')}>
                                            <Edit3 size={14} />
                                        </button>
                                        <button onClick={() => onPreview(recipe.id)} className="ds-icon-button" style={{ color: 'var(--primary)' }} title={t('common.preview')}>
                                            <Eye size={14} />
                                        </button>
                                        <button onClick={() => onDelete(recipe.id)} className="ds-icon-button-danger" title="Excluir">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};
