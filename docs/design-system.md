# Kerus — Design System

## Height Tokens (CSS Custom Properties)

All interactive controls share unified height tokens so rows stay optically aligned.

| Token | Value | Use |
|---|---|---|
| `--h-control-sm` | 32px | Compact / inline filters |
| `--h-control` | 36px | **Standard** (default for all controls) |
| `--h-control-lg` | 44px | Hero inputs (formula title, quotation title) |

```css
/* Always use the token — never hardcode px heights on controls */
height: var(--h-control);
```

---

## Control Classes

### `ds-input`
Standard text / number / date input.

```tsx
<input className="ds-input w-full" />
```

- Height: `--h-control` (36px)
- Padding: `--px-control` (12px)
- Focus ring: `var(--primary)` with `0.1` alpha shadow

### `ds-input-lg`
Hero-size input for primary page titles.

```tsx
<input className="ds-input ds-input-lg w-full font-bold" style={{ height: 'var(--h-control-lg)' }} />
```

### `ds-select`
Dropdown select — same height as `ds-input`.

```tsx
<select className="ds-select w-full">
  <option>...</option>
</select>
```

- Height: `--h-control` (36px)
- Padding: `--px-control` (12px)
- **Never** use custom `style={{ height }}` overrides; use the class.

### `ds-textarea`
Multi-line text area.

```tsx
<textarea className="ds-textarea w-full" rows={4} />
```

- Padding: 12px
- Min-height: 120px

### Search input pattern
A search input wraps `ds-input` with an absolute icon:

```tsx
<div className="relative">
  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--ink-2)' }} />
  <input className="ds-input w-full pl-9" placeholder="Buscar..." />
</div>
```

---

## Button Rules

### Rule: Icon OR Text — never both

Every `ds-button` / `ds-button-primary` contains **either** a label OR an icon — never both.

```tsx
// CORRECT — text only
<button className="ds-button">Salvar</button>

// CORRECT — icon only (use ds-icon-button instead)
<button className="ds-icon-button" title="Salvar"><Save size={16}/></button>

// WRONG — never mix
<button className="ds-button"><Save size={14}/> Salvar</button>  // ❌
```

### `ds-button` (ghost / secondary)
Secondary actions, cancel, filter options.

```tsx
<button className="ds-button">Cancelar</button>
<button className="ds-button" style={{ color: 'var(--primary)' }}>Adicionar</button>
```

- Height: `--h-control` (36px)
- Background: transparent
- Border: `var(--border)`

### `ds-button-primary`
Single primary action per view (Save, Confirm, Create).

```tsx
<button className="ds-button-primary">Salvar Ficha</button>
```

- Height: `--h-control` (36px)
- Background: `var(--primary)`
- Color: white
- Max 1 per header / action bar

### `ds-icon-button`
Square button with a single icon. Used for: Back, Close, Delete, Zoom, Toggle.

```tsx
<button className="ds-icon-button" title="Voltar"><ArrowLeft size={14}/></button>
```

- Width = Height = `--h-control` (36px)
- Always include `title` prop for accessibility
- Always `flex-shrink-0`

---

## Layout — Editor Shell

Both Formula and Quotation editors use `EditorShell`:

```
┌────────────────────┬─┬─────────────────────┐
│   Left: form       ││  Right: A4 preview   │
│   max-w-2xl        ││  (resizable, 30-60%) │
│   px-5 py-6        ││                      │
│   space-y-5        ││  zoom controls       │
└────────────────────┴─┴─────────────────────┘
```

- Form max-width: `max-w-2xl` (672px) centered with `mx-auto`
- Sections: `SectionCard` component with consistent headers
- Section spacing: `space-y-5` (20px)

---

## SectionCard

Consistent collapsible section with header, hint, badge, and action slots.

```tsx
<SectionCard
  title="Título"
  icon={<FlaskConical size={14} />}
  hint={t('hints.something')}
  collapsible
  defaultOpen={false}
  actions={<button className="ds-button">Adicionar</button>}
>
  <div className="p-5">...</div>
</SectionCard>
```

---

## Sortable Row (DnD)

Draggable list item pattern used in Ingredients, Steps, Quotation Items:

```
[GripVertical] [type icon?] [input flex-1] [action: ds-icon-button]
```

- Grip: `GripVertical` size 15, opacity 30→70 on hover
- Action buttons at right: `ds-icon-button` (icon only)
- Background: `var(--surface-1)`, border: `var(--border)`
- When newly added: border `var(--primary)` with glow ring

---

## Color Usage

| Purpose | Token |
|---|---|
| Page / card background | `var(--surface-0)` |
| Section header bg | `var(--surface-1)` |
| Zebra / subtle bg | `var(--surface-2)` |
| Dividers / inputs | `var(--border)` |
| Primary text | `var(--ink-0)` |
| Secondary text | `var(--ink-1)` |
| Muted / labels | `var(--ink-2)` |
| Brand / accent | `var(--primary)` |

**Never** use hard-coded colors or `dark:` Tailwind classes.
**Always** use `style={{ color: 'var(--ink-0)' }}` or similar.

---

## Label Pattern

All form field labels use this pattern:

```tsx
<label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: 'var(--ink-2)' }}>
  Nome do Campo
</label>
```

- Size: `text-xs` (12px)
- Weight: `font-bold`
- Case: `uppercase`
- Tracking: `tracking-widest`
- Color: `var(--ink-2)` (muted)
- Bottom margin: `mb-1.5` (6px)

---

## Status Select Pattern

Status fields use a colored `ds-select` (not a toggle button):

```tsx
const STATUS_STYLE = {
  RASCUNHO: { bg: 'rgba(245,158,11,0.12)', color: '#b45309', border: 'rgba(245,158,11,0.4)' },
  FINAL:    { bg: 'rgba(16,185,129,0.12)', color: '#047857', border: 'rgba(16,185,129,0.4)' },
};

<select
  className="ds-select text-xs font-bold uppercase tracking-wide"
  style={{ color: style.color, background: style.bg, borderColor: style.border }}
  value={status}
  onChange={e => setStatus(e.target.value)}
>
  <option value="RASCUNHO">Rascunho</option>
  <option value="FINAL">Final</option>
</select>
```

---

## Header Bar Pattern (Editor)

```
[ds-icon-button back] [Title h1] ──────── [status select] [ds-button cancel] [ds-button-primary save]
```

- All items in a `flex items-center justify-between gap-3 flex-wrap` row
- Max 1 `ds-button-primary` per header
- Title: `text-lg font-black uppercase tracking-tight`
