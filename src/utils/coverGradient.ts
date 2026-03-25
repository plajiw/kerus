const COVERS_DARK = [
    'linear-gradient(135deg, #7c2d12, #431407)',
    'linear-gradient(135deg, #713f12, #3b1f07)',
    'linear-gradient(135deg, #14532d, #052e16)',
    'linear-gradient(135deg, #0c4a6e, #082f49)',
    'linear-gradient(135deg, #4a1d96, #2e1065)',
    'linear-gradient(135deg, #881337, #4c0519)',
    'linear-gradient(135deg, #134e4a, #042f2e)',
    'linear-gradient(135deg, #312e81, #1e1b4b)',
];

const COVERS_LIGHT = [
    'linear-gradient(135deg, #FAD6B4, #FCE3D0)', // Soft Orange - Warm
    'linear-gradient(135deg, #E9C6A5, #F4DBBF)', // Soft Bronze / Sand
    'linear-gradient(135deg, #C1DBC1, #D8EAD8)', // Soft Sage Green
    'linear-gradient(135deg, #B9D0DF, #D1E2ED)', // Soft Slate
    'linear-gradient(135deg, #D9C3E6, #EBDDF2)', // Soft Lavender
    'linear-gradient(135deg, #E7B8C4, #F3D2D9)', // Soft Rose
    'linear-gradient(135deg, #7bc8acff, #CDECE1)', // Soft Mint
    'linear-gradient(135deg, #C7CDEF, #DEE2F5)', // Soft Blue
];

/**
 * Detecta se o tema escuro está ativo
 * Verifica a classe 'dark' no html.documentElement
 */
function isDarkTheme(): boolean {
    // Fallback para SSR/ambiente sem DOM
    if (typeof document === 'undefined') return true;
    return document.documentElement.classList.contains('dark');
}

/**
 * Gera um gradiente determinístico baseado no nome
 * Retorna gradiente mais escuro em modo dark, mais claro em modo light
 * O mesmo nome sempre retorna a mesma cor (via hash)
 */
export function getCoverGradient(name: string, isDark?: boolean): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = (hash * 31 + name.charCodeAt(i)) & 0xffff;
    }
    const currentIsDark = isDark !== undefined ? isDark : isDarkTheme();
    const covers = currentIsDark ? COVERS_DARK : COVERS_LIGHT;
    return covers[hash % covers.length];
}
