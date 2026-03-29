# KERUS — Design System Master Reference v3.0

**Arquivo fonte:** `src/index.css`
**Última revisão:** 2026-03-28

> Este documento é a fonte única de verdade para todas as decisões visuais do projeto.
> Em conflito com qualquer outro documento, este prevalece.

---

## 1. Filosofia

### No-Line Philosophy

Hierarquia visual é definida **exclusivamente por mudança de superfície** — nunca por bordas de 1px ou sombras.

| PROIBIDO | OBRIGATÓRIO |
|---|---|
| `box-shadow` em qualquer componente | Usar `var(--surface-N)` para elevação |
| `border` visível entre componentes | `outline` apenas em inputs com foco |
| Cores hexadecimais hardcoded | Sempre `var(--token)` |
| Classes Tailwind `dark:` | Sempre `var(--ink-N)`, `var(--surface-N)` |
| `border-color` visível no light mode | `--border: transparent` no light |

**Por que `--border` é `transparent` no light mode?**
No tema claro, as superfícies têm contraste suficiente para criar hierarquia sem bordas. Nos temas escuros, uma borda sutil é necessária porque as superfícies escuras têm menos contraste natural.

---

## 2. Sistema de Temas

### Como funciona

O tema é aplicado via `data-theme` no `<html>`. Cada tema define exatamente as mesmas 24 variáveis CSS. Trocar o tema = trocar os valores, não as variáveis.

```
document.documentElement.setAttribute('data-theme', 'dark');
```

Componentes React **nunca** contêm valores de cor — toda cor vem de `var(--token)`.

### Temas disponíveis

| Chave `data-theme` | Nome UI | Tipo | Primary |
|---|---|---|---|
| `light` | Claro | claro | `#E67E00` |
| `dark` | Escuro | escuro | `#FF8C00` |
| `monokai` | Monokai | escuro | `#f92672` |
| `ocean` | Ocean | escuro | `#38bdf8` |

O seletor de temas está em `src/pages/settings/SettingsPage.tsx`.
O tipo `ThemeMode` está em `src/services/localStorageService.ts`.
O script de inicialização (antes do React) está em `index.html`.

### Contrato de tema — 24 variáveis obrigatórias

Todo bloco `[data-theme="X"]` em `src/index.css` DEVE declarar estas variáveis, nesta ordem.
Adicionar ou remover uma variável exige atualizar os **4 blocos**.

```css
/* SURFACES (4) */
--surface-0        /* Sidebar, camada mais profunda */
--surface-1        /* Fundo da página */
--surface-2        /* Cards, corpo de componentes */
--surface-3        /* Toolbar, inputs, botões, headers */

/* GRADIENTS (2) */
--surface-bg-gradient
--surface-card-gradient

/* BORDER (1) */
--border           /* transparent no light; cor sutil nos temas escuros */

/* BRAND (3) */
--primary
--primary-rgb      /* para rgba(var(--primary-rgb), 0.12) */
--primary-container

/* INK (3) */
--ink-0            /* Títulos, texto principal */
--ink-1            /* Texto secundário, ícones */
--ink-2            /* Labels, placeholders */

/* STATUS (10 = 5 tipos × 2 vars) */
--status-success-bg    --status-success-text
--status-warning-bg    --status-warning-text
--status-info-bg       --status-info-text
--status-neutral-bg    --status-neutral-text
--status-error-bg      --status-error-text
```

### Como adicionar um novo tema

1. Copie o bloco completo de um tema existente em `src/index.css`
2. Altere os 24 valores — mantenha a mesma ordem
3. Adicione o tema ao tipo `ThemeMode` em `src/services/localStorageService.ts`
4. Adicione ao array `themes` em `src/pages/settings/SettingsPage.tsx` com as cores de preview
5. Atualize o array de temas válidos no script inline de `index.html`
6. Registre na tabela de temas disponíveis acima

---

## 3. Tokens de Superfície

### Hierarquia de elevação

```
--surface-0   Sidebar / camada base
   └─ --surface-1   Fundo da página
          └─ --surface-2   Cards, painéis
                 └─ --surface-3   Inputs, toolbar, botões
```

Em temas claros: superfícies mais claras = mais elevadas.
Em temas escuros: superfícies mais claras = mais elevadas.

### Quando usar cada surface

| Token | Componente | Notas |
|---|---|---|
| `--surface-0` | Sidebar | Camada mais escura/profunda |
| `--surface-1` | `<main>` background | Fundo neutro da página |
| `--surface-2` | `.ds-card`, `.ds-panel` | Conteúdo elevado sobre o fundo |
| `--surface-3` | `<input>`, `.ds-button`, `<select>`, toolbar headers | Controles interativos, "rebaixados" dentro do card |

---

## 4. Tokens de Cor

### Brand

| Token | Uso |
|---|---|
| `--primary` | Botão primário, links, indicador de foco, destaques |
| `--primary-rgb` | Para `rgba(var(--primary-rgb), 0.12)` em overlays e hovers suaves |
| `--primary-container` | Hover/pressed do primary |

### Ink — Texto e ícones

| Token | Light | Dark | Uso |
|---|---|---|---|
| `--ink-0` | `#1C1714` | `#ffffff` | Títulos, texto principal |
| `--ink-1` | `#3D3430` | `#e4e2e1` | Texto secundário, ícones, labels de campo |
| `--ink-2` | `#7C7370` | `#adaaaa` | Placeholders, labels uppercase, texto mudo |

### Status

| Tipo | Uso |
|---|---|
| `success` | Ação concluída, status aprovado/ativo |
| `warning` | Requer atenção, rascunho, pendente |
| `info` | Informação neutra, contexto adicional |
| `neutral` | Estado padrão, sem polaridade semântica |
| `error` | Falha, exclusão, ação destrutiva |

Regra: use sempre o par `--status-{tipo}-bg` + `--status-{tipo}-text`. Nunca um sem o outro.

---

## 5. Constantes Compartilhadas

Estas variáveis são definidas em `:root` e **nunca mudam entre temas**.

### Raio de borda

| Token | Valor | Uso |
|---|---|---|
| `--radius-lg` | 12px | Cards, modais, painéis |
| `--radius-md` | 8px | Inputs, selects |
| `--radius-sm` | 6px | **Padrão**: botões, badges, tags |

### Alturas de controle

Todos os controles interativos DEVEM usar uma dessas alturas — nunca `height` hardcoded.

| Token | Valor | Uso |
|---|---|---|
| `--h-control-sm` | 32px | Botões compactos `.ds-button-sm`, inputs densos |
| `--h-control` | 36px | **Padrão**: todos os controles |
| `--h-control-lg` | 44px | CTAs de destaque, inputs grandes |

### Tipografia de controles

| Token | Valor | Uso |
|---|---|---|
| `--text-control` | 13px | Texto em inputs, botões, selects |
| `--text-label` | 11px | Rótulos uppercase sobre campos |

---

## 6. Tamanhos de Ícone

Biblioteca: **Lucide React** — `import { IconName } from 'lucide-react'`

| Token CSS | Valor | `size=` | Contexto |
|---|---|---|---|
| `--icon-xs` | 12px | `size={12}` | Labels densos, badges de status |
| `--icon-sm` | 14px | `size={14}` | **Padrão**: botões, tabelas, toolbar |
| `--icon-md` | 18px | `size={18}` | Navegação lateral, headers de seção |
| `--icon-lg` | 20px | `size={20}` | Cards KPI, títulos de modal |

Tamanhos 32, 40, 48 são reservados para **ilustrações de estado vazio** — nunca use em controles UI.

**Regras de ícone por contexto:**

```
.ds-button ou .ds-button-primary  →  size={14}  (--icon-sm)
.ds-icon-button                   →  size={14}  (--icon-sm)
Sidebar (NavRow)                  →  size={18}  (--icon-md)
Header de seção / modal           →  size={14}  (--icon-sm)
Card KPI / dashboard              →  size={20}  (--icon-lg)
```

---

## 7. Componentes Design System

Todos os componentes visuais são criados usando as classes `.ds-*` definidas em `src/index.css`.
**Nunca recriar esses estilos inline ou via Tailwind.**

### 7.1 Botões com texto

#### Hierarquia de ênfase

```
ds-button-primary  ← Alta ênfase   (1 por seção)
ds-button          ← Média ênfase  (maioria das ações)
ds-button-ghost    ← Baixa ênfase  (cancelar, voltar, limpar)
ds-button-danger   ← Destrutivo    (excluir com rótulo)
```

#### `.ds-button-primary`

- bg: `var(--primary)` / color: `#ffffff`
- Altura: `--h-control` (36px) / ícone: `size={14}`
- hover: `brightness(1.1)` / active: `scale(0.98)`
- **Regra**: máximo 1 por seção visual. Nunca dois lado a lado.

#### `.ds-button`

- bg: `var(--surface-3)` / color: `var(--ink-1)`
- Altura: `--h-control` (36px)
- hover: `brightness(0.94)` light / `brightness(1.18)` dark

#### `.ds-button-ghost`

- bg: `transparent` / color: `var(--ink-1)`
- hover: `background: var(--surface-3)`
- Usar quando `.ds-button` seria pesado demais visualmente.

#### `.ds-button-danger`

- bg: `transparent` / color: `var(--status-error-text)`
- hover: `background: var(--status-error-bg)`
- O visual nasce cinza/neutro e só fica vermelho no hover — evita alarmismo.

#### `.ds-button-sm` — modificador de tamanho

Combinar com qualquer base:

```html
<button class="ds-button ds-button-sm">Ação</button>
<button class="ds-button-primary ds-button-sm">Salvar</button>
```

- Altura: `--h-control-sm` (32px) / font-size: 12px

---

### 7.2 Botões de ícone (quadrados, sem texto)

#### `.ds-icon-button`

- Dimensões: `--h-control` × `--h-control` (36 × 36px)
- bg: `transparent` / color: `var(--ink-1)`
- hover: `background: var(--surface-3)`

#### `.ds-icon-button-primary`

- Dimensões: 36 × 36px
- bg: `var(--primary)` / color: `#ffffff`
- Usar para a ação de ícone principal em um grupo.

#### `.ds-icon-button-danger`

- Dimensões: 36 × 36px
- Nasce em `--ink-2` (mudo/cinza)
- hover: `--status-error-bg` + `--status-error-text`
- Usar para excluir/remover em linhas de tabela.

#### `.ds-icon-button-sm` — modificador de tamanho

```html
<button class="ds-icon-button ds-icon-button-sm">
  <X size={12} />
</button>
```

- Dimensões: `--h-control-sm` × `--h-control-sm` (32 × 32px)

---

### 7.3 Controles de formulário

Todos os controles usam `--surface-3` como background e `outline 2px solid var(--primary)` no foco.

| Classe | Altura | Padding | Uso |
|---|---|---|---|
| `.ds-input` | 36px | `0 12px` | Input de texto padrão |
| `.ds-input-lg` | 44px | `0 14px` | Input de destaque, busca principal |
| `.ds-select` | 36px | `0 12px` | Dropdown |
| `.ds-textarea` | mín. 120px | `12px` | Campo de texto longo |

**Regra de foco**: o `outline` de foco é o único `border` visível permitido na interface.

---

### 7.4 Layout

#### `.ds-card` / `.ds-panel`

- bg: `var(--surface-2)` / border-radius: `var(--radius-lg)`
- **Proibido**: `box-shadow`, `border`.

```html
<section class="ds-card p-6">...</section>
```

#### `.ds-drop`

- bg: `var(--surface-1)` / border: `2px dashed var(--border)`
- Para zonas de drag-and-drop.

---

### 7.5 Feedback

#### `.skeleton`

- Shimmer animado: `surface-2 → surface-3 → surface-2`
- Usar para estados de carregamento onde o layout final é conhecido.

#### `.loading-overlay` + `.loading-card` + `.loading-spinner`

- Overlay modal com backdrop blur e spinner.
- Usar para operações assíncronas que bloqueiam a UI (exportação, IA).

---

## 8. Checklist para novos componentes

- [ ] Zero cores hexadecimais hardcoded no componente
- [ ] Zero classes Tailwind `dark:` usadas
- [ ] Zero `box-shadow` ou `border` entre componentes
- [ ] Alturas usam `var(--h-control*)` — nunca `height` hardcoded
- [ ] Ícones seguem o padrão de tamanho da seção 6
- [ ] Botões usam `.ds-button*` ou `.ds-icon-button*`
- [ ] Inputs/selects usam `.ds-input`, `.ds-select` ou `.ds-textarea`
- [ ] Cards/painéis usam `.ds-card` ou `.ds-panel`
- [ ] Status visuais usam o par `--status-{tipo}-bg` + `--status-{tipo}-text`

---

## 9. Adicionando novos tokens

Se uma necessidade de cor não é atendida pelos tokens existentes:

1. Confirme que nenhum token existente serve
2. Defina o token com nome semântico (ex: `--accent-secondary`)
3. Adicione ao contrato: atualize os 4 blocos de tema em `src/index.css`
4. Documente aqui na seção correspondente
5. Atualize o contador de variáveis no contrato (atualmente **24**)

**Nunca** adicione um token a menos de 4 temas ou use um valor hardcoded como solução temporária.
