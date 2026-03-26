# 🏗️ ARCHITECTURE — Kerus Full-Stack

**Versão**: 2.0.0 (Full-Stack Strategy)
**Status**: Full-Stack Design Document
**Última atualização**: 2026-03-26

> Documentação unificada de arquitetura, cobrindo Frontend (React SPA) e Backend (C# .NET 9) strategy.

---

## 📌 Quick Navigation

1. [Project Overview](#project-overview)
2. [Current Frontend Architecture](#current-frontend-architecture)
3. [Backend Strategy (C# .NET 9)](#backend-strategy--net-9)
4. [Full-Stack Integration](#full-stack-integration)
5. [Development Phases](#development-phases)

---

## Project Overview

**Kerus** é um **ecossistema digital para gestão de fichas técnicas industriais** com foco em controle técnico, previsibilidade documental e integração com IA.

### Público-alvo

Engenheiros de alimentos, formuladores cosméticos, laboratórios P&D — que exigem padronização absoluta.

### O que NÃO é

- Gerador criativo de receitas
- Editor gráfico WYSIWYG
- Plataforma multiusuário (hoje; será no futuro)

---

## Current Frontend Architecture

### Stack

| Layer | Tech | Status |
|-------|------|--------|
| **UI** | React 19 + TypeScript | ✅ Production |
| **Routing** | React Router v6 | ✅ Production |
| **Styling** | Tailwind + CSS Custom Props | ✅ Production |
| **DnD** | @dnd-kit | ✅ Production |
| **AI** | Gemini API | ✅ Production |
| **Build** | Vite 6 | ✅ Production |
| **Persistence** | localStorage | ⏳ Replace with Backend |

### Project Structure

```
src/
├── components/
│   ├── common/          # UI primitives
│   ├── features/        # Feature components
│   ├── layout/          # App shell
│   ├── modals/          # Dialogs
│   ├── ui/              # Shared components
│   └── RecipePrintable.tsx
├── context/             # React Context
├── hooks/               # Custom hooks
├── i18n/                # Translations
├── pages/               # Route pages
├── services/            # External APIs
├── types/               # TypeScript types
└── utils/               # Utilities
```

### Data Flow

```
User Input
  ↓
Component (local state)
  ↓
useRecipeManager
  ↓
AppContext
  ↓
useHistory hook (localStorage)
  ↓
localStorage
```

### Key Types

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
  // ... more fields
}
```

---

## Backend Strategy — .NET 9

### Goals

✅ Replace localStorage → persistent backend
✅ Add multi-user + auth
✅ Add audit logging
✅ Support mobile clients
✅ Keep API simple & REST

### Monorepo Structure

```
kerus/
├── frontend/              # React SPA
├── backend/               # C# .NET 9
│   ├── Kerus.sln
│   ├── Kerus.Domain/      # Entities & business logic
│   ├── Kerus.Application/ # Use cases
│   ├── Kerus.Infrastructure/ # DB, Auth, APIs
│   ├── Kerus.Api/         # Minimal APIs
│   └── Kerus.Tests/       # Unit & integration
└── docs/                  # This folder
```

### Tech Stack

| Component | Tech | Rationale |
|-----------|------|-----------|
| Language | C# 13 | Type-safe, modern |
| Framework | .NET 9 | Minimal APIs, performance |
| Database | SQL Server / PostgreSQL | Relational, ACID |
| ORM | EF Core 9 | Migrations, type-safe |
| Validation | FluentValidation | Fluent DSL |
| Logging | Serilog | Structured logging |
| Testing | xUnit + Moq | Industry standard |
| API Docs | OpenAPI / Scalar | Auto-generated |
| Auth | JWT | Stateless |

### Layered Architecture

#### Domain Layer (`Kerus.Domain/`)

Business logic, entities, value objects, repository interfaces.

```csharp
public class Recipe : AggregateRoot
{
    public string NomeFormula { get; private set; }
    public string? TituloFicha { get; private set; }
    public List<Ingredient> Ingredientes { get; private set; }

    public static Recipe Create(string nomeFormula)
    {
        return new Recipe
        {
            Id = Guid.NewGuid(),
            NomeFormula = nomeFormula,
            Status = RecipeStatus.Draft,
            CreatedAt = DateTime.UtcNow
        };
    }
}
```

#### Application Layer (`Kerus.Application/`)

Use cases, commands, queries, DTOs, validation, mapping.

```csharp
public class CreateRecipeCommand : IRequest<RecipeDto>
{
    public string NomeFormula { get; set; }
    public string? TituloFicha { get; set; }
}

public class CreateRecipeHandler : IRequestHandler<CreateRecipeCommand, RecipeDto>
{
    private readonly IRecipeRepository _repository;

    public async Task<RecipeDto> Handle(CreateRecipeCommand request, CancellationToken ct)
    {
        var recipe = Recipe.Create(request.NomeFormula);
        await _repository.AddAsync(recipe, ct);
        return _mapper.Map<RecipeDto>(recipe);
    }
}
```

#### Infrastructure Layer (`Kerus.Infrastructure/`)

Database, external APIs, authentication, file storage.

```csharp
public class RecipeRepository : IRecipeRepository
{
    private readonly KerusDbContext _context;

    public async Task<Recipe?> GetByIdAsync(Guid id, CancellationToken ct)
        => await _context.Recipes
            .Include(r => r.Ingredientes)
            .FirstOrDefaultAsync(r => r.Id == id, ct);
}
```

#### API Layer (`Kerus.Api/`)

HTTP endpoints, middleware, host configuration.

```csharp
public static class RecipeEndpoints
{
    public static void MapEndpoints(WebApplication app)
    {
        var group = app.MapGroup("/api/recipes")
            .RequireAuthorization();

        group.MapGet("/", GetRecipes);
        group.MapPost("/", CreateRecipe);
        group.MapPut("/{id}", UpdateRecipe);
        group.MapDelete("/{id}", DeleteRecipe);
    }
}
```

### API Design

#### Endpoints

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| `GET` | `/api/recipes` | ✅ | List recipes |
| `GET` | `/api/recipes/{id}` | ✅ | Get recipe |
| `POST` | `/api/recipes` | ✅ | Create recipe |
| `PUT` | `/api/recipes/{id}` | ✅ | Update recipe |
| `DELETE` | `/api/recipes/{id}` | ✅ | Delete recipe |
| `POST` | `/api/recipes/{id}/export` | ✅ | Export PDF |
| `POST` | `/api/auth/login` | ❌ | Login |
| `POST` | `/api/auth/register` | ❌ | Register |

#### Request/Response Format

```json
// POST /api/recipes
{
  "nomeFormula": "Hidratante Facial",
  "tituloFicha": "Fórmula Técnica",
  "ingredientes": [
    { "nome": "Água", "quantidade": 50, "unidade": "ml" }
  ]
}

// 201 Created
{
  "id": "uuid",
  "nomeFormula": "Hidratante Facial",
  "createdAt": "2026-03-26T10:00:00Z",
  "status": "RASCUNHO"
}
```

### Validation Strategy

```csharp
public class CreateRecipeValidator : AbstractValidator<CreateRecipeCommand>
{
    public CreateRecipeValidator()
    {
        RuleFor(x => x.NomeFormula)
            .NotEmpty().WithMessage("Nome obrigatório")
            .MaximumLength(255).WithMessage("Máximo 255 caracteres");

        RuleFor(x => x.Ingredientes)
            .NotEmpty().WithMessage("Pelo menos um ingrediente");
    }
}
```

### Authentication & Authorization

JWT-based, stateless authentication.

```csharp
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = "https://your-auth-provider";
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true
        };
    });

app.UseAuthentication();
app.UseAuthorization();
```

### Database (EF Core)

```csharp
public class KerusDbContext : DbContext
{
    public DbSet<Recipe> Recipes { get; set; }
    public DbSet<Quotation> Quotations { get; set; }
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.ApplyConfigurationsFromAssembly(typeof(KerusDbContext).Assembly);
    }
}

// Migrations
// dotnet ef migrations add InitialCreate
// dotnet ef database update
```

---

## Full-Stack Integration

### Current State (Phase 0)

- ✅ Frontend-only SPA
- ✅ localStorage persistence
- ❌ No backend

### Phase 1: Backend Setup (Weeks 1-2)

**Deliverables**:
- ✅ Project structure created
- ✅ Database schema + EF migrations
- ✅ Domain entities implemented
- ✅ Unit tests passing

**Checklist**:
- [ ] Create `.sln` and projects
- [ ] Setup EF Core + SQL Server
- [ ] Implement domain entities (Recipe, Quotation, User)
- [ ] Write unit tests (Recipe creation, validation)
- [ ] Setup CI/CD pipeline

### Phase 2: Core API (Weeks 3-6)

**Deliverables**:
- ✅ Recipe CRUD endpoints working
- ✅ Quotation CRUD endpoints working
- ✅ JWT authentication + authorization
- ✅ Validation + error handling
- ✅ API documentation (Swagger/Scalar)
- ✅ Integration tests passing

**Checklist**:
- [ ] Implement all Recipe endpoints
- [ ] Implement all Quotation endpoints
- [ ] Setup JWT (Auth0 or custom)
- [ ] Add FluentValidation
- [ ] Add Serilog logging
- [ ] Write integration tests
- [ ] Publish Swagger/OpenAPI

### Phase 3: Frontend Migration (Weeks 7-8)

**Deliverables**:
- ✅ Frontend switched to API calls
- ✅ No localStorage usage
- ✅ Error handling + retry logic
- ✅ E2E tests passing

**Changes**:
1. Create REST client hooks:
   ```typescript
   // src/hooks/useRecipeAPI.ts
   export function useRecipeAPI() {
     const getRecipes = async () => {
       const res = await fetch('/api/recipes');
       return res.json();
     };
     // ... more methods
   }
   ```

2. Replace `useHistory`:
   ```typescript
   // Before:
   const { history } = useHistory(); // localStorage

   // After:
   const { recipes } = await useRecipeAPI().getRecipes();
   ```

3. Update error handling:
   ```typescript
   try {
     await recipeAPI.create(recipe);
   } catch (error) {
     if (error.status === 401) redirectToLogin();
     else showErrorToast(error.message);
   }
   ```

### Phase 4: Advanced Features (Weeks 9-12)

- ✅ Multi-user + RBAC
- ✅ Audit logging
- ✅ File uploads
- ✅ Redis caching
- ✅ Rate limiting

### Phase 5: Production Hardening (Weeks 13-16)

- ✅ Load testing
- ✅ Security audit
- ✅ Docker deployment
- ✅ Monitoring + alerting
- ✅ Documentation

---

## Deployment

### Docker (Backend)

```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["Kerus.sln", "."]
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 80
ENTRYPOINT ["dotnet", "Kerus.Api.dll"]
```

### Docker Compose (Development)

```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    environment:
      VITE_API_URL: http://backend:5000

  backend:
    build: ./backend
    ports:
      - "5000:80"
    environment:
      ConnectionStrings__Default: "Server=db;Database=Kerus;User=sa;Password=..."
    depends_on:
      - db

  db:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      SA_PASSWORD: "YourSecurePassword123!"
      ACCEPT_EULA: "Y"
    ports:
      - "1433:1433"
```

---

## Related Documentation

- 📄 [Backend Implementation Checklist](./BACKEND_IMPLEMENTATION.md) *(to be created)*
- 📄 [Frontend Migration Guide](./FRONTEND_MIGRATION.md) *(to be created)*
- 📄 [Design System Master](./DESIGN_SYSTEM_MASTER.md)
- 📄 [Functional Documentation](./DOCUMENTACAO_FUNCIONAL.md)
- 📄 [Objectives & Roadmap](./OBJECTIVES.md) *(to be created)*

---

**Last updated**: 2026-03-26
**Next review**: After Phase 1 completion
