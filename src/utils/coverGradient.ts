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
    'linear-gradient(135deg, #FFB861, #FFD0A1)', // Vivid Orange
    'linear-gradient(135deg, #F87171, #FCA5A5)', // Vivid Rose
    'linear-gradient(135deg, #34D399, #6EE7B7)', // Vivid Emerald
    'linear-gradient(135deg, #38BDF8, #7DD3FC)', // Vivid Sky
    'linear-gradient(135deg, #818CF8, #A5B4FC)', // Vivid Indigo
    'linear-gradient(135deg, #A78BFA, #C4B5FD)', // Vivid Violet
    'linear-gradient(135deg, #2DD4BF, #5EEAD4)', // Vivid Teal
    'linear-gradient(135deg, #FBBF24, #FCD34D)', // Vivid Amber
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
