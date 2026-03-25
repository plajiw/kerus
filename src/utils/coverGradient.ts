const COVERS = [
    'linear-gradient(135deg, #7c2d12, #431407)',
    'linear-gradient(135deg, #713f12, #3b1f07)',
    'linear-gradient(135deg, #14532d, #052e16)',
    'linear-gradient(135deg, #0c4a6e, #082f49)',
    'linear-gradient(135deg, #4a1d96, #2e1065)',
    'linear-gradient(135deg, #881337, #4c0519)',
    'linear-gradient(135deg, #134e4a, #042f2e)',
    'linear-gradient(135deg, #312e81, #1e1b4b)',
];

export function getCoverGradient(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = (hash * 31 + name.charCodeAt(i)) & 0xffff;
    }
    return COVERS[hash % COVERS.length];
}
