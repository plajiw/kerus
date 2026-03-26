# 📋 SHEET SYSTEM REFACTOR PLAN

**Status**: Planning
**Data**: 2026-03-26
**Objetivo**: Refatorar sistema de "Fórmulas" para "Fichas" (Sheets) com suporte a categorização

---

## 📌 Quick Summary

**Mudança conceitual**: "Fórmula" (específico) → "Ficha" (genérico)

Isso permite:
- Fichas de Fórmulas (cosméticos, alimentos)
- Fichas de Insumos (ingredientes, matérias-primas)
- Fichas de Processos (procedimentos de fabricação)
- Fichas customizadas por usuário

---

## 1️⃣ NOMENCLATURA & ROTAS

### Mudança de Terminologia

| Atual | Novo | Nota |
|-------|------|------|
| **Formulas** | **Sheets** | Termo genérico (fichas técnicas) |
| **Fórmula** (singular) | **Sheet** (singular) | Uma ficha |
| `formula` | `sheet` | Variável, campo |
| `/formulas` | `/sheets` | Rota principal |
| `/formulas/:id/editar` | `/sheets/:id/edit` | Editor (sem accent) |
| `/formulas/:id/preview` | `/sheets/:id/preview` | Preview |

### Routes (Updated)

```
/sheets                      # List all sheets
/sheets/new                  # Create new sheet (wizard)
/sheets/:id/edit             # Edit sheet
/sheets/:id/preview          # Preview sheet
/sheets/:id/duplicate        # Clone sheet

(Quotations permanecem igual por enquanto)
```

### Menu Navigation

```
Before:
├── Dashboard
├── Fórmulas
├── Orçamentos
└── Configurações

After:
├── Dashboard
├── Fichas                   # "Sheets" (translated to pt-BR)
├── Orçamentos
└── Configurações
```

---

## 2️⃣ CATEGORIZAÇÃO DE FICHAS (SheetType)

### Tipos de Fichas (Sheet Types)

```typescript
type SheetType =
  | 'FORMULA'              // Fórmula de cosmético, alimento, etc.
  | 'INGREDIENT'           // Ficha de insumo (matéria-prima)
  | 'PROCESS'              // Procedimento de fabricação
  | 'SPECIFICATION'        // Especificação técnica
  | 'CUSTOM';              // Customizado pelo usuário
```

### Exemplo de UI

**List Page**:
```
┌─────────────────────────────────────┐
│ Fichas (Sheets)                     │
├─────────────────────────────────────┤
│                                     │
│  Tipo: [ Todas ▼ ]                  │
│         [Fórmula] [Insumo] [Custom] │
│                                     │
│  ┌─ Fórmulas (5) ─────────────────┐ │
│  │ • Hidratante Facial             │ │
│  │ • Sabonete Íntimo               │ │
│  └─────────────────────────────────┘ │
│                                     │
│  ┌─ Insumos (3) ──────────────────┐ │
│  │ • Água Destilada                │ │
│  │ • Óleo de Coco                  │ │
│  └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

---

## 3️⃣ MAPEAMENTO DE ARQUIVOS

### Frontend Files

| Atual | Novo | Tipo |
|-------|------|------|
| `src/types/recipe.ts` | `src/types/sheet.ts` | Type definition |
| `src/hooks/useRecipeManager.ts` | `src/hooks/useSheetManager.ts` | Custom hook |
| `src/hooks/useHistory.ts` | `src/hooks/useSheets.ts` | Custom hook |
| `src/pages/FormulasPage.tsx` | `src/pages/SheetsPage.tsx` | Page |
| `src/pages/FormulaEditorPage.tsx` | `src/pages/SheetEditorPage.tsx` | Page |
| `src/pages/FormulaPreviewPage.tsx` | `src/pages/SheetPreviewPage.tsx` | Page |
| `src/components/RecipePrintable.tsx` | `src/components/SheetPrintable.tsx` | Component |
| `src/components/features/Editor/RecipeEditor.tsx` | `src/components/features/Editor/SheetEditor.tsx` | Component |
| `src/constants/appConfig.ts` | (update references) | Config |

### Backend Types (C#)

| Atual | Novo | Tipo |
|-------|------|------|
| `Recipe` entity | `Sheet` entity | Domain model |
| `IRecipeRepository` | `ISheetRepository` | Repository |
| `RecipeEndpoints` | `SheetEndpoints` | API endpoints |
| `CreateRecipeCommand` | `CreateSheetCommand` | Use case |
| `RecipeValidator` | `SheetValidator` | Validator |

---

## 4️⃣ DATA MODEL CHANGES

### Current: Recipe Type

```typescript
interface Recipe {
  id: string;
  nome_formula: string;
  titulo_ficha?: string;
  subtitulo_ficha?: string;
  data: string;
  status?: 'RASCUNHO' | 'FINAL';
  ingredientes: Ingredient[];
  modo_preparo: Step[];
  observacoes?: string;
  // ... other fields
}
```

### New: Sheet Type (Expanded)

```typescript
interface Sheet {
  // Identity
  id: string;
  type: 'FORMULA' | 'INGREDIENT' | 'PROCESS' | 'CUSTOM';

  // Content
  nome: string;                    // "Nome da Ficha"
  titulo?: string;                 // "Formulação Técnica"
  subtitulo?: string;              // Subtitle
  descricao?: string;              // Long description

  // Metadata
  data: string;
  status: 'RASCUNHO' | 'FINAL';
  categoria?: string;              // User-defined category
  tags?: string[];                 // For filtering

  // Type-specific fields
  ingredientes?: Ingredient[];     // For FORMULA, INGREDIENT
  modo_preparo?: Step[];           // For FORMULA, PROCESS
  observacoes?: string;
  especificacoes?: { [key: string]: any };  // For SPECIFICATION

  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;               // User ID (future: multi-user)

  // Styling
  accentColor?: string;
  fontFamily?: string;
  fontSize?: 'small' | 'medium' | 'large';
  stripedRows?: boolean;

  // Advanced
  batch_size?: number;
  ph_min?: number;
  ph_max?: number;
  viscosity?: string;
  formula_version?: string;
}
```

### Backend: C# Entity

```csharp
public class Sheet : AggregateRoot
{
    public string Type { get; set; } // FORMULA, INGREDIENT, PROCESS, etc.
    public string Nome { get; set; }
    public string? Titulo { get; set; }
    public string? Subtitulo { get; set; }
    public string? Descricao { get; set; }
    public string Status { get; set; } = "RASCUNHO";
    public string? Categoria { get; set; }
    public List<string> Tags { get; set; } = new();

    // Content
    public List<Ingredient> Ingredientes { get; set; } = new();
    public List<Step> Steps { get; set; } = new();
    public string? Observacoes { get; set; }

    // Audit
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Guid CreatedBy { get; set; }
}
```

---

## 5️⃣ TRANSLATIONS (i18n)

### New Keys (pt-BR, en, es)

```json
{
  "nav": {
    "sheets": "Fichas",              // Was "Fórmulas"
    "newSheet": "Nova Ficha",        // Was "Nova Fórmula"
    "sheetType": "Tipo de Ficha"
  },
  "sheets": {
    "title": "Fichas Técnicas",
    "empty": "Nenhuma ficha criada",
    "filterByType": "Filtrar por tipo",
    "allTypes": "Todos os tipos",
    "type_FORMULA": "Fórmula",
    "type_INGREDIENT": "Insumo",
    "type_PROCESS": "Processo",
    "type_SPECIFICATION": "Especificação",
    "type_CUSTOM": "Customizado"
  },
  "editor": {
    "sheetTitle": "Ficha de...",     // Context-aware
    "sheetName": "Nome da Ficha"
  },
  "buttons": {
    "saveSheet": "Salvar Ficha",
    "previewSheet": "Preview"
  }
}
```

---

## 6️⃣ FEATURE ROLLOUT

### Phase 1: Rename (Week 1)

✅ Rename files (recipe → sheet)
✅ Update imports/references
✅ Update routes (/formulas → /sheets)
✅ Update UI text (Fórmulas → Fichas)
✅ Update translations
✅ Test: all existing functionality works

**Breaking change**: YES (routes change)
**Data migration**: None (same schema)
**User impact**: URL changes, docs need update

### Phase 2: Categorization (Week 2)

✅ Add `type` field to Sheet model
✅ Add migration (Recipe → Sheet schema)
✅ Add UI filter by type
✅ Implement default templates per type
✅ Update backend validation per type

**Breaking change**: YES (schema change)
**Data migration**: Update all existing recipes → type: 'FORMULA'
**User impact**: New filtering options

### Phase 3: Advanced Categorization (Week 3+)

⏳ User-defined categories
⏳ Sheet templates per type
⏳ Type-specific validators
⏳ Type-specific UI (vary fields by type)

---

## 7️⃣ IMPLEMENTATION CHECKLIST

### Phase 1: Rename (FIRST)

**Frontend**:
- [ ] Rename `recipe.ts` → `sheet.ts`
- [ ] Rename `useRecipeManager` → `useSheetManager`
- [ ] Rename `useHistory` → `useSheets`
- [ ] Rename `FormulasPage` → `SheetsPage`
- [ ] Rename `FormulaEditorPage` → `SheetEditorPage`
- [ ] Rename `FormulaPreviewPage` → `SheetPreviewPage`
- [ ] Rename `RecipeEditor` → `SheetEditor`
- [ ] Rename `RecipePrintable` → `SheetPrintable`
- [ ] Update all imports
- [ ] Update routes in `App.tsx` or routing config
- [ ] Update translations (sheet_*.json)
- [ ] Update AppContext variable names
- [ ] Update menu navigation text
- [ ] Update button labels ("Salvar Ficha" instead of "Salvar Fórmula")
- [ ] Test: all pages work, navigation works, export works

**Backend**:
- [ ] Rename `Recipe` entity → `Sheet`
- [ ] Rename `IRecipeRepository` → `ISheetRepository`
- [ ] Rename `RecipeValidator` → `SheetValidator`
- [ ] Rename `RecipeEndpoints` → `SheetEndpoints`
- [ ] Update all references (comments, logs, tests)
- [ ] Create migration (add SheetType table or enum)
- [ ] Update DbContext
- [ ] Test: API endpoints work, validation works

### Phase 2: Add Categorization

**Frontend**:
- [ ] Add `type` field to Sheet interface
- [ ] Add SheetType dropdown to create flow
- [ ] Add filter by type on list page
- [ ] Show type badge on sheet cards
- [ ] Update editor to show type indicator

**Backend**:
- [ ] Add `Type` property to Sheet entity
- [ ] Create database migration (add Type column)
- [ ] Update Sheet repository queries
- [ ] Add type to CreateSheetCommand validation
- [ ] Add type to API response

**Data Migration**:
- [ ] Query: all existing sheets → UPDATE SET Type = 'FORMULA'
- [ ] Verify no nulls
- [ ] Test queries still work

---

## 8️⃣ MIGRATION GUIDE (For Users)

### What's Changing?

| What | Before | After | Why |
|------|--------|-------|-----|
| **URL** | `/formulas` | `/sheets` | Generic term |
| **Menu** | "Fórmulas" | "Fichas" | More flexible |
| **Terminology** | "Fórmula" | "Ficha" | Supports more types |

### Old Links (Redirects)

```
/formulas          → /sheets         (Redirect 301)
/formulas/:id/editar   → /sheets/:id/edit     (Redirect 301)
/formulas/:id/preview  → /sheets/:id/preview  (Redirect 301)
```

---

## 9️⃣ BACKEND INTEGRATION

### API Changes

**Before**:
```
POST /api/recipes
GET /api/recipes
PUT /api/recipes/{id}
DELETE /api/recipes/{id}
```

**After**:
```
POST /api/sheets
GET /api/sheets
GET /api/sheets?type=FORMULA
PUT /api/sheets/{id}
DELETE /api/sheets/{id}
```

### Request/Response

```typescript
// POST /api/sheets
{
  "nome": "Hidratante Facial",
  "type": "FORMULA",              // NEW
  "titulo": "Formulação Técnica",
  "ingredientes": [...],
  "modo_preparo": [...]
}

// 201 Created
{
  "id": "uuid",
  "type": "FORMULA",              // NEW
  "nome": "Hidratante Facial",
  "status": "RASCUNHO",
  "createdAt": "2026-03-26T10:00:00Z"
}
```

---

## 🔟 RISK ASSESSMENT

### Breaking Changes

**High Impact**:
- ✅ Routes change (/formulas → /sheets)
- ✅ File names change (recipe.ts → sheet.ts)
- ✅ API endpoints change (/api/recipes → /api/sheets)

**Low Impact**:
- ✅ UI text changes (i18n handles)
- ✅ Database schema (add Type column, default 'FORMULA')
- ✅ Types/interfaces (internal refactor)

### Mitigation

1. **For Users**:
   - Automatic 301 redirects for old URLs
   - Clear changelog explaining changes
   - No data loss (all sheets preserved)

2. **For Developers**:
   - Search-and-replace for most changes
   - Clear migration guide
   - Test suite validates compatibility

3. **For API Consumers**:
   - Version the API endpoint (/api/v2/sheets)
   - Support /api/recipes with deprecation warning
   - Provide 6-month migration window

---

## ❓ Questions Before Implementation

1. ✅ Should we support multiple sheet types immediately, or just rename first?
   - **Recommended**: Rename first (Phase 1), add types later (Phase 2)

2. ✅ Should frontend also change from "Fórmula" to "Ficha" terminology?
   - **Recommended**: YES, everywhere (consistency)

3. ✅ Should backend routes be /api/sheets or keep /api/recipes with deprecation?
   - **Recommended**: Move to /api/sheets (cleaner)

4. ✅ Do we need to redirect old routes?
   - **Recommended**: YES (user-friendly)

5. ✅ Should we create sheet templates per type?
   - **Recommended**: Later (Phase 3), after types are working

---

## 📅 TIMELINE

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| **1: Rename** | 3-4 days | All /sheets routes working, same functionality |
| **2: Categorization** | 3-4 days | Type field works, filtering by type |
| **3: Advanced** | 2+ weeks | Templates, custom types, advanced features |

---

## ✅ ACCEPTANCE CRITERIA

### Phase 1 Complete When:
- ✅ All routes changed to /sheets
- ✅ All file names updated (recipe → sheet)
- ✅ UI shows "Fichas" instead of "Fórmulas"
- ✅ All functionality works identically
- ✅ Tests pass (unit + integration)
- ✅ No broken links (user-facing)

### Phase 2 Complete When:
- ✅ Type field saved in database
- ✅ API returns type in response
- ✅ UI filter by type works
- ✅ Data migration: all sheets have type='FORMULA'
- ✅ Type badges visible on list
- ✅ Tests pass (all type combinations)

---

**Next Step**: Approve this plan → Start Phase 1 implementation

**Questions?** See [ARCHITECTURE.md](./ARCHITECTURE.md) or ask in review
