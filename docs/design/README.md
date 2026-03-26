# 🎨 DESIGN SYSTEM

> Single source of truth for Kerus visual identity and component patterns.

## What's in this folder?

This folder contains **design system documentation** — the authoritative reference for all visual and component-related decisions.

### Documents

| Document | Purpose | For |
|----------|---------|-----|
| **DESIGN_SYSTEM_MASTER.md** | Single source of truth: colors, typography, spacing, components, patterns | Designers, Frontend developers |

## The Philosophy

Kerus design follows **"The Obsidian Architect"** philosophy:
- **Quiet Authority** — Editorial typography in high contrast
- **No-Line Philosophy** — Surfaces define boundaries, not borders
- **Intentional Asymmetry** — Variation guides the eye
- **Functional Color** — Color is semantic, not decorative

## Quick Reference

### Color Tokens

**Dark Mode (Primary)**:
```
--surface-0: #0e0e0e  (Background)
--surface-1: #131313  (Page)
--surface-2: #202020  (Cards)
--surface-3: #2c2c2c  (Toolbar/inputs)
--ink-0:     #ffffff  (Text primary)
--primary:   #FF8C00  (Amber accent)
```

**Light Mode**:
```
--surface-0: #EAE6E1  (Sidebar)
--surface-1: #F4F1ED  (Page)
--surface-2: #FFFFFF  (Cards)
--surface-3: #EDE8E3  (Toolbar/inputs)
--ink-0:     #1C1714  (Text primary)
--primary:   #FF8C00  (Amber accent)
```

### Typography

| Usage | Font | Weight | Size |
|-------|------|--------|------|
| Headlines | Manrope | 700-800 | 24px+ |
| Body text | Inter | 400-500 | 14-16px |
| Data/code | Inter Mono | 400 | 13px |

### Spacing Scale

Based on 4px base:
```
4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 56px, 64px
```

### Component Rules

- ✅ Use **HintButton** for "?" tooltips
- ✅ Use **SectionCard** for editor sections
- ✅ Use **StatusToggle** for semantic status switches
- ✅ Use **Lucide icons** (size: 14-20px)
- ❌ Don't create new button styles
- ❌ Don't use custom colors outside token system

## Who should read this?

- **Designers**: DESIGN_SYSTEM_MASTER for full reference
- **Frontend Developers**: DESIGN_SYSTEM_MASTER sections 2-5 (colors, typography, spacing, components)
- **Product Managers**: Philosophy (section 1) for context

## Making Changes

All design changes MUST be documented here before implementation:
1. Update DESIGN_SYSTEM_MASTER.md
2. Create a PR with design docs
3. Review with team
4. Merge & implement in code

This ensures visual consistency across the entire app.

**Last updated**: 2026-03-26
**Maintained by**: Design & Frontend Team
