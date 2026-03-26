# 📚 KERUS DOCUMENTATION

**Versão**: 2.0.0 (Full-Stack Ready)
**Data**: 2026-03-26

> Documentação centralizada do Kerus. Escolha seu ponto de entrada abaixo.

---

## 🚀 START HERE (escolha um)

### Para **Product Managers / Stakeholders**
1. 📄 [internal/OBJECTIVES.md](./internal/OBJECTIVES.md) — Visão, nicho, features, roadmap
2. 📊 [internal/ROADMAP_EXECUTIVO.md](./internal/ROADMAP_EXECUTIVO.md) — Timeline 5 fases, KPIs, projeções
3. 🎯 [internal/PROJECT_REVIEW.md](./internal/PROJECT_REVIEW.md) — Análise completa, pontos fortes/fracos

### Para **Developers (Frontend)**
1. 🏗️ [internal/ARCHITECTURE.md](./internal/ARCHITECTURE.md) — Arquitetura unificada (Frontend + Backend)
2. 🎨 [design/DESIGN_SYSTEM_MASTER.md](./design/DESIGN_SYSTEM_MASTER.md) — Design tokens, componentes, padrões
3. 📖 [CLAUDE.md](../CLAUDE.md) — Project context (no root)
4. 🔧 [guides/FRONTEND_MIGRATION.md](./guides/FRONTEND_MIGRATION.md) — Como migrar para API (quando backend estiver pronto)

### Para **Developers (Backend)**
1. 🏗️ [internal/ARCHITECTURE.md](./internal/ARCHITECTURE.md) — Arquitetura (.NET 9, estrutura, dados)
2. 🔧 [guides/BACKEND_IMPLEMENTATION.md](./guides/BACKEND_IMPLEMENTATION.md) — Step-by-step: projeto, DB, endpoints
3. 📋 [reference/API_CONTRACT.md](./reference/API_CONTRACT.md) — Endpoints, request/response, status codes

### Para **Designers**
1. 🎨 [design/DESIGN_SYSTEM_MASTER.md](./design/DESIGN_SYSTEM_MASTER.md) — Paleta, tipografia, componentes, grid
2. 📄 [internal/DOCUMENTACAO_FUNCIONAL.md](./internal/DOCUMENTACAO_FUNCIONAL.md) — Features, estados, fluxos

---

## 📖 MAIN DOCUMENTATION

### Core Architecture & Strategy (internal/)
- **[internal/ARCHITECTURE.md](./internal/ARCHITECTURE.md)** — Arquitetura completa (Frontend React + Backend .NET 9)
- **[internal/OBJECTIVES.md](./internal/OBJECTIVES.md)** — Visão de negócio, nicho, features, personas
- **[internal/DOCUMENTACAO_FUNCIONAL.md](./internal/DOCUMENTACAO_FUNCIONAL.md)** — Features do app, fluxos, comportamentos

### Implementation Guides (guides/)
- **[guides/BACKEND_IMPLEMENTATION.md](./guides/BACKEND_IMPLEMENTATION.md)** — Setup C# .NET 9, guia step-by-step
- **[guides/FRONTEND_MIGRATION.md](./guides/FRONTEND_MIGRATION.md)** *(em breve)* — Migrar frontend para API
- **[guides/GUIA_RAPIDO.md](./guides/GUIA_RAPIDO.md)** — Setup dev, troubleshooting, testes

### Design System (design/)
- **[design/DESIGN_SYSTEM_MASTER.md](./design/DESIGN_SYSTEM_MASTER.md)** — Fonte única de verdade (tokens, componentes, padrões)

### Planning & Project Management (internal/)
- **[internal/ROADMAP_EXECUTIVO.md](./internal/ROADMAP_EXECUTIVO.md)** — 5 fases, timeline, entregáveis, KPIs
- **[internal/PROJECT_REVIEW.md](./internal/PROJECT_REVIEW.md)** — Análise: pontos fortes, fracos, recomendações

### Reference (reference/)
- **[reference/API_CONTRACT.md](./reference/API_CONTRACT.md)** — Endpoints, DTOs, status codes
- **[reference/CHANGELOG.md](./reference/CHANGELOG.md)** — Changes log, antes/depois

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
│   ├── README.md               # Main hub
│   ├── internal/                # Development info (architecture, strategy)
│   │   ├── ARCHITECTURE.md
│   │   ├── OBJECTIVES.md
│   │   ├── ROADMAP_EXECUTIVO.md
│   │   └── ...
│   ├── guides/                  # Implementation guides
│   │   ├── BACKEND_IMPLEMENTATION.md
│   │   ├── GUIA_RAPIDO.md
│   │   └── ...
│   ├── design/                  # Design system
│   │   └── DESIGN_SYSTEM_MASTER.md
│   ├── reference/               # API specs & references
│   │   ├── API_CONTRACT.md
│   │   └── CHANGELOG.md
│   └── archive/                 # Historical documents
│
└── CLAUDE.md                    # Project context (root level)
```

---

## 🎯 QUICK REFERENCE

### Key Files to Know

| File | Purpose | Audience |
|------|---------|----------|
| [CLAUDE.md](../CLAUDE.md) | Project context, stack, conventions | Everyone |
| [internal/ARCHITECTURE.md](./internal/ARCHITECTURE.md) | High-level design (Frontend + Backend) | Architects, Tech Leads |
| [internal/OBJECTIVES.md](./internal/OBJECTIVES.md) | Business goals, roadmap, personas | Product, Executives |
| [design/DESIGN_SYSTEM_MASTER.md](./design/DESIGN_SYSTEM_MASTER.md) | Design tokens, colors, components | Designers, Frontend devs |
| [guides/BACKEND_IMPLEMENTATION.md](./guides/BACKEND_IMPLEMENTATION.md) | Backend setup guide | Backend devs |
| [internal/DOCUMENTACAO_FUNCIONAL.md](./internal/DOCUMENTACAO_FUNCIONAL.md) | App features & behavior | Everyone |

### Status of Major Features

| Feature | Status | Docs |
|---------|--------|------|
| Formula Editor | ✅ MVP | [internal/DOCUMENTACAO_FUNCIONAL.md](./internal/DOCUMENTACAO_FUNCIONAL.md) |
| AI Integration | ✅ MVP | [internal/DOCUMENTACAO_FUNCIONAL.md](./internal/DOCUMENTACAO_FUNCIONAL.md) |
| PDF Export | ✅ MVP | [internal/DOCUMENTACAO_FUNCIONAL.md](./internal/DOCUMENTACAO_FUNCIONAL.md) |
| Backend API | ⏳ Q2 2026 | [guides/BACKEND_IMPLEMENTATION.md](./guides/BACKEND_IMPLEMENTATION.md) |
| Multi-user | ⏳ Q2 2026 | [internal/ARCHITECTURE.md](./internal/ARCHITECTURE.md) |
| Mobile App | ⏳ Q3 2026 | [internal/OBJECTIVES.md](./internal/OBJECTIVES.md) |

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

1. **Architecture changes**: Update [internal/ARCHITECTURE.md](./internal/ARCHITECTURE.md)
2. **Feature additions**: Update [internal/DOCUMENTACAO_FUNCIONAL.md](./internal/DOCUMENTACAO_FUNCIONAL.md)
3. **Design changes**: Update [design/DESIGN_SYSTEM_MASTER.md](./design/DESIGN_SYSTEM_MASTER.md)
4. **Roadmap changes**: Update [internal/OBJECTIVES.md](./internal/OBJECTIVES.md)
5. **API changes**: Update [reference/API_CONTRACT.md](./reference/API_CONTRACT.md)

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
**Answer**: [reference/API_CONTRACT.md](./reference/API_CONTRACT.md). Full OpenAPI/Swagger available at `/swagger-ui` when backend is running.

### "How do I get started developing?"
**Answer**: [guides/GUIA_RAPIDO.md](./guides/GUIA_RAPIDO.md) for frontend, [guides/BACKEND_IMPLEMENTATION.md](./guides/BACKEND_IMPLEMENTATION.md) for backend.

### "Where's the design system?"
**Answer**: [design/DESIGN_SYSTEM_MASTER.md](./design/DESIGN_SYSTEM_MASTER.md) — single source of truth for all visual decisions.

### "What's the roadmap?"
**Answer**: [internal/OBJECTIVES.md](./internal/OBJECTIVES.md) for product roadmap, [internal/ROADMAP_EXECUTIVO.md](./internal/ROADMAP_EXECUTIVO.md) for executive timeline.

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
