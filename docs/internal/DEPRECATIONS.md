# 📛 DEPRECATED DOCUMENTATION

**Data**: 2026-03-26
**Reason**: Documentation reorganization & consolidation

> Este arquivo lista documentação que foi descontinuada e redirecionamentos para a versão atual.

---

## Removed Files

### `design-system.md` ❌
- **Reason**: Lowercase filename; consolidat with DESIGN_SYSTEM_MASTER
- **Use instead**: [DESIGN_SYSTEM_MASTER.md](./DESIGN_SYSTEM_MASTER.md)

### `DESIGN_SYSTEM.md` ❌
- **Reason**: Older version; superseded by DESIGN_SYSTEM_MASTER
- **Use instead**: [DESIGN_SYSTEM_MASTER.md](./DESIGN_SYSTEM_MASTER.md)

### `DOCUMENTACAO_INDEX.md` ❌
- **Reason**: Replaced with centralized README
- **Use instead**: [README.md](./README.md)

---

## Files to Review (Candidates for Archival)

These are still in the repo but should be reviewed for archival:

### `CHECKLIST_FINAL.md`
- **Status**: Historical (from project delivery)
- **Consider**: Archiving to `/docs/archive/`
- **Keep if**: Used for reference on delivery checklist

### `DOCUMENTACAO_DECISOES.md`
- **Status**: Mostly empty
- **Consider**: Deleting or expanding with current decisions
- **Keep if**: Plan to document architectural decisions

### `GUIA_RAPIDO.md`
- **Status**: Setup guide (duplicates parts of BACKEND_IMPLEMENTATION.md)
- **Consider**: Consolidating with BACKEND_IMPLEMENTATION
- **Keep if**: Needed as quick-start for current frontend devs

### `MELHORIAS_IMPLEMENTADAS.md`
- **Status**: Historical changelog
- **Consider**: Archiving or moving to CHANGELOG
- **Keep if**: Useful for understanding project evolution

### `PLANO_REFATORACAO.md`
- **Status**: Historical (old refactoring plan)
- **Consider**: Archiving
- **Keep if**: Referenced in git history

### `README_FINAL.md`
- **Status**: Setup instructions (older)
- **Consider**: Consolidating with GUIA_RAPIDO or BACKEND_IMPLEMENTATION
- **Keep if**: Different audience/purpose

### `RESUMO_ENTREGA.md`
- **Status**: Project delivery summary (historical)
- **Consider**: Archiving
- **Keep if**: Stakeholder reference

### `index.md`
- **Status**: VitePress index (old)
- **Consider**: Consolidating into README.md
- **Keep if**: VitePress still in use

---

## Redirect Map

| Old | New |
|-----|-----|
| design-system.md | [DESIGN_SYSTEM_MASTER.md](./DESIGN_SYSTEM_MASTER.md) |
| DESIGN_SYSTEM.md | [DESIGN_SYSTEM_MASTER.md](./DESIGN_SYSTEM_MASTER.md) |
| DOCUMENTACAO_INDEX.md | [README.md](./README.md) |
| architecture.md (old) | [ARCHITECTURE.md](./ARCHITECTURE.md) |

---

## Rationale

### Why Consolidate?

1. **Single Source of Truth** — DESIGN_SYSTEM_MASTER, ARCHITECTURE, OBJECTIVES are definitive
2. **Less Confusion** — Reduced file count, clearer hierarchy
3. **Easier Maintenance** — Fewer places to update the same info
4. **Better Navigation** — README.md as hub + related docs linked

### What to Archive?

Historical documents that are valuable but not current:
- CHECKLIST_FINAL.md (was delivery checklist)
- MELHORIAS_IMPLEMENTADAS.md (change log)
- RESUMO_ENTREGA.md (delivery summary)
- PLANO_REFATORACAO.md (old plan)

These can be moved to `/docs/archive/` if needed later.

---

## Migration Timeline

- ✅ **2026-03-26**: Deprecate duplicate docs
- ✅ **2026-03-26**: Create README.md as central hub
- ⏳ **2026-04-01**: Review other candidates for archival
- ⏳ **2026-04-15**: Move old docs to archive (if decision made)

---

## Questions?

See [README.md](./README.md) for navigation or [ARCHITECTURE.md](./ARCHITECTURE.md) for system design.
