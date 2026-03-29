import { Recipe } from '../types';

export const UI_THEMES = [
    { nameKey: 'themes.safetyOrange', color: '#FF8C00' },
    { nameKey: 'themes.royalBlue', color: '#2563EB' },
    { nameKey: 'themes.emeraldGreen', color: '#10B981' },
    { nameKey: 'themes.slateDark', color: '#475569' },
];

export const FORMULA_THEMES = [
    { nameKey: 'themes.safetyOrange', color: '#FF8C00' },
    { nameKey: 'themes.royalBlue', color: '#2563EB' },
    { nameKey: 'themes.emeraldGreen', color: '#10B981' },
    { nameKey: 'themes.roseRed', color: '#E11D48' },
    { nameKey: 'themes.violet', color: '#7C3AED' },
    { nameKey: 'themes.teal', color: '#0D9488' },
    { nameKey: 'themes.slate', color: '#475569' },
];

export const SHEET_FONTS = [
    // ── Sans-serif — clean & professional ──────────────────────
    { name: 'Manrope',          value: '"Manrope", sans-serif' },
    { name: 'Inter',            value: '"Inter", sans-serif' },
    { name: 'DM Sans',          value: '"DM Sans", sans-serif' },
    { name: 'Lato',             value: '"Lato", sans-serif' },
    { name: 'Raleway',          value: '"Raleway", sans-serif' },
    { name: 'Nunito',           value: '"Nunito", sans-serif' },
    { name: 'Josefin Sans',     value: '"Josefin Sans", sans-serif' },
    // ── Serif — editorial & scientific ──────────────────────────
    { name: 'Playfair Display', value: '"Playfair Display", serif' },
    { name: 'Merriweather',     value: '"Merriweather", serif' },
    { name: 'Libre Baskerville',value: '"Libre Baskerville", serif' },
    // ── Monospace — technical / lab ──────────────────────────────
    { name: 'Source Code Pro',  value: '"Source Code Pro", monospace' },
];

export const FORMULA_FONT_SIZES = [
    { nameKey: 'fontSizes.small', value: 'small' },
    { nameKey: 'fontSizes.medium', value: 'medium' },
    { nameKey: 'fontSizes.large', value: 'large' },
] as const;

export const isUiThemeColor = (value?: string) =>
    !!value && UI_THEMES.some((theme) => theme.color === value);

export const isFormulaThemeColor = (value?: string) =>
    !!value && FORMULA_THEMES.some((theme) => theme.color === value);

export const isSheetFont = (value?: string) =>
    !!value && SHEET_FONTS.some((font) => font.value === value);

export const isSheetFontSize = (value?: string): value is Recipe['fontSize'] =>
    value === 'small' || value === 'medium' || value === 'large';
