# Kerus — AI Context Guide

## Project Overview

**Kerus** is a React + TypeScript SPA for cosmetics formulators.
Core modules: Formula editor, Quotation editor, Dashboard, Settings.
Future: C# REST API backend (`kerus-api`) to replace localStorage persistence.

## Stack

| Layer | Technology |
|---|---|
| UI | React 19, TypeScript, Tailwind CDN (class dark mode) |
| Routing | React Router v6 (file-based route pages) |
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
│   │   │   └── Editor/ # Formula editor sub-components
│   │   ├── layout/     # AppLayout, Sidebar
│   │   ├── modals/     # Modal dialogs (ImportModal, PresetsModal, WizardModal)
│   │   └── ui/         # Shared UI components (HintButton, StatusToggle, SectionCard)
│   ├── constants/      # Static data: presets, themes
│   ├── context/        # React Context: AppContext, ThemeContext
│   ├── hooks/          # Custom hooks: useRecipeManager, useQuotationManager, useHistory, etc.
│   ├── i18n/           # Translations: pt-BR, en, es
│   ├── pages/          # Route-level page components
│   ├── services/       # External integrations: geminiService, xmlService
│   ├── types/          # TypeScript type definitions
│   │   ├── recipe.ts   # Recipe, Ingredient, Step
│   │   ├── quotation.ts # Quotation, QuotationItem, QuotationPayment
│   │   └── index.ts    # Re-exports all types
│   └── utils/          # Pure utility functions
├── index.html          # Entry point + CSS custom properties (design tokens)
├── CLAUDE.md           # This file
└── package.json
```

## Design System

CSS custom properties defined in `index.html`, toggled via `html.dark` class:

```
--surface-0/1/2/3   background layers (lightest → darkest)
--ink-0/1/2         text (high → low contrast)
--border            border color
--primary           brand color
```

Design tokens classes: `ds-card`, `ds-button`, `ds-button-primary`, `ds-input`, `ds-select`, `ds-textarea`, `ds-icon-button`.

## Key Patterns

### Route structure
- `/formulas` — list page
- `/formulas/nova` — create (FormulaEditorPage with no `:id`)
- `/formulas/:id/editar` — edit (FormulaEditorPage loads from `history` by id)
- `/formulas/:id/preview` — read-only preview + export
- Same pattern for `/orcamentos`

### State management
- `AppContext` — global state: `history`, `quotations`, CRUD actions
- `useRecipeManager` — mutable state for the formula being edited
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
