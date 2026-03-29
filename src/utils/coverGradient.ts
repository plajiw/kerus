/**
 * Theme-aware cover gradient generator.
 *
 * Each cover is a two-stop analogous gradient derived deterministically from
 * the item name (same name → always same hue) and calibrated to the active
 * theme so saturation and lightness always feel at home in the UI.
 */

type ThemeProfile = {
    /** Saturation range [min, max] % */
    sat: [number, number];
    /** Lightness range [min, max] % for the first stop */
    lit: [number, number];
    /** Lightness delta for the second stop (negative = darker) */
    litDelta: number;
    /** Hue shift for the second stop — keeps both stops analogous */
    hueShift: number;
    /** Saturation multiplier for the second stop */
    satMult: number;
};

const PROFILES: Record<string, ThemeProfile> = {
    light:           { sat: [48, 62], lit: [66, 76], litDelta: +10, hueShift: 28, satMult: 0.82 },
    dark:            { sat: [32, 48], lit: [18, 26], litDelta:  -5, hueShift: 30, satMult: 0.80 },
    monokai:         { sat: [22, 36], lit: [20, 28], litDelta:  -5, hueShift: 28, satMult: 0.80 },
    ocean:           { sat: [36, 50], lit: [20, 30], litDelta:  -6, hueShift: 22, satMult: 0.82 },
    sepia:           { sat: [18, 28], lit: [44, 54], litDelta:  +8, hueShift: 20, satMult: 0.85 },
    amoled:          { sat: [18, 28], lit: [10, 16], litDelta:  +4, hueShift: 25, satMult: 0.80 },
    dracula:         { sat: [26, 40], lit: [20, 28], litDelta:  -5, hueShift: 30, satMult: 0.80 },
    'high-contrast': { sat: [58, 75], lit: [18, 26], litDelta:  -6, hueShift: 22, satMult: 0.78 },
};

const FALLBACK_PROFILE = PROFILES['dark'];

function getActiveTheme(): string {
    if (typeof document === 'undefined') return 'dark';
    return document.documentElement.getAttribute('data-theme') ?? 'dark';
}

function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}

/**
 * Returns a deterministic analogous gradient for `name` tuned to the active theme.
 *
 * The optional `isDark` param is accepted for backward-compatibility but ignored —
 * the function reads the current theme directly from the DOM.
 */
export function getCoverGradient(name: string, _isDark?: boolean): string {
    // Primary hash → hue (0–359)
    let h1 = 0;
    for (let i = 0; i < name.length; i++) {
        h1 = (h1 * 31 + name.charCodeAt(i)) & 0xffff;
    }

    // Secondary hash → interpolation factor (0–1) for sat/lit variation
    const t = ((h1 >> 5) & 0xff) / 255;

    const hue1 = h1 % 360;
    const profile = PROFILES[getActiveTheme()] ?? FALLBACK_PROFILE;

    const sat1 = Math.round(lerp(profile.sat[0], profile.sat[1], t));
    const lit1 = Math.round(lerp(profile.lit[0], profile.lit[1], t));

    const hue2 = (hue1 + profile.hueShift) % 360;
    const sat2 = Math.round(sat1 * profile.satMult);
    const lit2 = Math.max(4, Math.min(96, lit1 + profile.litDelta));

    return `linear-gradient(135deg, hsl(${hue1},${sat1}%,${lit1}%), hsl(${hue2},${sat2}%,${lit2}%))`;
}

/** Light themes where alpha should be lower so the color stays readable */
const LIGHT_THEMES = new Set(['light', 'sepia']);

/**
 * Builds a two-stop gradient from a user-chosen accent color (hex).
 * Uses theme-aware alpha so the gradient looks natural in every theme.
 * Identical logic used in both grid cards and table avatars — single source of truth.
 */
export function buildAccentGradient(accentColor: string): string {
    const isLight = LIGHT_THEMES.has(getActiveTheme());
    const a1 = isLight ? '99' : 'cc'; // ~60% / ~80% opacity
    const a2 = isLight ? '55' : '88'; // ~33% / ~53% opacity
    return `linear-gradient(135deg, ${accentColor}${a1}, ${accentColor}${a2})`;
}

/**
 * Returns the letter/watermark text color that contrasts well against
 * any colored gradient background in the current theme.
 */
export function getAvatarTextColor(): string {
    return LIGHT_THEMES.has(getActiveTheme())
        ? 'rgba(0,0,0,0.65)'
        : 'rgba(255,255,255,0.9)';
}
