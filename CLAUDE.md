# Kerus — AI Context Guide

## Project Overview

**Kerus** is a React + TypeScript SPA for creating technical sheets (fichas técnicas) in cosmetics, food, and industrial formulations.
Core modules: Sheet editor (fichas), Quotation editor, Dashboard, Settings.
Future: C# .NET 9 REST API backend to replace localStorage persistence and add multi-user support.

## Stack

| Layer | Technology |
|---|---|
| UI | React 19, TypeScript, Tailwind CDN (class dark mode) |
| Routing | React Router v6 (file-based route pages: `/fichas-tecnicas`, `/orcamentos`) |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable |
| AI | @google/genai (Gemini) |
| Build | Vite 6 |
| Storage | localStorage (to be replaced by REST API) |

## Directory Structure

```
kerus/
├── docs/               # All project documentation
├── public/             # Static assets
├── src/
│   ├── components/
│   │   ├── common/     # Pure UI primitives (no business logic)
│   │   ├── features/   # Feature-specific components (Editor sections, etc.)
│   │   │   └── Editor/ # Sheet editor sub-components
│   │   ├── layout/     # AppLayout, Sidebar
│   │   ├── modals/     # Modal dialogs (ImportModal, PresetsModal, WizardModal)
│   │   └── ui/         # Shared UI components (HintButton, StatusToggle, SectionCard)
│   ├── constants/      # Static data: presets, themes
│   ├── context/        # React Context: AppContext, ThemeContext
│   ├── hooks/          # Custom hooks: useSheetManager, useQuotationManager, useSheets, etc.
│   ├── i18n/           # Translations: pt-BR, en, es
│   ├── pages/          # Route-level page components (organized by module)
│   │   ├── sheets/     # Sheet pages (list, create/edit, preview)
│   │   ├── quotations/ # Quotation pages (list, create/edit, preview)
│   │   ├── dashboard/  # Dashboard page
│   │   └── settings/   # Settings page
│   ├── services/       # External integrations: geminiService, xmlService
│   ├── types/          # TypeScript type definitions
│   │   ├── sheet.ts    # Sheet (formerly Recipe), Ingredient, Step
│   │   ├── quotation.ts # Quotation, QuotationItem, QuotationPayment
│   │   └── index.ts    # Re-exports all types
│   └── utils/          # Pure utility functions
├── index.html          # Entry point + CSS custom properties (design tokens)
├── CLAUDE.md           # This file
└── package.json
```

## Design System

CSS custom properties defined in `index.html`, toggled via `html.dark` class.
Full reference: `docs/design/DESIGN_SYSTEM_MASTER.md`.

### Tokens

| Token | Dark | Light |
|---|---|---|
| `--surface-0` | `#0e0e0e` | `#EBEBEB` |
| `--surface-1` | `#131313` | `#F3F3F3` |
| `--surface-2` | `#202020` | `#FFFFFF` |
| `--surface-3` | `#2c2c2c` | `#ECECEC` |
| `--ink-0` | `#ffffff` | `#1C1714` |
| `--ink-1` | `#e4e2e1` | `#3D3430` |
| `--ink-2` | `#adaaaa` | `#7C7370` |
| `--primary` | `#FF8C00` | `#E67E00` |
| `--border` | `#222222` | `transparent` |

`--primary` is a constant (`#FF8C00` dark / `#E67E00` light). It is **not user-configurable**. Source: `src/constants/appConfig.ts`.

### No-Line Philosophy

Hierarchy is defined by **surface changes only** — never by 1px borders or shadows.

- `box-shadow` and `shadow-*` are **prohibited** on all components
- `--border: transparent` in light mode — no visible borders between components
- **Hover** must use `--surface-2`, not `--surface-3` (surface-3 ≈ surface-0 in light mode, invisible)
- **Inputs at rest**: `background: surface-3; border: none`
- **Inputs focused**: `border: 2px solid var(--primary)` — the only visible border allowed in light mode
- **Buttons in light mode**: `background: var(--surface-2)` so they elevate above surface-3 headers

### Design token classes

`ds-card`, `ds-button`, `ds-button-primary`, `ds-input`, `ds-select`, `ds-textarea`, `ds-icon-button`

**Never** use hardcoded hex colors or Tailwind `dark:` classes. Always use `var(--ink-0)`, `var(--surface-1)`, etc.

## Key Patterns

### Route structure
- `/fichas-tecnicas` — list page (sheets/fichas técnicas)
- `/fichas-tecnicas/nova` — create (SheetEditorPage with no `:id`)
- `/fichas-tecnicas/:id/editar` — edit (SheetEditorPage loads from `sheets` by id)
- `/fichas-tecnicas/:id/preview` — read-only preview + export
- Same pattern for `/orcamentos` (quotations)

### State management
- `AppContext` — global state: `sheets`, `quotations`, CRUD actions
- `useSheetManager` — mutable state for the sheet being edited (formerly useRecipeManager)
- `useQuotationManager` — mutable state for the quotation being edited
- Both managers are stateless between route changes; pages load from AppContext arrays by `:id`

### i18n
All UI strings go through `useI18n()` → `t('key')`. Translation files in `src/i18n/translations/`.

### StatusToggle
Generic `StatusToggle<T>` component in `src/components/ui/StatusToggle.tsx`.
Use `FORMULA_STATUS_CONFIGS` and `QUOTATION_STATUS_CONFIGS` factory functions.

## Future C# Backend Integration

When the backend is added:
- Replace `useHistory` and `useQuotations` hooks with REST clients (keeping the same interface)
- `AppContext` consumers will not need to change
- API contract documented in `docs/api-contract.md`
- Types in `src/types/` are the source of truth for DTO shapes

## Common Commands

```bash
npm run dev      # Start dev server (localhost:5173)
npm run build    # Production build → dist/
npm run preview  # Preview production build
```
