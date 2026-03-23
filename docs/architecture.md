# Architecture

## Overview

Kerus is a client-side SPA today. The architecture is designed so that the persistence layer (currently localStorage) can be swapped for a C# REST API without touching UI components or pages.

```
┌─────────────────────────────────────────────┐
│                  Pages / UI                  │
│  FormulasPage  QuotationsPage  Dashboard     │
└────────────────────┬────────────────────────┘
                     │ React Context
┌────────────────────▼────────────────────────┐
│               AppContext                     │
│  history[]  quotations[]  CRUD actions       │
└────────────────────┬────────────────────────┘
                     │
┌────────────────────▼────────────────────────┐
│          Persistence Hooks                   │
│  useHistory (localStorage)                   │
│  useQuotations (localStorage)                │
└─────────────────────────────────────────────┘
```

### Replacing localStorage with a REST API

1. Rewrite `src/hooks/useHistory.ts` and `src/hooks/useQuotations.ts` to call the API
2. Keep the same return shapes — `AppContext` interface does not change
3. Add auth token storage (e.g., `useAuth` hook)
4. No changes required in any page or UI component

## Component Hierarchy

```
AppLayout
├── Sidebar
└── <Outlet>
    ├── DashboardPage
    ├── FormulasPage
    ├── FormulaEditorPage
    │   ├── MetadataSection
    │   ├── IngredientsSection
    │   ├── PreparationSection
    │   └── RecipePrintable (live preview)
    ├── FormulaPreviewPage
    │   └── RecipePrintable
    ├── QuotationsPage
    ├── QuotationEditorPage
    │   └── QuotationPrintable (live preview)
    ├── QuotationPreviewPage
    │   └── QuotationPrintable
    └── SettingsPage
```

## Data Flow — Formula Edit

```
URL /formulas/:id/editar
  → FormulaEditorPage mounts
  → useEffect reads id from useParams()
  → finds recipe in AppContext.history[]
  → loads into useRecipeManager local state
  → user edits → manager.handleFieldChange()
  → on save → AppContext.saveToHistory(recipe)
  → navigate to /formulas/:id/preview
```

## Theme System

ThemeContext reads `localStorage.theme` on mount, applies `html.dark` class synchronously inside `useState()` initializer to prevent flash. CSS custom properties in `index.html` define all design tokens for both light and dark modes.

## i18n

Three locales: `pt-BR` (default), `en`, `es`. All keys are flat dot-notation strings. The `useI18n()` hook returns `t(key)` and `locale` (BCP 47 tag for `Intl` formatting).
