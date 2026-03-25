# KERUS — Design System Master Reference

**Versão**: 2.4.0 Obsidian
**Status**: Fonte única de verdade
**Gerado em**: 2026-03-24

> Este documento unifica todos os arquivos de referência visual do projeto (stitch, design-system.md, decisões registradas em memória). Em caso de conflito entre documentos antigos e este, este prevalece.

---

## 1. North Star: The Obsidian Architect

O Kerus rejeita a estética de "planilha clínica" — grade de caixas cinzas e linhas rígidas que drenam a energia do usuário. A visão é o **Obsidian Architect**: um workspace executivo de vidro escuro onde os dados não são apenas exibidos, são **curados**.

Princípios centrais:

- **Quiet Authority** — tipografia editorial em alto contraste sobre tela carvão profunda.
- **No-Line Philosophy** — fronteiras são definidas por mudança de superfície, não por bordas de 1px.
- **Intentional Asymmetry** — variação de largura de cards e espaço em branco guiam o olho.
- **Functional Color** — cor não é decorativa; é âncora semântica.

---

## 2. Paleta de Cores

### 2.1 Tokens Semânticos (Tailwind / CSS)

| Token | Hex | Papel |
|---|---|---|
| `background` / `surface` / `surface-dim` | `#0e0e0e` | Tela base absoluta |
| `surface-container-lowest` | `#000000` | Sombras, verdadeiro preto |
| `surface-container-low` | `#131313` | Sidebar, painéis secundários |
| `surface-container` | `#1a1a1a` | Separadores sutis |
| `surface-container-high` | `#20201f` | Cards, hover de linha |
| `surface-container-highest` / `surface-variant` | `#262626` | Inputs, popovers, chips |
| `surface-bright` | `#2c2c2c` | Popovers flutuantes, dropdowns |
| `primary` / `surface-tint` | `#ff9f4a` | Laranja marca — CTA, foco, ativo |
| `primary-container` / `primary-fixed` / `primary-fixed-dim` | `#fd8b00` | Gradiente do primário, hover |
| `primary-dim` | `#ed8200` | Estado pressionado do primário |
| `on-primary` | `#532a00` | Texto sobre fundo primário (escuro) |
| `on-primary-fixed` | `#180800` | Texto sobre botão primário preenchido |
| `secondary` / `secondary-fixed` / `inverse-surface` | `#e4e2e1` | Texto corpo, não usar branco puro |
| `secondary-container` | `#474747` | Ícone-container, filtro-chips |
| `on-secondary-container` | `#d2d0cf` | Texto sobre secondary-container |
| `on-surface` / `on-background` | `#ffffff` | Texto primário |
| `on-surface-variant` | `#adaaaa` | Texto metadado, labels, ícones secondários |
| `outline` | `#767575` | Checkboxes inativos |
| `outline-variant` | `#484847` | Ghost borders, divisores sutis |
| `tertiary` | `#ffe393` | AI sparkle, destaque especial |
| `tertiary-fixed` / `tertiary-container` | `#ffd33a` | Ícone info/update |
| `error` | `#ff7351` | Estado de erro — texto e bordas |
| `error-container` | `#b92902` | Background de erro severo |
| `error-dim` | `#d53d18` | Hover/pressionado de erro |

### 2.2 CSS Custom Properties (Implementação no Projeto)

Existem dois sets de tokens: dark (`:root` da `html.dark`) e light (`:root` padrão).

#### Modo Escuro (`html.dark`)

| CSS Variable | Papel | Valor |
|---|---|---|
| `--surface-0` | Background / Sidebar | `#0e0e0e` |
| `--surface-1` | Página principal | `#131313` |
| `--surface-2` | Cards | `#202020` |
| `--surface-3` | Toolbar / inputs | `#2c2c2c` |
| `--ink-0` | Texto primário | `#ffffff` |
| `--ink-1` | Texto secundário | `#e4e2e1` |
| `--ink-2` | Texto terciário / meta | `#adaaaa` |
| `--primary` | Accent amber | `#FF8C00` |
| `--border` | Bordas | `#222222` |

#### Modo Claro (`:root` padrão) — Paleta Warm-Neutral

A lógica do modo claro segue tonalidades quentes derivadas do amber primário — não cinzas frios. Cada camada deve evocar "papel de alta qualidade" e ser visualmente agradável ao lado do accent amber.

| CSS Variable | Papel | Valor | Nota |
|---|---|---|---|
| `--surface-0` | Sidebar | `#EAE6E1` | warm stone |
| `--surface-1` | Página principal | `#F4F1ED` | warm parchment |
| `--surface-2` | Cards (elevados) | `#FFFFFF` | crisp white |
| `--surface-3` | Toolbar / inputs | `#EDE8E3` | warm gray |
| `--ink-0` | Texto primário | `#1C1714` | near-black warm |
| `--ink-1` | Texto secundário | `#3D3430` | dark warm brown |
| `--ink-2` | Texto meta/tertiary | `#7C7370` | medium warm gray |
| `--primary` | Accent amber | `#E67E00` | |
| `--border` | Bordas | `#DDD8D2` | warm beige |

**Regra absoluta:** Nunca use cores hardcoded ou classes `dark:` do Tailwind. Use sempre `var(--ink-0)`, `var(--surface-1)`, etc.

```tsx
// CORRETO
style={{ color: 'var(--ink-0)', background: 'var(--surface-1)' }}

// ERRADO
className="text-slate-800 dark:text-slate-100"  // ❌
```

### 2.3 Tokens de Status Semântico

Cores de status são definidas como CSS vars e invertidas automaticamente por tema. **Nunca use valores hex hardcoded para status.**

| Token | Light (texto escuro) | Dark (texto claro) |
|---|---|---|
| `--status-success-*` | bg `rgba(22,163,74,.10)` / text `#15803d` | bg `rgba(16,185,129,.15)` / text `#34d399` |
| `--status-warning-*` | bg `rgba(180,83,9,.10)` / text `#b45309` | bg `rgba(245,158,11,.15)` / text `#fbbf24` |
| `--status-info-*` | bg `rgba(29,78,216,.10)` / text `#1d4ed8` | bg `rgba(99,102,241,.15)` / text `#818cf8` |
| `--status-neutral-*` | bg `rgba(120,113,108,.10)` / text `#57534e` | bg `rgba(255,255,255,.08)` / text `#adaaaa` |
| `--status-error-*` | bg `rgba(185,28,28,.10)` / text `#b91c1c` | bg `rgba(239,68,68,.15)` / text `#f87171` |

```tsx
// USO CORRETO
style={{ background: 'var(--status-success-bg)', color: 'var(--status-success-text)' }}
```

### 2.4 Hierarquia de Superfície

Trate a UI como uma pilha física de materiais. Quanto mais "elevado" o componente, mais clara a camada (em ambos os temas).

```
surface-0  → Sidebar / nav rail   (mais fundida no background)
surface-1  → Página / workspace
surface-2  → Cards (elevados sobre a página)
surface-3  → Toolbar, inputs, dropdowns
```

### 2.5 Sombras (Ambient Shadows)

```css
/* Light mode — sombras quentes e sutis */
--shadow-1: 0 1px 4px rgba(20,15,10,0.06), 0 2px 10px rgba(20,15,10,0.04);
--shadow-ambient: 0 8px 28px -4px rgba(20,15,10,0.14);

/* Dark mode — sombras opacas profundas */
--shadow-1: 0 10px 22px rgba(0,0,0,0.4);
--shadow-ambient: 0 20px 60px -5px rgba(0,0,0,0.4);
```

---

## 3. Tipografia

### 3.1 Font Stack

Sistema dual: autoridade editorial + legibilidade de dados.

| Família | Papel | Tailwind Class |
|---|---|---|
| **Manrope** | Display, Headlines, Labels de navegação | `font-headline` |
| **Inter** | Body, dados, formulários, tabelas | `font-body` / `font-label` |

```html
<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" />
```

### 3.2 Escala Tipográfica

| Nome | Tamanho | Peso | Fonte | Uso |
|---|---|---|---|---|
| Display | 60px / `text-6xl` | 900 `font-black` | Manrope | Hero de página |
| Headline XL | 48px / `text-5xl` | 900 | Manrope | Títulos de seção principais |
| Headline LG | 36px / `text-4xl` | 800 | Manrope | Títulos de grupo |
| Title LG | 20px / `text-xl` | 700 | Manrope | Títulos de card |
| Title MD | 16px / `text-base` | 700 | Manrope | Subtítulos |
| Body Base | 14px / `text-sm` | 400 | Inter | Texto geral, tabelas |
| Body SM | 12px / `text-xs` | 400 | Inter | Metadados, datas |
| Label | 10px / `text-[10px]` | 700 `uppercase tracking-widest` | Inter | Rótulos de seção, headers de coluna |

### 3.3 Hierarquia de Cor no Texto

- `on-surface` (`#ffffff`) → informação primária (valores, títulos)
- `on-surface-variant` (`#adaaaa`) → metadados (datas, contagens, descrições)
- `primary` (`#ff9f4a`) → links ativos, valores de destaque, estado selecionado
- `secondary` (`#e4e2e1`) → corpo longo — **nunca branco puro** para texto extenso

### 3.4 Padrões

```css
/* Títulos de página */
tracking-tighter  /* -0.02em */

/* Labels de formulário / headers de coluna */
uppercase tracking-widest  /* 0.1em */

/* Identificadores (números, datas, códigos) */
font-mono
```

---

## 4. Espaçamento (Base 4px)

| Token | Valor | Uso típico |
|---|---|---|
| `--space-1` | 4px | Gaps micro |
| `--space-2` | 8px | Gap inline, ícone-texto |
| `--space-3` | 12px | Padding horizontal de controle |
| `--space-4` | 16px | Padding de card compacto |
| `--space-5` | 20px | Gap entre seções internas |
| `--space-6` | 24px | Padding de card padrão |
| `--space-8` | 32px | Padding de canvas, gaps de grid |
| `--space-12` | 48px | Separação entre seções maiores |
| `--space-16` | 64px | Major section break — deixa o Obsidian respirar |

**Padrão de padding de card:** `p-6` (24px) para cards normais, `p-8` (32px) para cards de detalhe.

---

## 5. Border Radius

```css
DEFAULT: 0.125rem  /* 2px  — elementos muito pequenos */
lg:      0.25rem   /* 4px  — badges, chips compactos */
xl:      0.5rem    /* 8px  — inputs, botões */
full:    0.75rem   /* 12px — pills, tags, avatares */

/* Containers grandes */
rounded-2xl: 1rem    /* 16px — cards principais */
rounded-[2rem]: 32px /* Large cards / bento sections */
```

**Regra:** Use sempre `8–12px` em containers para suavizar o dark mode sem perder a identidade executiva.

---

## 6. Height Tokens (Controles Interativos)

Todos os controles interativos compartilham tokens de altura para alinhamento óptico uniforme em linha.

| Token | Valor | Uso |
|---|---|---|
| `--h-control-sm` | 32px | Filtros compactos, inline |
| `--h-control` | **36px** | **Padrão — todos os controles** |
| `--h-control-lg` | 44px | Inputs hero (título de fórmula/orçamento) |

```css
/* SEMPRE use o token — nunca hardcode px em controles */
height: var(--h-control);
```

---

## 7. Componentes

### 7.1 Botões

#### Regra Absoluta: Ícone OU Texto — nunca os dois

```tsx
// CORRETO — texto apenas
<button className="ds-button">Salvar</button>
<button className="ds-button-primary">Criar Fórmula</button>

// CORRETO — ícone apenas
<button className="ds-icon-button" title="Voltar"><ArrowLeft size={14}/></button>

// ERRADO — nunca misture
<button className="ds-button"><Save size={14}/> Salvar</button>  // ❌
```

#### Hierarquia de Botões

| Classe | Fundo | Borda | Texto | Uso |
|---|---|---|---|---|
| `ds-button-primary` | `var(--primary)` | — | Branco | 1 por header/toolbar. CTA principal. |
| `ds-button` | Transparente | `var(--border)` | `var(--ink-0)` | Ações secundárias, cancelar, adicionar. |
| `ds-icon-button` | Transparente | — | `var(--ink-2)` | Back, Close, Delete, Zoom, Toggle. |

**Atenção:** Máximo **1 `ds-button-primary`** por header ou barra de ação.

#### Implementação Interna (Tailwind)

```html
<!-- Primary -->
<button class="py-3 px-6 bg-primary text-on-primary-fixed font-bold rounded-xl
               hover:brightness-110 active:scale-95 transition-all">
  Criar Fórmula
</button>

<!-- Secondary / Ghost -->
<button class="py-3 px-6 bg-surface-container-highest text-on-surface font-bold
               rounded-xl hover:bg-surface-bright active:scale-95 transition-all">
  Cancelar
</button>

<!-- Ghost Text Only -->
<button class="py-3 px-4 text-on-surface-variant hover:text-primary font-bold
               rounded-xl transition-all">
  Descartar
</button>

<!-- Icon Only -->
<button class="w-9 h-9 flex items-center justify-center rounded-xl
               text-on-surface-variant hover:bg-surface-bright active:scale-90 transition-all"
        title="Editar">
  <span class="material-symbols-outlined">edit</span>
</button>
```

#### Botão "Create with AI" (Toolset Bar)

Tratado como "Global Utility" — ancora AI no sistema.

```html
<button class="py-3 px-6 bg-primary text-on-primary-fixed font-bold rounded-xl
               flex items-center justify-center gap-2 hover:scale-[0.98] transition-transform">
  <span class="material-symbols-outlined text-sm">auto_awesome</span>
  Criar com IA
</button>
```

- Background: `primary` com gradient opcional `primary → primary-container` a 135°
- Ícone: `auto_awesome` com glow sutil `tertiary` (#ffe393) para denotar inteligência

#### Hint Trigger ("i")

```html
<button class="group w-10 h-10 flex items-center justify-center rounded-full
               bg-surface-bright border border-outline-variant/20
               hover:border-primary/50 transition-all">
  <span class="material-symbols-outlined text-on-surface-variant
               group-hover:text-primary transition-colors text-lg">help_outline</span>
  <!-- Tooltip -->
  <div class="absolute bottom-full mb-3 w-48 p-4 bg-surface-container-highest
              rounded-xl text-[11px] text-on-surface-variant opacity-0
              group-hover:opacity-100 transition-opacity pointer-events-none
              shadow-xl border border-outline-variant/20">
    <strong class="text-on-surface block mb-1">Título</strong>
    Texto explicativo não-obstrutivo.
  </div>
</button>
```

---

### 7.2 Inputs

```tsx
// Padrão
<input className="ds-input w-full" />

// Hero (título da página)
<input className="ds-input ds-input-lg w-full font-bold"
       style={{ height: 'var(--h-control-lg)' }} />

// Com busca
<div className="relative">
  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: 'var(--ink-2)' }} />
  <input className="ds-input w-full pl-9" placeholder="Buscar..." />
</div>
```

**Estados:**
- **Normal:** border `outline-variant @ 15%` (Ghost Border — sentida, não vista)
- **Focus:** border `primary` @ 100%, ring `rgba(255,159,74,0.1)`
- **Error:** border `error` (#ff7351), background mantém `surface-container-highest` (não "semáforo")

---

### 7.3 Select

Status e filtros usam sempre `<select>` — nunca toggle/badge clicável.

```tsx
<select className="ds-select w-full">
  <option>...</option>
</select>
```

#### Status Select Colorido

```tsx
const STATUS_STYLE = {
  RASCUNHO: { bg: 'rgba(245,158,11,0.12)', color: '#b45309', border: 'rgba(245,158,11,0.4)' },
  FINAL:    { bg: 'rgba(16,185,129,0.12)', color: '#047857', border: 'rgba(16,185,129,0.4)' },
  ENVIADO:  { bg: 'rgba(59,130,246,0.12)', color: '#1d4ed8', border: 'rgba(59,130,246,0.4)' },
  APROVADO: { bg: 'rgba(16,185,129,0.12)', color: '#047857', border: 'rgba(16,185,129,0.4)' },
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

### 7.4 Labels de Campo

Padrão único para todos os campos de formulário:

```tsx
<label className="block text-xs font-bold uppercase tracking-widest mb-1.5"
       style={{ color: 'var(--ink-2)' }}>
  Nome do Campo
</label>
```

- Tamanho: `text-xs` (12px)
- Peso: `font-bold`
- Case: `uppercase`
- Tracking: `tracking-widest` (0.1em)
- Cor: `var(--ink-2)` (muted)
- Margem inferior: `mb-1.5` (6px)

---

### 7.5 Cards

```html
<!-- Card padrão de lista/grid -->
<div class="bg-surface-container-high p-8 rounded-2xl
            border border-outline-variant/10
            hover:border-primary/40 transition-all">
  <!-- Cabeçalho do card -->
  <div class="mb-6 flex items-center justify-between">
    <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
      <span class="material-symbols-outlined">functions</span>
    </div>
    <span class="text-[10px] font-black uppercase text-on-surface-variant">Grupo A</span>
  </div>
  <!-- Conteúdo -->
  <h5 class="text-xl font-bold font-headline mb-2">Título do Card</h5>
  <p class="text-xs text-on-surface-variant leading-relaxed mb-6">Descrição secundária.</p>
  <!-- Rodapé -->
  <div class="pt-6 border-t border-outline-variant/10 flex items-center justify-between">
    <span class="text-xs font-bold text-primary">Ver detalhes</span>
    <span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
  </div>
</div>
```

**Ícone em card:** Container `w-12 h-12 rounded-xl` com `bg-primary/10` e ícone na cor semântica do grupo.

---

### 7.6 Tabelas

```html
<div class="bg-surface-container-high rounded-2xl border border-outline-variant/10 overflow-hidden">
  <table class="w-full text-left border-collapse">
    <thead>
      <tr class="bg-surface-container-highest/50">
        <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
          Coluna
        </th>
      </tr>
    </thead>
    <tbody class="divide-y divide-outline-variant/10">
      <tr class="hover:bg-surface-container-low transition-colors">
        <td class="px-6 py-4 font-bold text-sm">Valor</td>
      </tr>
    </tbody>
  </table>
</div>
```

**Regras de tabela:**
- Sem divisores horizontais visíveis — use `divide-outline-variant/10` (quase invisível)
- Hover de linha: `surface-container-low` (shift de superfície, não cor)
- Headers: `text-[10px] font-black uppercase tracking-widest text-on-surface-variant`
- Ações em linha: `ds-icon-button` (ícone apenas), `hover:text-primary` para editar, `hover:text-error` para deletar
- Status badge: `div w-2 h-2 rounded-full` na cor semântica + label texto

---

### 7.7 SectionCard

Componente React de seção colapsável com header, hint, badge e slot de ação.

```tsx
<SectionCard
  title="Ingredientes"
  icon={<FlaskConical size={14} />}
  hint={t('hints.ingredients')}
  collapsible
  defaultOpen={true}
  actions={<button className="ds-button">Adicionar</button>}
>
  <div className="p-5">...</div>
</SectionCard>
```

---

### 7.8 Sortable Row (DnD)

Padrão para linhas arrastáveis (Ingredientes, Etapas, Itens de Orçamento):

```
[GripVertical] [ícone tipo?] [input flex-1] [ds-icon-button ação]
```

- Grip: `GripVertical` size 15, `opacity-30 hover:opacity-70`
- Fundo: `var(--surface-1)`, borda: `var(--border)`
- Novo item: borda `var(--primary)` com ring de glow

---

## 8. Iconografia

Biblioteca: **Material Symbols Outlined** (variável).

```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1" />
<style>
  .material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  }
</style>
```

### 8.1 Coloring Funcional

| Tier | Cor | Quando usar |
|---|---|---|
| **Row A — Primary Nav** | `text-primary` (#ff9f4a) | Destinos core do produto: Dashboard, Fórmulas, Orçamentos |
| **Row B — Utility** | `text-on-surface-variant` (#adaaaa) | Ações secundárias: Settings, Help, Logout |
| **Row C — AI** | `text-tertiary` (#ffe393) | Ações de IA: auto_awesome, psychology |
| **Row D — Destructive** | `text-error` (#ff7351) | Delete, remove, ações irreversíveis |

### 8.2 Ícones por Seção do Kerus

| Seção | Ícone Material |
|---|---|
| Dashboard | `dashboard` |
| Fórmulas | `functions` |
| Orçamentos | `account_balance_wallet` |
| Configurações | `settings` |
| Ajuda | `help_center` |
| Criar com IA | `auto_awesome` |
| Sair | `logout` |

### 8.3 Ícone filled vs outlined

- `'FILL' 0` (outlined): estado inativo, itens de lista, ações secundárias
- `'FILL' 1` (filled): item ativo/selecionado na navegação, estados ON

```html
<!-- Ativo na sidebar -->
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">dashboard</span>

<!-- Inativo -->
<span class="material-symbols-outlined">dashboard</span>
```

---

## 9. Navegação

### 9.1 Sidebar (Side Navigation)

```
Background: surface-container-low (#131313)
Width: 256px (w-64)
Shadow: 40px 0 60px -5px rgba(0,0,0,0.4)
```

**Item ativo:**
```html
<a class="flex items-center gap-3 px-4 py-3 rounded-xl
          bg-surface-container-high text-primary font-bold font-headline text-sm">
  <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">dashboard</span>
  Dashboard
</a>
```

**Item inativo:**
```html
<a class="flex items-center gap-3 px-4 py-3 rounded-xl
          text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface
          font-medium font-headline text-sm transition-colors">
  <span class="material-symbols-outlined">functions</span>
  Fórmulas
</a>
```

### 9.2 Top App Bar

```
Background: background (#0e0e0e) — sticky
Height: 64px (h-16)
Padding: px-8
```

- Logo: `text-primary font-black tracking-tight font-headline`
- Nav links ativos: `text-primary border-b-2 border-primary pb-1`
- Nav links inativos: `text-on-surface-variant hover:text-on-surface`
- Ações (settings, help): `p-2 text-on-surface-variant hover:text-primary transition-colors`

### 9.3 Segmented Control (View Toggle)

```html
<div class="flex p-1 bg-background rounded-xl border border-outline-variant/20">
  <!-- Ativo -->
  <button class="flex-1 py-2 flex items-center justify-center gap-2
                 bg-surface-container-highest text-on-surface rounded-lg font-bold text-xs shadow-lg">
    <span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">list</span>
    Lista
  </button>
  <!-- Inativo -->
  <button class="flex-1 py-2 flex items-center justify-center gap-2
                 text-on-surface-variant hover:text-on-surface transition-colors font-bold text-xs">
    <span class="material-symbols-outlined text-sm">grid_view</span>
    Grid
  </button>
</div>
```

---

## 10. Modais e Overlays

### 10.1 Anatomia do Modal

```
┌─────────────────────────────────────┐
│  HEADER: [Título]           [Close] │  ← título + botão fechar
│─────────────────────────────────────│  (separador por espaço, não linha)
│                                     │
│  CONTENT: form elements, texto      │  ← conteúdo principal
│                                     │
│─────────────────────────────────────│
│  FOOTER:           [Cancel][Confirm]│  ← ações bottom-right
└─────────────────────────────────────┘
```

**Regras:**
1. Ação primária sempre no canto inferior direito (F-pattern scan).
2. Sem bordas entre header/content/footer — use espaçamento vertical e surface-shift.
3. Overlay: `bg-background/60 backdrop-blur-sm`.

```html
<!-- Overlay -->
<div class="fixed inset-0 bg-background/60 backdrop-blur-sm z-40"></div>

<!-- Modal SM — Confirmação (400px) -->
<div class="bg-surface-container-high w-[400px] p-8 rounded-2xl
            shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-outline-variant/20 z-50">
  <div class="flex justify-between items-center mb-6">
    <h3 class="text-lg font-bold font-headline">Eliminar item?</h3>
    <span class="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-on-surface">close</span>
  </div>
  <p class="text-sm text-on-surface-variant mb-8 leading-relaxed">
    Esta ação não pode ser revertida.
  </p>
  <div class="flex gap-3 justify-end">
    <button class="px-4 py-2 text-xs font-bold text-on-surface-variant hover:text-on-surface transition-colors">
      Cancelar
    </button>
    <button class="px-6 py-2.5 text-xs font-bold bg-error text-white rounded-xl
                   hover:bg-error-dim active:scale-95 transition-all">
      Confirmar
    </button>
  </div>
</div>
```

### 10.2 Tamanhos de Modal

| Tamanho | Largura | Uso |
|---|---|---|
| **SM** | 400px | Confirmações, alertas simples |
| **MD** | 640px | Fluxos de tarefa padrão (formulários) |
| **LG** | 800px | Configurações complexas, importação |

### 10.3 Side Panel (Drawer)

Para configurações de alta densidade — **não-bloqueante**, mantém contexto primário visível.

```html
<!-- Drawer direito -->
<div class="fixed inset-y-0 right-0 w-80 bg-surface-container-high
            border-l border-outline-variant/20
            shadow-[-20px_0px_60px_rgba(0,0,0,0.5)] z-40">
  <div class="p-6 h-full flex flex-col">
    <div class="flex justify-between items-center mb-8">
      <h4 class="font-bold text-lg font-headline">Propriedades</h4>
      <span class="material-symbols-outlined text-on-surface-variant cursor-pointer">arrow_forward</span>
    </div>
    <!-- Grupos de propriedades -->
    <div class="flex-1 space-y-8 overflow-y-auto">
      <div class="space-y-4">
        <p class="text-[10px] font-bold text-primary uppercase tracking-widest">Grupo A</p>
        <!-- items -->
      </div>
    </div>
    <!-- Ação de rodapé -->
    <div class="pt-6 border-t border-outline-variant/10">
      <button class="w-full py-3 bg-white/5 border border-white/10 rounded-xl
                     text-xs font-bold hover:bg-white/10 transition-colors">
        Aplicar
      </button>
    </div>
  </div>
</div>
```

**Regra Context Preservation:** Side panels devem manter visibilidade do workspace primário — use backdrop translúcido ou sem overlay.

---

## 11. Feedback & Estados

### 11.1 Skeleton (Lazy Load)

```css
.skeleton-pulse {
  background: linear-gradient(90deg, #1a1a1a 25%, #262626 50%, #1a1a1a 75%);
  background-size: 200% 100%;
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

```html
<!-- Card skeleton -->
<div class="bg-surface-container-high p-6 rounded-xl space-y-4 border border-outline-variant/10">
  <div class="w-12 h-12 rounded-lg skeleton-pulse"></div>
  <div class="h-6 w-3/4 rounded-lg skeleton-pulse"></div>
  <div class="h-4 w-full rounded-lg skeleton-pulse"></div>
  <div class="h-4 w-1/2 rounded-lg skeleton-pulse"></div>
</div>

<!-- List item skeleton -->
<div class="flex items-center gap-4 p-4 bg-surface-container-low rounded-lg">
  <div class="w-10 h-10 rounded-full skeleton-pulse"></div>
  <div class="flex-grow space-y-2">
    <div class="h-4 w-1/3 rounded skeleton-pulse"></div>
    <div class="h-3 w-1/2 rounded skeleton-pulse"></div>
  </div>
</div>
```

### 11.2 Progress Bar

```html
<div class="space-y-2">
  <div class="flex justify-between text-xs font-bold font-headline uppercase tracking-tighter">
    <span>Carregando</span>
    <span class="text-primary">40%</span>
  </div>
  <div class="h-1 bg-surface-container-highest rounded-full overflow-hidden">
    <div class="h-full bg-primary w-[40%]"></div>
  </div>
</div>

<!-- 100% com glow -->
<div class="h-full bg-primary w-full shadow-[0_0_8px_rgba(255,159,74,0.4)]"></div>
```

### 11.3 Toast / Notificação

```html
<!-- Sucesso -->
<div class="flex items-center gap-3 bg-surface-container-highest p-4 rounded-xl
            border-l-4 border-primary shadow-2xl">
  <span class="material-symbols-outlined text-primary">check_circle</span>
  <div class="flex-grow">
    <p class="text-sm font-bold">Operação realizada</p>
    <p class="text-[10px] text-on-surface-variant">Alterações salvas com sucesso.</p>
  </div>
  <button class="text-on-surface-variant hover:text-on-surface">
    <span class="material-symbols-outlined text-sm">close</span>
  </button>
</div>

<!-- Erro -->
<div class="flex items-center gap-3 bg-surface-container-highest p-4 rounded-xl
            border-l-4 border-error shadow-2xl">
  <span class="material-symbols-outlined text-error">error</span>
  ...
</div>
```

**Posicionamento:** Canto superior direito ou inferior, fora do fluxo normal, `z-50`.

### 11.4 Status de Linha (Tabela)

| Estado | Indicador | Cor |
|---|---|---|
| Ativo | `w-2 h-2 rounded-full bg-primary` | #ff9f4a |
| Arquivado | `w-2 h-2 rounded-full bg-outline` | #767575 |
| Revisão Pendente | `w-2 h-2 rounded-full bg-tertiary-fixed` | #ffd33a |
| Erro / Rejeitado | `w-2 h-2 rounded-full bg-error` | #ff7351 |

---

## 12. Layout de Editor

Ambos os editores (Fórmula e Orçamento) usam o componente `EditorShell`:

```
┌────────────────────┬─┬─────────────────────┐
│  Esquerda: form    ││  Direita: preview A4  │
│  max-w-2xl         ││  (redimensionável     │
│  px-5 py-6         ││   30–60% da largura)  │
│  space-y-5         ││                       │
│                    ││  controles de zoom    │
└────────────────────┴─┴─────────────────────┘
```

- Form: `max-w-2xl mx-auto px-5 py-6 space-y-5`
- Seções internas: componente `SectionCard`
- Gap entre seções: `space-y-5` (20px)

### 12.1 Header Bar do Editor

```
[ds-icon-button voltar] [Título h1] ────── [status select] [ds-button cancelar] [ds-button-primary salvar]
```

```tsx
<div className="flex items-center justify-between gap-3 flex-wrap">
  <button className="ds-icon-button" title="Voltar"><ArrowLeft size={14}/></button>
  <h1 className="text-lg font-black uppercase tracking-tight flex-1"
      style={{ color: 'var(--ink-0)' }}>
    Nome da Fórmula
  </h1>
  <select className="ds-select text-xs font-bold uppercase" style={statusStyle} />
  <button className="ds-button">Cancelar</button>
  <button className="ds-button-primary">Salvar</button>
</div>
```

---

## 13. Glassmorphism (Momentos "Create with AI")

Para cards e seções de IA — premium, não para uso geral.

```css
.glass-panel {
  background: rgba(38, 38, 38, 0.6);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}
```

Gradiente do botão de IA:
```css
background: linear-gradient(135deg, #ff9f4a, #fd8b00);
```

---

## 14. Transições & Animações

| Ação | Duração | Easing |
|---|---|---|
| Hover de cor | 200ms | ease |
| Hover de elevação | 200ms | ease-out |
| Active / press | instantâneo (`scale-[0.98]`) | — |
| Fade de overlay | 200ms | ease |
| Slide de modal | 300ms | ease-out |
| Skeleton pulse | 1500ms | linear (infinite) |

```css
/* Hover padrão */
transition: all 0.2s ease;

/* Elevação de card */
.card:hover { transform: translateY(-2px); }

/* Press feedback */
.btn:active { transform: scale(0.98); }
```

---

## 15. Separadores de Seção

Nunca use `<hr>` puro. Use o padrão linha-label-linha:

```html
<div class="flex items-center gap-4">
  <div class="h-px bg-outline-variant flex-grow"></div>
  <h3 class="font-headline font-bold text-on-surface-variant uppercase tracking-widest text-xs">
    Nome da Seção
  </h3>
  <div class="h-px bg-outline-variant w-12"></div>
</div>
```

---

## 16. Breadcrumb / Localização

```html
<div class="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full mb-4">
  <span class="w-2 h-2 rounded-full bg-primary"></span>
  <span class="text-[10px] font-bold text-primary uppercase tracking-tighter">
    Documentação / Overlays
  </span>
</div>
```

---

## 17. Do's e Don'ts

### Faça

- Use `24px` (`space-6`) em seções internas de card, `48–64px` entre seções maiores de página.
- Use `8–12px` de border-radius em todos os containers.
- Use "surface-shifting" para indicar hierarquia — informação mais importante = superfície mais clara.
- Use `on-surface-variant` para metadados (datas, contagens) para criar "recessão visual".
- Use `ds-icon-button` com prop `title` para acessibilidade em todos os ícone-botões.
- Use o token `--h-control` para todos os controles para garantir alinhamento óptico.
- Use `font-mono` para identificadores, datas, valores numéricos em tabelas.
- Use `secondary` (#e4e2e1) para texto longo — nunca branco puro para reduzir fadiga ocular.

### Não faça

- **Nunca** use borda `1px solid` para separar seções ou itens de lista.
- **Nunca** use `dark:` classes do Tailwind — use sempre CSS variables.
- **Nunca** use drop-shadow em cards — deixe as camadas de cor fazerem o trabalho.
- **Nunca** use branco puro (`#ffffff`) para texto corrido — use `secondary`.
- **Nunca** misture ícone + texto em um botão `ds-button` / `ds-button-primary`.
- **Nunca** coloque mais de 1 `ds-button-primary` por header ou barra de ação.
- **Nunca** use toggle/badge para campo de status — use `<select>` colorido.
- **Nunca** hardcode altura de controles — use `var(--h-control)`.

---

## 18. Acessibilidade

- Contraste mínimo 4.5:1 para texto normal, 3:1 para texto grande (18px+).
- Todos os elementos interativos acessíveis por Tab com focus indicator visível.
- Semântica correta: `<button>` para ação, `<a>` para navegação, `<input>` com `aria-label`.
- `ds-icon-button` sempre com prop `title` (tooltip nativo).
- Live regions para feedback de estado: `role="status" aria-live="polite"`.

---

## 19. Referências Internas

| Arquivo | Conteúdo |
|---|---|
| `index.html` | CSS custom properties (design tokens do projeto) |
| `src/components/ui/` | `ds-*` classes implementadas |
| `src/components/features/Editor/` | Layouts de editor (Formula, Quotation) |
| `src/types/` | Tipos TypeScript — fonte de verdade para DTOs |
| `docs/stitch/kerus_dark_ember/DESIGN.md` | Filosofia visual original |
| `docs/stitch/componentes_de_feedback_kerus/` | Referência visual: feedback e estruturas |
| `docs/stitch/wiki_de_padr_es_refinados_kerus/` | Referência visual: ícones, botões, padrões |
| `docs/stitch/wiki_modais_e_configura_es_kerus/` | Referência visual: modais e drawers |

---

*KERUS Design System Master — v2.4.0 Obsidian — 2026-03-24*
