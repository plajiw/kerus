# 🎯 PROJECT OBJECTIVES & ROADMAP

**Versão**: 1.0.0
**Status**: Active Product Development
**Data**: 2026-03-26

---

## 📌 Executive Summary

**Kerus** é um ecossistema digital para **gestão de fichas técnicas industriais** com IA integrada, focado em **controle técnico absoluto e previsibilidade documental**.

Nosso nicho: engenheiros de alimentos, formuladores cosméticos, P&D industrial — profissionais que exigem **rigor, consistência e automatização assistida** (não criativa).

---

## 🎪 WHO WE SERVE

### Primary Personas

#### 1. **Engenheiro de Alimentos**
- **Pain**: 100+ receitas em planilhas, sem versionamento, sem padrão
- **Goal**: Centralizar fichas com estrutura consistente, exportar PDF profissional
- **Kerus Fit**: Editor estruturado, export A4, validações silenciosas

#### 2. **Formulador Cosmético**
- **Pain**: Iterações no papel + fotos, perda de informação, falta de rastreabilidade
- **Goal**: Documentar evolução, ter versão "final" imutável para conformidade
- **Kerus Fit**: Status RASCUNHO/FINAL, preview A4, INCI fields

#### 3. **Gerente de P&D**
- **Pain**: Equipe descentralizada, sem controle de versões, sem auditoria
- **Goal**: Centralizar, rastrear quem alterou o quê, exportar para compliance
- **Kerus Fit**: (Future) Multi-user, audit log, RBAC

#### 4. **Cozinha Profissional**
- **Pain**: Receitas em whatsapp/fotos, sem padronização, sem yield info
- **Goal**: Ter receita profissional, escalável, documentada
- **Kerus Fit**: Ingredientes + modos, yield fields, export para estampar

---

## 🎯 MISSION & VISION

### Mission

> Transformar a gestão de fichas técnicas de um processo artesanal (papel, emails, planilhas) para um **ecossistema digital estruturado e confiável**.

### Vision (5 anos)

> **Kerus** é o padrão industrial para documentação de formulações: usado por engenheiros, fabricantes, laboratórios e escolas culinárias em todo o Brasil para garantir qualidade, conformidade e rastreabilidade.

---

## 🚀 PRODUCT PILLARS

### Pilar 1: **Rigor Técnico** ✅
- Editor estruturado, não WYSIWYG
- Campos tipados, validações silenciosas
- Suporte para INCI, fases, ph, viscosidade
- Sem interpretação criativa da IA

### Pilar 2: **Previsibilidade Documental** ✅
- A4/PDF é a verdade absoluta
- Layout fixo, tipografia profissional
- Status RASCUNHO/FINAL para controle
- Export determinístico

### Pilar 3: **Automatização Assistida** ✅
- IA extrai dados de foto/texto
- Usuário revisa e aprova
- Sem mudança automática de conteúdo
- IA não é autora, é assistente

### Pilar 4: **Escalabilidade** ⏳
- Backend .NET 9 (hoje em progress)
- Multi-user + auth + RBAC
- Audit logging para compliance
- Suporte para mobile (web + app)

### Pilar 5: **Integração Ecossistêmica** ⏳
- API pública para parceiros
- Webhooks para automação
- Sync com ERPs (Tiny, RD Station, Nuvemshop)
- Analytics dashboard

---

## 📦 FEATURE SET

### ✅ MVP (Current State)

#### Formula Module
- [x] Create/edit/delete formula
- [x] Customizable title & subtitle
- [x] Ingredients list with INCI (advanced mode)
- [x] Preparation steps
- [x] Batch size, pH, viscosity (advanced mode)
- [x] Status: RASCUNHO / FINAL
- [x] A4 preview (live, responsive)
- [x] PDF export (PDF format, correct filename)
- [x] Light/dark theme
- [x] i18n (pt-BR, en, es)

#### AI Integration
- [x] Text input → extract structured formula
- [x] Image input (handwritten notes, cookbook pages)
- [x] AI respects user's input format (doesn't rewrite)

#### Quotation Module (Bonus)
- [x] Create/edit/delete quotation
- [x] Line items with pricing
- [x] Status tracking
- [x] Export as PDF

#### UI/UX
- [x] Drag & drop (ingredients, steps, quotation items)
- [x] Keyboard shortcuts (Enter to add, Ctrl+S to save)
- [x] Responsive design (desktop + mobile)
- [x] Design system tokens (colors, typography, spacing)

### ⏳ Phase 2 (Q2 2026)

#### Backend Integration
- [ ] Replace localStorage with C# REST API
- [ ] User authentication (JWT)
- [ ] Persistent database (SQL Server)
- [ ] API documentation (Swagger)

#### Multi-user
- [ ] User roles (Editor, Viewer, Admin)
- [ ] Formula sharing (team collaboration)
- [ ] Audit log (who changed what, when)
- [ ] Comments on formulas (discussion thread)

#### Advanced Features
- [ ] Formula versioning (track changes)
- [ ] Batch operations (export 10 PDFs at once)
- [ ] Search & filter (by name, date, status)
- [ ] Tags & collections (organize formulas)

### ⏳ Phase 3 (Q3-Q4 2026)

#### Integrations
- [ ] ERP sync (pull/push to Tiny, etc.)
- [ ] Webhook support (trigger on status change)
- [ ] Zapier integration (if-this-then-that)
- [ ] Gemini API advanced modes (image generation for product mockups)

#### Compliance & Analytics
- [ ] LGPD compliance dashboard
- [ ] Audit report generator
- [ ] Usage analytics (formulas created/month, etc.)
- [ ] Export for regulatory submission

#### Mobile
- [ ] React Native app (iOS/Android)
- [ ] Offline mode (sync when online)
- [ ] Camera capture (take photo of ingredients)
- [ ] QR code generation (for product label linking)

### ⏳ Phase 4 (2027+)

#### Community & Marketplace
- [ ] Public formula gallery (templates)
- [ ] Preset templates (starter formulas by category)
- [ ] Marketplace (buy/sell recipes)
- [ ] Certification program (Kerus-verified formulators)

#### Enterprise Features
- [ ] On-premise deployment
- [ ] SSO (SAML, Active Directory)
- [ ] Custom branding (white-label)
- [ ] Advanced analytics & reporting
- [ ] SLA support + training

---

## 🎬 DEVELOPMENT ROADMAP (16 Weeks)

### Week 1-2: Backend Foundation
- [ ] Setup C# project structure (Kerus.sln)
- [ ] Database schema (EF Core migrations)
- [ ] Domain entities (Recipe, Quotation, User)
- [ ] Unit tests passing
- **Owner**: Backend Lead | **Status**: Planning

### Week 3-6: Core API
- [ ] Recipe CRUD endpoints
- [ ] Quotation CRUD endpoints
- [ ] JWT authentication
- [ ] FluentValidation
- [ ] Integration tests
- [ ] Swagger documentation
- **Owner**: Backend Team | **Status**: Planning

### Week 7-8: Frontend Migration
- [ ] REST client hooks (useRecipeAPI, useQuotationAPI)
- [ ] Replace localStorage with API calls
- [ ] Error handling + retry logic
- [ ] E2E tests
- **Owner**: Frontend Team | **Status**: Planning

### Week 9-12: Advanced Features
- [ ] Multi-user + RBAC
- [ ] Audit logging
- [ ] File upload (PDFs, images)
- [ ] Redis caching
- [ ] Rate limiting
- **Owner**: Full Stack Team | **Status**: Planning

### Week 13-16: Production
- [ ] Load testing
- [ ] Security audit
- [ ] Docker deployment
- [ ] Monitoring + alerting
- [ ] Documentation
- [ ] Training materials
- **Owner**: DevOps + Docs Team | **Status**: Planning

---

## 💰 BUSINESS MODEL

### Current (MVP)
- **Free**: Web app with localStorage (no backend cost)
- **Freemium**: (Future) Free tier limited to 5 formulas

### Planned (Post-Backend)

#### Freemium Plan
- **Price**: Free
- **Features**:
  - Up to 5 formulas
  - PDF export
  - AI extraction (limited)
  - Single user
- **Limit**: 1 export per day

#### Pro Plan
- **Price**: R$ 29/month
- **Features**:
  - Unlimited formulas
  - Unlimited exports
  - Advanced AI (batch processing)
  - Team sharing (up to 5 users)
  - Formula versioning
  - Audit log

#### Enterprise Plan
- **Price**: Custom
- **Features**:
  - Everything in Pro
  - Unlimited users
  - SSO + API access
  - Webhook support
  - On-premise option
  - Dedicated support
  - Custom integrations

### Revenue Projections (Year 1)

| Metric | Target | Confidence |
|--------|--------|------------|
| Signups | 500 | Medium |
| Pro conversions | 50 | Low |
| Enterprise pilots | 2 | Low |
| MRR | R$ 1,500 | Low |

**Note**: This is a hobby project becoming real software. Revenue is secondary to solving the problem well.

---

## 🎓 SUCCESS METRICS (KPIs)

### Product Metrics
- **Activation**: % of signups who create 1 formula
- **Retention**: % of active users (1+ edit per week)
- **Engagement**: Avg formulas per user per month
- **Export rate**: % of formulas exported to PDF

### Business Metrics
- **Signups**: New users per month
- **Churn**: % of users who stop using
- **LTV**: Lifetime value per paying user
- **CAC**: Customer acquisition cost

### Quality Metrics
- **Bug density**: Bugs per 1000 LOC
- **Test coverage**: % of code with tests
- **API uptime**: 99.9%
- **Response time**: <500ms for API calls

### User Satisfaction
- **NPS**: Net Promoter Score (target: >40)
- **CSAT**: Customer satisfaction (target: >4/5)
- **Support tickets**: <2 per 100 users

---

## 🚫 OUT OF SCOPE (Intentional)

### What Kerus WILL NOT Do

❌ **Creative recipe generation** — no "AI writes your formula"
❌ **Graphic design** — no WYSIWYG editor for labels
❌ **E-commerce** — no shop integration (yet)
❌ **Nutritional data** — focus is cosmetics/industrial
❌ **Real-time collaboration** — single editor per formula
❌ **Offline-first** — assumes internet (mobile offline is Phase 3)
❌ **Marketplace** — community recipes come later

### Why?

These features dilute focus. MVP is **"one thing, done well"**: turning formula chaos into structured digital documents.

---

## 🏆 COMPETITIVE LANDSCAPE

### Who we're NOT like

| Tool | Use Case | Why Kerus is Different |
|------|----------|----------------------|
| Notion | General note-taking | We're formula-specific, A4-focused |
| Airtable | Database + forms | They're generic; we have domain expertise |
| Canva | Graphic design | We're not about pretty; we're about structure |
| Recipe apps (Yummly, etc.) | Cooking | They're for consumers; we're for professionals |
| OpenFood Facts | Nutrition DB | They track ingredients globally; we document formulas locally |

### Who we ARE like

| Tool | Similarity | Difference |
|------|-----------|-----------|
| Asana | Task/project tracking | They track tasks; we track formula versions |
| Jira | Issue tracking | They're for development; we're for formulators |
| Docsend | Document sharing | They're general docs; we're formula-specific |

**Kerus's niche**: No one else focuses on **structured, technically-rigorous industrial formula documentation**.

---

## 🤝 PARTNERSHIPS & OPPORTUNITIES

### Potential Partners (Future)

#### Educational
- **SENAI**: Teach Kerus to food/cosmetics students
- **Universidades**: Research partnerships
- **Cursos online**: Udemy/Alura courses on formulation using Kerus

#### Industry
- **Tiny ERP**: Sync formulas with inventory
- **Nuvemshop**: Link formulas to product listings
- **RD Station**: CRM integration for B2B sales
- **Taxonid**: Compliance/regulatory tracking

#### Ecosystem
- **Auth0**: Managed authentication
- **Stripe**: Payments (Pro/Enterprise)
- **Sentry**: Error tracking
- **Datadog**: Monitoring

---

## 📊 MARKET ANALYSIS

### Total Addressable Market (TAM)

**Small/medium food & cosmetics businesses in Brazil**:
- ~50,000 micro-enterprises (artisanal cosmetics)
- ~10,000 small food companies
- ~1,000 P&D labs in cosmetics/pharma
- **TAM**: ~61,000 potential users

### Serviceable Addressable Market (SAM)

**Those with digital tools already** (assume 30% adoption of SaaS tools):
- **SAM**: ~18,300 users

### Serviceable Obtainable Market (SOM) — Year 1

**If we reach 1% of SAM**:
- **SOM**: ~180 users (conservative)

**Revenue at 10% Pro conversion** (R$ 29/month):
- MRR: R$ 180 × 0.10 × 29 = R$ 522
- ARR: ~R$ 6,264

---

## 🎯 STRATEGIC GOALS (2026)

### Q1 (Jan-Mar) — DONE ✅
- [x] MVP frontend completed
- [x] AI integration (Gemini)
- [x] PDF export working
- [x] i18n support

### Q2 (Apr-Jun) — IN PROGRESS
- [ ] Backend API live (C# .NET 9)
- [ ] Frontend migrated to API
- [ ] Authentication + users
- [ ] 100+ users beta

### Q3 (Jul-Sep) — PLANNED
- [ ] Multi-user collaboration
- [ ] Audit logging
- [ ] ERP integrations
- [ ] 500+ users

### Q4 (Oct-Dec) — PLANNED
- [ ] Mobile app (React Native)
- [ ] Pro plan launch
- [ ] 1,000+ users
- [ ] First enterprise pilot

---

## 💡 GUIDING PRINCIPLES

### 1. **User Autonomy First**
- Never auto-change user's content
- Always ask before modifying
- Silent validations, no blocking

### 2. **Quality Over Quantity**
- One feature, done right, beats 10 half-baked features
- We say "no" to scope creep
- Ruthless prioritization

### 3. **Technical Rigor**
- Type-safe code (TypeScript + C#)
- Comprehensive tests
- No shortcuts for "quick wins"

### 4. **Simplicity**
- 80/20 rule: 80% of users need 20% of features
- Beginner-friendly interface
- Advanced mode for power users

### 5. **Accessibility**
- WCAG 2.1 AA compliance
- Dark + light mode
- i18n from day 1

---

## 📖 RELATED DOCUMENTATION

- 🏗️ [Architecture](./ARCHITECTURE.md)
- 🎨 [Design System](./DESIGN_SYSTEM_MASTER.md)
- 📋 [Functional Documentation](./DOCUMENTACAO_FUNCIONAL.md)
- 🔧 [Backend Implementation](./BACKEND_IMPLEMENTATION.md) *(to be created)*
- 📱 [Frontend Migration](./FRONTEND_MIGRATION.md) *(to be created)*

---

**Last updated**: 2026-03-26
**Next review**: After Phase 2 completion
