# 📚 KERUS DOCUMENTATION

**Versão**: 2.0.0 (Full-Stack Ready)
**Data**: 2026-03-26

> Documentação centralizada do Kerus. Escolha seu ponto de entrada abaixo.

---

## 🚀 START HERE (escolha um)

### Para **Product Managers / Stakeholders**
1. 📄 [OBJECTIVES.md](./OBJECTIVES.md) — Visão, nicho, features, roadmap
2. 📊 [ROADMAP_EXECUTIVO.md](./ROADMAP_EXECUTIVO.md) — Timeline 5 fases, KPIs, projeções
3. 🎯 [PROJECT_REVIEW.md](./PROJECT_REVIEW.md) — Análise completa, pontos fortes/fracos

### Para **Developers (Frontend)**
1. 🏗️ [ARCHITECTURE.md](./ARCHITECTURE.md) — Arquitetura unificada (Frontend + Backend)
2. 🎨 [DESIGN_SYSTEM_MASTER.md](./DESIGN_SYSTEM_MASTER.md) — Design tokens, componentes, padrões
3. 📖 [CLAUDE.md](../CLAUDE.md) — Project context (no root)
4. 🔧 [FRONTEND_MIGRATION.md](./FRONTEND_MIGRATION.md) — Como migrar para API (quando backend estiver pronto)

### Para **Developers (Backend)**
1. 🏗️ [ARCHITECTURE.md](./ARCHITECTURE.md) — Arquitetura (.NET 9, estrutura, dados)
2. 🔧 [BACKEND_IMPLEMENTATION.md](./BACKEND_IMPLEMENTATION.md) — Step-by-step: projeto, DB, endpoints
3. 📋 [api-contract.md](./api-contract.md) — Endpoints, request/response, status codes

### Para **Designers**
1. 🎨 [DESIGN_SYSTEM_MASTER.md](./DESIGN_SYSTEM_MASTER.md) — Paleta, tipografia, componentes, grid
2. 📄 [DOCUMENTACAO_FUNCIONAL.md](./DOCUMENTACAO_FUNCIONAL.md) — Features, estados, fluxos

---

## 📖 MAIN DOCUMENTATION

### Core Architecture & Strategy
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** — Arquitetura completa (Frontend React + Backend .NET 9)
- **[OBJECTIVES.md](./OBJECTIVES.md)** — Visão de negócio, nicho, features, personas
- **[DOCUMENTACAO_FUNCIONAL.md](./DOCUMENTACAO_FUNCIONAL.md)** — Features do app, fluxos, comportamentos

### Implementation Guides
- **[BACKEND_IMPLEMENTATION.md](./BACKEND_IMPLEMENTATION.md)** — Setup C# .NET 9, guia step-by-step
- **[FRONTEND_MIGRATION.md](./FRONTEND_MIGRATION.md)** *(em breve)* — Migrar frontend para API
- **[GUIA_RAPIDO.md](./GUIA_RAPIDO.md)** — Setup dev, troubleshooting, testes

### Design System
- **[DESIGN_SYSTEM_MASTER.md](./DESIGN_SYSTEM_MASTER.md)** — Fonte única de verdade (tokens, componentes, padrões)
- **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** *(antigo)* — Ver DESIGN_SYSTEM_MASTER em vez disso

### Planning & Project Management
- **[ROADMAP_EXECUTIVO.md](./ROADMAP_EXECUTIVO.md)** — 5 fases, timeline, entregáveis, KPIs
- **[PROJECT_REVIEW.md](./PROJECT_REVIEW.md)** — Análise: pontos fortes, fracos, recomendações

### Reference
- **[api-contract.md](./api-contract.md)** — Endpoints, DTOs, status codes
- **[MELHORIAS_IMPLEMENTADAS.md](./MELHORIAS_IMPLEMENTADAS.md)** — Changes log, antes/depois

---

## 📋 PROJECT STRUCTURE

```
kerus/
├── frontend/                    # React SPA (current src/)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                     # C# .NET 9 (planned)
│   ├── Kerus.sln
│   ├── Kerus.Domain/
│   ├── Kerus.Application/
│   ├── Kerus.Infrastructure/
│   ├── Kerus.Api/
│   └── Kerus.Tests/
│
├── docs/                        # Documentation (you are here)
│   ├── README.md               # This file
│   ├── ARCHITECTURE.md         # Full-stack architecture
│   ├── OBJECTIVES.md           # Vision, roadmap, features
│   ├── DESIGN_SYSTEM_MASTER.md # Design tokens & components
│   ├── BACKEND_IMPLEMENTATION.md # Setup backend
│   └── ... (other docs)
│
└── CLAUDE.md                    # Project context (root level)
```

---

## 🎯 QUICK REFERENCE

### Key Files to Know

| File | Purpose | Audience |
|------|---------|----------|
| [CLAUDE.md](../CLAUDE.md) | Project context, stack, conventions | Everyone |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | High-level design (Frontend + Backend) | Architects, Tech Leads |
| [OBJECTIVES.md](./OBJECTIVES.md) | Business goals, roadmap, personas | Product, Executives |
| [DESIGN_SYSTEM_MASTER.md](./DESIGN_SYSTEM_MASTER.md) | Design tokens, colors, components | Designers, Frontend devs |
| [BACKEND_IMPLEMENTATION.md](./BACKEND_IMPLEMENTATION.md) | Backend setup guide | Backend devs |
| [DOCUMENTACAO_FUNCIONAL.md](./DOCUMENTACAO_FUNCIONAL.md) | App features & behavior | Everyone |

### Status of Major Features

| Feature | Status | Docs |
|---------|--------|------|
| Formula Editor | ✅ MVP | [DOCUMENTACAO_FUNCIONAL.md](./DOCUMENTACAO_FUNCIONAL.md) |
| AI Integration | ✅ MVP | [DOCUMENTACAO_FUNCIONAL.md](./DOCUMENTACAO_FUNCIONAL.md) |
| PDF Export | ✅ MVP | [DOCUMENTACAO_FUNCIONAL.md](./DOCUMENTACAO_FUNCIONAL.md) |
| Backend API | ⏳ Q2 2026 | [BACKEND_IMPLEMENTATION.md](./BACKEND_IMPLEMENTATION.md) |
| Multi-user | ⏳ Q2 2026 | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| Mobile App | ⏳ Q3 2026 | [OBJECTIVES.md](./OBJECTIVES.md) |

---

## 🔗 EXTERNAL LINKS

### Technology References
- [React 19 Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com)
- [.NET 9 Docs](https://learn.microsoft.com/en-us/dotnet/)
- [Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/)

### Design References
- [Lucide Icons](https://lucide.dev)
- [Google Fonts (Manrope, Inter)](https://fonts.google.com)

### Tools
- [GitHub](https://github.com)
- [VS Code](https://code.visualstudio.com)
- [Visual Studio 2022](https://visualstudio.microsoft.com)

---

## 📝 DOCUMENTATION MAINTENANCE

### How to Update Docs

1. **Architecture changes**: Update [ARCHITECTURE.md](./ARCHITECTURE.md)
2. **Feature additions**: Update [DOCUMENTACAO_FUNCIONAL.md](./DOCUMENTACAO_FUNCIONAL.md)
3. **Design changes**: Update [DESIGN_SYSTEM_MASTER.md](./DESIGN_SYSTEM_MASTER.md)
4. **Roadmap changes**: Update [OBJECTIVES.md](./OBJECTIVES.md)
5. **API changes**: Update [api-contract.md](./api-contract.md)

### Document Hierarchy

```
README.md (this file) ← START HERE
├── OBJECTIVES.md ← Why we exist
├── ARCHITECTURE.md ← How we're built
├── DESIGN_SYSTEM_MASTER.md ← How we look
├── BACKEND_IMPLEMENTATION.md ← How to build backend
└── DOCUMENTACAO_FUNCIONAL.md ← What we do
```

---

## ❓ FAQ

### "Which doc should I read first?"
**Answer**: See "START HERE" section above — choose by role.

### "Where's the API documentation?"
**Answer**: [api-contract.md](./api-contract.md). Full OpenAPI/Swagger available at `/swagger-ui` when backend is running.

### "How do I get started developing?"
**Answer**: [GUIA_RAPIDO.md](./GUIA_RAPIDO.md) for frontend, [BACKEND_IMPLEMENTATION.md](./BACKEND_IMPLEMENTATION.md) for backend.

### "Where's the design system?"
**Answer**: [DESIGN_SYSTEM_MASTER.md](./DESIGN_SYSTEM_MASTER.md) — single source of truth for all visual decisions.

### "What's the roadmap?"
**Answer**: [OBJECTIVES.md](./OBJECTIVES.md) for product roadmap, [ROADMAP_EXECUTIVO.md](./ROADMAP_EXECUTIVO.md) for executive timeline.

---

## 📊 Documentation Statistics

- **Total docs**: 19 files
- **Core docs**: 6 (ARCHITECTURE, OBJECTIVES, BACKEND_IMPL, DESIGN_SYSTEM, FUNCIONAL, api-contract)
- **Supporting docs**: 13 (guides, checklists, reviews)
- **Last updated**: 2026-03-26

---

## 🤝 Contributing

When adding new documentation:

1. ✅ Use markdown (.md)
2. ✅ Add TOC with links
3. ✅ Include "Last updated" date
4. ✅ Reference related docs
5. ✅ Add to README.md index

---

**Last updated**: 2026-03-26
**Maintained by**: Development Team
**Questions?**: Check [CLAUDE.md](../CLAUDE.md) or reach out to the team
