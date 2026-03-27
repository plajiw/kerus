/**
 * Typed localStorage service.
 * Centralizes all direct localStorage access so keys and serialization
 * are never scattered across components.
 */

// ─── Key registry ──────────────────────────────────────────────────────────
// Add new keys here as the app grows.
export const LS_KEYS = {
    // Data
    HISTORY:      'kerus_history',
    QUOTATIONS:   'kerus_quotations',
    FAVORITES:    'kerus_favorites',
    PAYMENT_MODELS: 'kerus_payment_models',
    COMPANY:      'kerus_company',

    // UI preferences
    PREFS:        'kerus_prefs',
} as const;

// ─── Generic helpers ───────────────────────────────────────────────────────

export function lsGet<T>(key: string, fallback: T): T {
    try {
        const raw = localStorage.getItem(key);
        if (raw === null) return fallback;
        return JSON.parse(raw) as T;
    } catch {
        return fallback;
    }
}

export function lsSet<T>(key: string, value: T): void {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // Quota exceeded or private mode — fail silently
    }
}

export function lsRemove(key: string): void {
    localStorage.removeItem(key);
}

// ─── UI Preferences ────────────────────────────────────────────────────────

export type ThemeMode = 'light' | 'dark' | 'system';

export interface AppPreferences {
    // Views
    sheetsView:         'grid' | 'list';
    quotationsView:     'grid' | 'list';
    // Theme
    themeMode:          ThemeMode;
    animationsEnabled:  boolean;
    // Sidebar
    sidebarCollapsed:   boolean;
    // Editor modes
    advancedMode:       boolean;
    helpMode:           boolean;
}

const PREFS_DEFAULTS: AppPreferences = {
    sheetsView:         'grid',
    quotationsView:     'grid',
    themeMode:          'light',
    animationsEnabled:  true,
    sidebarCollapsed:   false,
    advancedMode:       false,
    helpMode:           true,
};

/** Migrate from the old theme-only key if present. Runs once. */
function migrateOldPrefs(): void {
    const OLD_KEY = 'ficha_tecnica_prefs';
    const old = localStorage.getItem(OLD_KEY);
    if (!old || localStorage.getItem(LS_KEYS.PREFS)) return;
    try {
        const parsed = JSON.parse(old);
        const migrated: Partial<AppPreferences> = {};
        if (parsed.themeMode) migrated.themeMode = parsed.themeMode;
        if (typeof parsed.animationsEnabled === 'boolean') {
            migrated.animationsEnabled = parsed.animationsEnabled;
        }
        lsSet(LS_KEYS.PREFS, { ...PREFS_DEFAULTS, ...migrated });
        localStorage.removeItem(OLD_KEY);
    } catch { /* ignore */ }
}
migrateOldPrefs();

export function getPrefs(): AppPreferences {
    return lsGet<AppPreferences>(LS_KEYS.PREFS, PREFS_DEFAULTS);
}

export function setPrefs(patch: Partial<AppPreferences>): AppPreferences {
    const next = { ...getPrefs(), ...patch };
    lsSet(LS_KEYS.PREFS, next);
    return next;
}
