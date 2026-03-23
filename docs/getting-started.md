# Getting Started

## Prerequisites

- Node.js 20+
- npm 10+

## Development

```bash
npm install
npm run dev
# App runs at http://localhost:5173
```

## Build

```bash
npm run build
# Output in dist/
```

## Environment Variables

Copy `.env.example` to `.env` and fill in values:

```
VITE_GEMINI_API_KEY=your_key_here
```

The Gemini key is used by the AI Wizard feature (`src/services/geminiService.ts`).
Without it, the Wizard button still appears but AI generation will fail gracefully.

## Project Layout

See [architecture.md](./architecture.md) for the full component and data-flow breakdown.

## Adding a New Page

1. Create `src/pages/MyPage.tsx`
2. Add route in `src/App.tsx`
3. Add nav item in `src/components/layout/Sidebar.tsx` (optional)
4. Add translation keys to all three locale files in `src/i18n/translations/`

## Adding Translations

Translation files: `src/i18n/translations/pt-BR.json`, `en.json`, `es.json`.
All three files must have the same keys. Use the `t('key')` function from `useI18n()`.

## Design System

Refer to `docs/` for the full design system reference.
Key classes: `ds-card`, `ds-button`, `ds-button-primary`, `ds-input`, `ds-select`, `ds-textarea`.
Colors: use CSS variables `var(--primary)`, `var(--ink-0)`, `var(--surface-0)`, etc.
