# 📐 SHEET SYSTEM — VISUAL CHANGES

---

## BEFORE vs AFTER

### Routes

```
BEFORE:
├── http://localhost:3000/formulas                   → List Fórmulas
├── http://localhost:3000/formulas/nova              → Create new
├── http://localhost:3000/formulas/:id/editar        → Edit formula
└── http://localhost:3000/formulas/:id/preview       → Preview

AFTER:
├── http://localhost:3000/sheets                     → List Fichas
├── http://localhost:3000/sheets/new                 → Create new
├── http://localhost:3000/sheets/:id/edit            → Edit sheet
└── http://localhost:3000/sheets/:id/preview         → Preview sheet
```

### Menu Navigation

```
BEFORE:                          AFTER:
┌──────────────────────┐        ┌──────────────────────┐
│  📊 Dashboard        │        │  📊 Dashboard        │
│  📋 Fórmulas         │   →    │  📋 Fichas           │
│  💰 Orçamentos       │        │  💰 Orçamentos       │
│  ⚙️  Configurações    │        │  ⚙️  Configurações    │
└──────────────────────┘        └──────────────────────┘
```

### Sheets List Page

```
PHASE 1 (Just Rename):
┌─────────────────────────────────────────┐
│  Fichas Técnicas                        │
├─────────────────────────────────────────┤
│  [+ Nova Ficha] [⋯ More]                │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────────┐│
│  │ 🧴 Hidratante Facial                ││
│  │    Ficha #1 • 26/03/2026 • FINAL   ││
│  │    [Edit] [Preview] [⋯]             ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │ 🧼 Sabonete Íntimo                  ││
│  │    Ficha #2 • 25/03/2026 • RASCUNHO││
│  │    [Edit] [Preview] [⋯]             ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘


PHASE 2 (With Categorization):
┌─────────────────────────────────────────┐
│  Fichas Técnicas                        │
├─────────────────────────────────────────┤
│  [+ Nova Ficha] [⋯ More]                │
│  Tipo: [ Todos ▼ ]                      │
│        [Fórmula] [Insumo] [Processo]   │
├─────────────────────────────────────────┤
│  ━━ FÓRMULAS (5) ━━━━━━━━━━━━━━━━━━━━ │
│  ┌─────────────────────────────────────┐│
│  │ 🧴 FORMULA  Hidratante Facial       ││
│  │    26/03/2026 • FINAL               ││
│  │    [Edit] [Preview] [⋯]             ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │ 🧼 FORMULA  Sabonete Íntimo         ││
│  │    25/03/2026 • RASCUNHO            ││
│  │    [Edit] [Preview] [⋯]             ││
│  └─────────────────────────────────────┘│
│                                         │
│  ━━ INSUMOS (3) ━━━━━━━━━━━━━━━━━━━━  │
│  ┌─────────────────────────────────────┐│
│  │ 💧 INGREDIENT  Água Destilada      ││
│  │    10/03/2026 • FINAL               ││
│  │    [Edit] [Preview] [⋯]             ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │ 🌴 INGREDIENT  Óleo de Coco         ││
│  │    15/03/2026 • FINAL               ││
│  │    [Edit] [Preview] [⋯]             ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

### Editor Header

```
BEFORE:
┌──────────────────────────────────────────┐
│  ← EDITAR FÓRMULA    [RASCUNHO ▼] [Cancel] [Save Ficha] │
└──────────────────────────────────────────┘

AFTER:
┌──────────────────────────────────────────┐
│  ← EDITAR FICHA    [RASCUNHO ▼] [Cancel] [Save Ficha] │
└──────────────────────────────────────────┘
```

### Buttons & Labels

```
BEFORE                          AFTER
──────────────────────────────────────────
"Nova Fórmula"                  "Nova Ficha"
"Editar Fórmula"                "Editar Ficha"
"Salvar Fórmula"                "Salvar Ficha"
"Preview Fórmula"               "Preview Ficha"
"Exportar Fórmula"              "Exportar Ficha"
"Nome da Fórmula"               "Nome da Ficha"
```

### Database Schema

```
BEFORE (recipes table):
┌─────────────────────────┐
│ recipes                 │
├─────────────────────────┤
│ id          (UUID)      │
│ nome_formula (text)     │
│ titulo_ficha (text?)    │
│ data        (datetime)  │
│ status      (enum)      │
│ ingredientes (json)     │
│ modo_preparo (json)     │
│ observacoes (text?)     │
│ created_at  (datetime)  │
│ updated_at  (datetime)  │
└─────────────────────────┘

AFTER (sheets table):
┌──────────────────────────┐
│ sheets                   │
├──────────────────────────┤
│ id          (UUID)       │
│ type        (enum) ← NEW │
│ nome        (text)       │
│ titulo      (text?)      │
│ subtitulo   (text?)      │
│ data        (datetime)   │
│ status      (enum)       │
│ ingredientes (json)      │
│ modo_preparo (json)      │
│ observacoes (text?)      │
│ created_at  (datetime)   │
│ updated_at  (datetime)   │
└──────────────────────────┘

Migration:
recipes → sheets
nome_formula → nome
titulo_ficha → titulo
subtitulo_ficha → subtitulo
ADD type = 'FORMULA' for all existing rows
```

### File Structure (Frontend)

```
BEFORE:
src/
├── types/
│   └── recipe.ts
├── hooks/
│   ├── useRecipeManager.ts
│   └── useHistory.ts
├── pages/
│   ├── FormulasPage.tsx
│   ├── FormulaEditorPage.tsx
│   └── FormulaPreviewPage.tsx
├── components/
│   ├── RecipePrintable.tsx
│   └── features/Editor/
│       └── RecipeEditor.tsx
└── constants/
    └── appConfig.ts


AFTER:
src/
├── types/
│   └── sheet.ts ← (renamed)
├── hooks/
│   ├── useSheetManager.ts ← (renamed)
│   └── useSheets.ts ← (renamed)
├── pages/
│   ├── SheetsPage.tsx ← (renamed)
│   ├── SheetEditorPage.tsx ← (renamed)
│   └── SheetPreviewPage.tsx ← (renamed)
├── components/
│   ├── SheetPrintable.tsx ← (renamed)
│   └── features/Editor/
│       └── SheetEditor.tsx ← (renamed)
└── constants/
    └── appConfig.ts (update refs)
```

### Type Definitions

```typescript
BEFORE:
interface Recipe {
  id: string;
  nome_formula: string;
  titulo_ficha?: string;
  subtitulo_ficha?: string;
  data: string;
  status: 'RASCUNHO' | 'FINAL';
  ingredientes: Ingredient[];
  modo_preparo: Step[];
  // ...
}


AFTER:
interface Sheet {
  id: string;
  type: 'FORMULA' | 'INGREDIENT' | 'PROCESS' | 'CUSTOM'; ← NEW
  nome: string;
  titulo?: string;
  subtitulo?: string;
  data: string;
  status: 'RASCUNHO' | 'FINAL';
  ingredientes?: Ingredient[];
  modo_preparo?: Step[];
  // ...
}
```

### Context Changes

```typescript
BEFORE:
const { history, addToast, saveToHistory } = useApp();
// history: Recipe[]

AFTER:
const { sheets, addToast, saveSheets } = useApp();
// sheets: Sheet[]
```

### Routes Configuration

```typescript
BEFORE:
<Route path="/formulas" element={<FormulasPage />} />
<Route path="/formulas/nova" element={<FormulaEditorPage />} />
<Route path="/formulas/:id/editar" element={<FormulaEditorPage />} />
<Route path="/formulas/:id/preview" element={<FormulaPreviewPage />} />

AFTER:
<Route path="/sheets" element={<SheetsPage />} />
<Route path="/sheets/new" element={<SheetEditorPage />} />
<Route path="/sheets/:id/edit" element={<SheetEditorPage />} />
<Route path="/sheets/:id/preview" element={<SheetPreviewPage />} />

// Optional: Redirects
<Route path="/formulas/*" element={<Navigate to="/sheets" replace />} />
```

### Translations (i18n)

```json
BEFORE (pt-BR):
{
  "nav": {
    "formulas": "Fórmulas"
  },
  "buttons": {
    "newSheet": "Nova Fórmula",
    "saveSheet": "Salvar Fórmula",
    "editTitle": "Editar Fórmula"
  }
}

AFTER (pt-BR):
{
  "nav": {
    "sheets": "Fichas"
  },
  "buttons": {
    "newSheet": "Nova Ficha",
    "saveSheet": "Salvar Ficha",
    "editTitle": "Editar Ficha"
  },
  "sheets": {
    "type": "Tipo de Ficha",
    "type_FORMULA": "Fórmula",
    "type_INGREDIENT": "Insumo",
    "type_PROCESS": "Processo"
  }
}
```

### Backend API Changes

```
BEFORE:
POST   /api/recipes
GET    /api/recipes
GET    /api/recipes/{id}
PUT    /api/recipes/{id}
DELETE /api/recipes/{id}

AFTER:
POST   /api/sheets
GET    /api/sheets
GET    /api/sheets?type=FORMULA
GET    /api/sheets/{id}
PUT    /api/sheets/{id}
DELETE /api/sheets/{id}

(Optional: Keep /api/recipes with deprecation warning)
```

---

## IMPLEMENTATION IMPACT

### Critical Path

```
1. Backend: Rename Recipe → Sheet entity
2. Database: Add Type column, create migration
3. Frontend: Rename all files & types
4. Routes: Update to /sheets
5. i18n: Update all strings
6. Test: Verify everything works
7. Deploy: Release new version

Estimated: 3-4 days for Phase 1
           1-2 weeks for full categorization
```

### No Data Loss

✅ All existing sheets preserved
✅ All data migrated (exact schema match)
✅ No user action required
✅ Can revert with database rollback (if needed)

### User Communication

- 📧 Email: "We've renamed 'Formulas' to 'Sheets' for flexibility"
- 📖 Changelog: Clear documentation of changes
- 🔄 Redirects: Old URLs → New URLs (automatic)
- ❓ Help: Updated guides at docs/guides/

---

**Ready to implement?** → See SHEET_SYSTEM_PLAN.md for Phase 1 checklist
