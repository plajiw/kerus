/**
 * Global application configuration.
 * Centralized place for versioning and other environment-wide constants.
 */
export const APP_CONFIG = {
    VERSION: 'alpha-1.0.6',
};

/**
 * Brand primary color.
 * Applied as the CSS custom property --primary on startup.
 *
 * NOTE: This is intentionally NOT user-configurable.
 * The color picker feature was removed — the brand color is fixed here.
 * If multi-theme support is reintroduced in the future, move this to
 * a user preference stored in AppPreferences (localStorageService.ts).
 */
export const PRIMARY_COLOR = '#FF8C00';
