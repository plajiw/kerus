# 🔧 BACKEND IMPLEMENTATION GUIDE

**Versão**: 1.0.0
**Status**: Setup & Getting Started
**Data**: 2026-03-26

> Este documento é um passo-a-passo prático para implementar o backend C# .NET 9 do Kerus. Para arquitetura de alto nível, veja [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## 📌 Quick Links

- [Prerequisites](#prerequisites)
- [Phase 1: Project Setup](#phase-1-project-setup)
- [Phase 2: Domain Layer](#phase-2-domain-layer)
- [Phase 3: API Endpoints](#phase-3-api-endpoints)
- [Phase 4: Testing](#phase-4-testing)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### System Requirements

```bash
# Windows 10+ / macOS / Linux
# .NET SDK 9.0 or later
dotnet --version

# SQL Server 2022+ (or Docker)
# Git
git --version

# Optional: Visual Studio 2022 / VS Code
```

### Installation

```bash
# Install .NET 9 SDK
# https://dotnet.microsoft.com/en-us/download/dotnet/9.0

# Verify installation
dotnet --version
# Expected: 9.0.x

# Install Entity Framework CLI (global)
dotnet tool install --global dotnet-ef
dotnet ef --version
```

---

## Phase 1: Project Setup

### Step 1.1: Create Solution & Projects

```bash
# Create backend folder at root
cd kerus
mkdir backend
cd backend

# Create solution
dotnet new sln -n Kerus

# Create projects
dotnet new classlib -n Kerus.Domain
dotnet new classlib -n Kerus.Application
dotnet new classlib -n Kerus.Infrastructure
dotnet new webapi -n Kerus.Api --use-minimal-apis
dotnet new xunit -n Kerus.Tests

# Add projects to solution
dotnet sln Kerus.sln add Kerus.Domain/Kerus.Domain.csproj
dotnet sln Kerus.sln add Kerus.Application/Kerus.Application.csproj
dotnet sln Kerus.sln add Kerus.Infrastructure/Kerus.Infrastructure.csproj
dotnet sln Kerus.sln add Kerus.Api/Kerus.Api.csproj
dotnet sln Kerus.sln add Kerus.Tests/Kerus.Tests.csproj

# Verify
dotnet sln Kerus.sln list
```

### Step 1.2: Setup Project References

```bash
# From backend/ directory

# Application depends on Domain
dotnet add Kerus.Application/Kerus.Application.csproj reference Kerus.Domain/Kerus.Domain.csproj

# Infrastructure depends on Domain & Application
dotnet add Kerus.Infrastructure/Kerus.Infrastructure.csproj reference Kerus.Domain/Kerus.Domain.csproj
dotnet add Kerus.Infrastructure/Kerus.Infrastructure.csproj reference Kerus.Application/Kerus.Application.csproj

# Api depends on all
dotnet add Kerus.Api/Kerus.Api.csproj reference Kerus.Domain/Kerus.Domain.csproj
dotnet add Kerus.Api/Kerus.Api.csproj reference Kerus.Application/Kerus.Application.csproj
dotnet add Kerus.Api/Kerus.Api.csproj reference Kerus.Infrastructure/Kerus.Infrastructure.csproj

# Tests depends on all
dotnet add Kerus.Tests/Kerus.Tests.csproj reference Kerus.Domain/Kerus.Domain.csproj
dotnet add Kerus.Tests/Kerus.Tests.csproj reference Kerus.Application/Kerus.Application.csproj
dotnet add Kerus.Tests/Kerus.Tests.csproj reference Kerus.Infrastructure/Kerus.Infrastructure.csproj
```

### Step 1.3: Add NuGet Dependencies

```bash
# From backend/ directory

# Domain layer
dotnet add Kerus.Domain/Kerus.Domain.csproj package FluentValidation

# Application layer
dotnet add Kerus.Application/Kerus.Application.csproj package MediatR
dotnet add Kerus.Application/Kerus.Application.csproj package MediatR.Extensions.Microsoft.DependencyInjection
dotnet add Kerus.Application/Kerus.Application.csproj package AutoMapper
dotnet add Kerus.Application/Kerus.Application.csproj package AutoMapper.Extensions.Microsoft.DependencyInjection
dotnet add Kerus.Application/Kerus.Application.csproj package FluentValidation.DependencyInjectionExtensions

# Infrastructure layer
dotnet add Kerus.Infrastructure/Kerus.Infrastructure.csproj package Microsoft.EntityFrameworkCore
dotnet add Kerus.Infrastructure/Kerus.Infrastructure.csproj package Microsoft.EntityFrameworkCore.SqlServer
dotnet add Kerus.Infrastructure/Kerus.Infrastructure.csproj package Serilog
dotnet add Kerus.Infrastructure/Kerus.Infrastructure.csproj package Serilog.AspNetCore
dotnet add Kerus.Infrastructure/Kerus.Infrastructure.csproj package Serilog.Sinks.Console
dotnet add Kerus.Infrastructure/Kerus.Infrastructure.csproj package System.IdentityModel.Tokens.Jwt

# API layer
dotnet add Kerus.Api/Kerus.Api.csproj package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add Kerus.Api/Kerus.Api.csproj package Swashbuckle.AspNetCore
dotnet add Kerus.Api/Kerus.Api.csproj package Microsoft.AspNetCore.OpenApi

# Tests
dotnet add Kerus.Tests/Kerus.Tests.csproj package Moq
dotnet add Kerus.Tests/Kerus.Tests.csproj package Microsoft.EntityFrameworkCore.InMemory
```

### Step 1.4: Verify Build

```bash
dotnet build
# Expected: Build succeeded with no errors
```

---

## Phase 2: Domain Layer

### Step 2.1: Create Entities

**File**: `Kerus.Domain/Entities/Recipe.cs`

```csharp
namespace Kerus.Domain.Entities;

public class Recipe
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string NomeFormula { get; set; } = string.Empty;
    public string? TituloFicha { get; set; }
    public string? SubtituloFicha { get; set; }
    public string? NomeEmpresa { get; set; }
    public DateTime Data { get; set; }
    public string Status { get; set; } = "RASCUNHO"; // RASCUNHO | FINAL
    public string? Observacoes { get; set; }
    public decimal? BatchSize { get; set; }
    public decimal? PhMin { get; set; }
    public decimal? PhMax { get; set; }
    public string? Viscosity { get; set; }
    public string? FormulaVersion { get; set; }

    // Collections
    public ICollection<Ingredient> Ingredientes { get; set; } = new List<Ingredient>();
    public ICollection<Step> ModoPreparo { get; set; } = new List<Step>();

    // Audit
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Factory method
    public static Recipe Create(
        Guid userId,
        string nomeFormula,
        string? tituloFicha = null,
        string? subtituloFicha = null)
    {
        return new Recipe
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            NomeFormula = nomeFormula,
            TituloFicha = tituloFicha ?? "Formulação Técnica",
            SubtituloFicha = subtituloFicha,
            Data = DateTime.Now,
            Status = "RASCUNHO",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }
}
```

**File**: `Kerus.Domain/Entities/Ingredient.cs`

```csharp
namespace Kerus.Domain.Entities;

public class Ingredient
{
    public Guid Id { get; set; }
    public Guid RecipeId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public decimal Quantidade { get; set; }
    public string Unidade { get; set; } = string.Empty;
    public decimal? Porcentagem { get; set; }
    public decimal? CustoUnitario { get; set; }
    public decimal? CustoTotal { get; set; }
    public string? Phase { get; set; } // A, B, C, D, E
    public string? INCI { get; set; }
    public string? Function { get; set; }

    // Navigation
    public Recipe? Recipe { get; set; }

    public static Ingredient Create(
        Guid recipeId,
        string nome,
        decimal quantidade,
        string unidade)
    {
        return new Ingredient
        {
            Id = Guid.NewGuid(),
            RecipeId = recipeId,
            Nome = nome,
            Quantidade = quantidade,
            Unidade = unidade
        };
    }
}
```

**File**: `Kerus.Domain/Entities/Step.cs`

```csharp
namespace Kerus.Domain.Entities;

public class Step
{
    public Guid Id { get; set; }
    public Guid RecipeId { get; set; }
    public int Order { get; set; }
    public string Text { get; set; } = string.Empty;

    // Navigation
    public Recipe? Recipe { get; set; }

    public static Step Create(Guid recipeId, int order, string text)
    {
        return new Step
        {
            Id = Guid.NewGuid(),
            RecipeId = recipeId,
            Order = order,
            Text = text
        };
    }
}
```

**File**: `Kerus.Domain/Entities/User.cs`

```csharp
namespace Kerus.Domain.Entities;

public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Role { get; set; } = "USER"; // ADMIN | USER
    public DateTime CreatedAt { get; set; }
    public bool IsActive { get; set; } = true;

    // Collections
    public ICollection<Recipe> Recipes { get; set; } = new List<Recipe>();

    public static User Create(string email, string passwordHash, string fullName)
    {
        return new User
        {
            Id = Guid.NewGuid(),
            Email = email,
            PasswordHash = passwordHash,
            FullName = fullName,
            CreatedAt = DateTime.UtcNow,
            Role = "USER"
        };
    }
}
```

### Step 2.2: Create Repository Interfaces

**File**: `Kerus.Domain/Repositories/IRecipeRepository.cs`

```csharp
namespace Kerus.Domain.Repositories;

using Kerus.Domain.Entities;

public interface IRecipeRepository
{
    Task<Recipe?> GetByIdAsync(Guid id);
    Task<IEnumerable<Recipe>> ListByUserAsync(Guid userId);
    Task<Recipe> CreateAsync(Recipe recipe);
    Task UpdateAsync(Recipe recipe);
    Task DeleteAsync(Guid id);
    Task<bool> ExistsAsync(Guid id);
}
```

### Step 2.3: Add Validators

**File**: `Kerus.Domain/Validators/CreateRecipeValidator.cs`

```csharp
namespace Kerus.Domain.Validators;

using FluentValidation;
using Kerus.Domain.Entities;

public class RecipeValidator : AbstractValidator<Recipe>
{
    public RecipeValidator()
    {
        RuleFor(x => x.NomeFormula)
            .NotEmpty().WithMessage("Nome da fórmula é obrigatório")
            .MaximumLength(255).WithMessage("Máximo 255 caracteres");

        RuleFor(x => x.Ingredientes)
            .NotEmpty().WithMessage("Pelo menos um ingrediente é necessário");

        RuleFor(x => x.Data)
            .NotEmpty().WithMessage("Data é obrigatória")
            .LessThanOrEqualTo(DateTime.Now).WithMessage("Data não pode ser futura");

        RuleFor(x => x.Status)
            .Must(s => s == "RASCUNHO" || s == "FINAL")
            .WithMessage("Status deve ser RASCUNHO ou FINAL");
    }
}
```

---

## Phase 3: Infrastructure & API

### Step 3.1: Create DbContext

**File**: `Kerus.Infrastructure/Persistence/KerusDbContext.cs`

```csharp
namespace Kerus.Infrastructure.Persistence;

using Microsoft.EntityFrameworkCore;
using Kerus.Domain.Entities;

public class KerusDbContext : DbContext
{
    public KerusDbContext(DbContextOptions<KerusDbContext> options)
        : base(options) { }

    public DbSet<Recipe> Recipes { get; set; }
    public DbSet<Ingredient> Ingredients { get; set; }
    public DbSet<Step> Steps { get; set; }
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Recipe configuration
        builder.Entity<Recipe>(b =>
        {
            b.HasKey(r => r.Id);
            b.Property(r => r.NomeFormula).IsRequired().HasMaxLength(255);
            b.Property(r => r.Status).HasDefaultValue("RASCUNHO");
            b.HasMany(r => r.Ingredientes)
                .WithOne(i => i.Recipe)
                .HasForeignKey(i => i.RecipeId)
                .OnDelete(DeleteBehavior.Cascade);
            b.HasMany(r => r.ModoPreparo)
                .WithOne(s => s.Recipe)
                .HasForeignKey(s => s.RecipeId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Ingredient configuration
        builder.Entity<Ingredient>(b =>
        {
            b.HasKey(i => i.Id);
            b.Property(i => i.Nome).IsRequired().HasMaxLength(255);
        });

        // Step configuration
        builder.Entity<Step>(b =>
        {
            b.HasKey(s => s.Id);
            b.Property(s => s.Text).IsRequired();
        });

        // User configuration
        builder.Entity<User>(b =>
        {
            b.HasKey(u => u.Id);
            b.Property(u => u.Email).IsRequired().HasMaxLength(255);
            b.HasIndex(u => u.Email).IsUnique();
        });
    }
}
```

### Step 3.2: Create Repository Implementation

**File**: `Kerus.Infrastructure/Persistence/Repositories/RecipeRepository.cs`

```csharp
namespace Kerus.Infrastructure.Persistence.Repositories;

using Microsoft.EntityFrameworkCore;
using Kerus.Domain.Entities;
using Kerus.Domain.Repositories;

public class RecipeRepository : IRecipeRepository
{
    private readonly KerusDbContext _context;

    public RecipeRepository(KerusDbContext context)
    {
        _context = context;
    }

    public async Task<Recipe?> GetByIdAsync(Guid id)
    {
        return await _context.Recipes
            .Include(r => r.Ingredientes)
            .Include(r => r.ModoPreparo)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<IEnumerable<Recipe>> ListByUserAsync(Guid userId)
    {
        return await _context.Recipes
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<Recipe> CreateAsync(Recipe recipe)
    {
        await _context.Recipes.AddAsync(recipe);
        await _context.SaveChangesAsync();
        return recipe;
    }

    public async Task UpdateAsync(Recipe recipe)
    {
        recipe.UpdatedAt = DateTime.UtcNow;
        _context.Recipes.Update(recipe);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var recipe = await GetByIdAsync(id);
        if (recipe != null)
        {
            _context.Recipes.Remove(recipe);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.Recipes.AnyAsync(r => r.Id == id);
    }
}
```

### Step 3.3: DI Configuration

**File**: `Kerus.Infrastructure/DependencyInjection.cs`

```csharp
namespace Kerus.Infrastructure;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Kerus.Infrastructure.Persistence;
using Kerus.Infrastructure.Persistence.Repositories;
using Kerus.Domain.Repositories;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Database
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        services.AddDbContext<KerusDbContext>(options =>
            options.UseSqlServer(connectionString));

        // Repositories
        services.AddScoped<IRecipeRepository, RecipeRepository>();

        return services;
    }
}
```

### Step 3.4: API Endpoints

**File**: `Kerus.Api/Endpoints/RecipeEndpoints.cs`

```csharp
namespace Kerus.Api.Endpoints;

using Microsoft.AspNetCore.Mvc;
using Kerus.Domain.Entities;
using Kerus.Domain.Repositories;

public static class RecipeEndpoints
{
    public static void MapRecipeEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/recipes")
            .WithName("Recipes")
            .WithOpenApi();

        group.MapGet("/", GetRecipes)
            .WithName("List Recipes")
            .WithOpenApi();

        group.MapGet("/{id}", GetRecipe)
            .WithName("Get Recipe")
            .WithOpenApi();

        group.MapPost("/", CreateRecipe)
            .WithName("Create Recipe")
            .WithOpenApi();

        group.MapPut("/{id}", UpdateRecipe)
            .WithName("Update Recipe")
            .WithOpenApi();

        group.MapDelete("/{id}", DeleteRecipe)
            .WithName("Delete Recipe")
            .WithOpenApi();
    }

    private static async Task<IResult> GetRecipes(
        [FromServices] IRecipeRepository repository,
        [FromQuery] Guid userId)
    {
        var recipes = await repository.ListByUserAsync(userId);
        return Results.Ok(recipes);
    }

    private static async Task<IResult> GetRecipe(
        [FromRoute] Guid id,
        [FromServices] IRecipeRepository repository)
    {
        var recipe = await repository.GetByIdAsync(id);
        return recipe is null ? Results.NotFound() : Results.Ok(recipe);
    }

    private static async Task<IResult> CreateRecipe(
        [FromBody] CreateRecipeRequest request,
        [FromServices] IRecipeRepository repository)
    {
        var recipe = Recipe.Create(
            request.UserId,
            request.NomeFormula,
            request.TituloFicha,
            request.SubtituloFicha);

        await repository.CreateAsync(recipe);
        return Results.Created($"/api/recipes/{recipe.Id}", recipe);
    }

    private static async Task<IResult> UpdateRecipe(
        [FromRoute] Guid id,
        [FromBody] UpdateRecipeRequest request,
        [FromServices] IRecipeRepository repository)
    {
        var recipe = await repository.GetByIdAsync(id);
        if (recipe is null) return Results.NotFound();

        recipe.NomeFormula = request.NomeFormula;
        recipe.TituloFicha = request.TituloFicha;
        recipe.Status = request.Status;
        recipe.UpdatedAt = DateTime.UtcNow;

        await repository.UpdateAsync(recipe);
        return Results.Ok(recipe);
    }

    private static async Task<IResult> DeleteRecipe(
        [FromRoute] Guid id,
        [FromServices] IRecipeRepository repository)
    {
        await repository.DeleteAsync(id);
        return Results.NoContent();
    }
}

public record CreateRecipeRequest(
    Guid UserId,
    string NomeFormula,
    string? TituloFicha,
    string? SubtituloFicha);

public record UpdateRecipeRequest(
    string NomeFormula,
    string? TituloFicha,
    string Status);
```

### Step 3.5: Program.cs Setup

**File**: `Kerus.Api/Program.cs`

```csharp
using Kerus.Infrastructure;
using Kerus.Api.Endpoints;
using Serilog;

var builder = WebApplicationBuilder.CreateBuilder(args);

// Logging
builder.Host.UseSerilog((context, configuration) =>
    configuration.ReadFrom.Configuration(context.Configuration));

// Services
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddOpenApi();

// CORS
builder.Services.AddCors(options =>
    options.AddPolicy("Frontend", policy =>
        policy.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader()));

var app = builder.Build();

// Middleware
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options =>
        options.SwaggerEndpoint("/openapi/v1.json", "Kerus API v1"));
}

app.UseHttpsRedirection();
app.UseCors("Frontend");

// Endpoints
app.MapRecipeEndpoints();

app.Run();
```

### Step 3.6: appsettings.json

**File**: `Kerus.Api/appsettings.json`

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=KerusDb;Trusted_Connection=true;"
  },
  "Serilog": {
    "MinimumLevel": "Information",
    "WriteTo": [
      {
        "Name": "Console"
      }
    ]
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  },
  "AllowedHosts": "*"
}
```

---

## Phase 4: Database & Testing

### Step 4.1: Create & Apply Migrations

```bash
# From backend/Kerus.Api directory

# Create initial migration
dotnet ef migrations add InitialCreate -p ../Kerus.Infrastructure

# Apply migration (creates database)
dotnet ef database update -p ../Kerus.Infrastructure
```

### Step 4.2: Basic Unit Tests

**File**: `Kerus.Tests/Domain/RecipeTests.cs`

```csharp
using Xunit;
using Kerus.Domain.Entities;

namespace Kerus.Tests.Domain;

public class RecipeTests
{
    [Fact]
    public void Create_WithValidData_ShouldSucceed()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var nome = "Hidratante Facial";

        // Act
        var recipe = Recipe.Create(userId, nome);

        // Assert
        Assert.NotNull(recipe);
        Assert.NotEqual(Guid.Empty, recipe.Id);
        Assert.Equal(nome, recipe.NomeFormula);
        Assert.Equal("RASCUNHO", recipe.Status);
        Assert.Equal(userId, recipe.UserId);
    }

    [Fact]
    public void Create_WithTituloFicha_ShouldSetTitle()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var titulo = "Minha Fórmula";

        // Act
        var recipe = Recipe.Create(userId, "Produto", titulo);

        // Assert
        Assert.Equal(titulo, recipe.TituloFicha);
    }
}
```

### Step 4.3: Run Tests

```bash
dotnet test
```

---

## Troubleshooting

### Error: "Can't resolve type"

**Cause**: Circular dependencies or missing DI registration

**Solution**:
```bash
# Clean and rebuild
dotnet clean
dotnet build
```

### Error: "Database connection failed"

**Cause**: SQL Server not running or connection string wrong

**Solution**:
```bash
# For LocalDB
sqllocaldb start mssqllocaldb

# Or use Docker
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourPassword123!" -p 1433:1433 mcr.microsoft.com/mssql/server:2022-latest
```

### Error: Migration not found

**Cause**: EF tools not installed or wrong working directory

**Solution**:
```bash
# Install EF CLI
dotnet tool install --global dotnet-ef

# Run from project directory
cd Kerus.Api
dotnet ef migrations list
```

---

## Next Steps

1. ✅ Projects created & setup
2. ✅ Domain entities defined
3. ✅ Database & EF Core configured
4. ✅ API endpoints working
5. ⏳ **Add JWT authentication** (see [ARCHITECTURE.md](./ARCHITECTURE.md#authentication--authorization))
6. ⏳ **Implement DTOs & AutoMapper**
7. ⏳ **Add validators (FluentValidation)**
8. ⏳ **Write integration tests**
9. ⏳ **Deploy to production**

---

## Related Documentation

- 🏗️ [Architecture](./ARCHITECTURE.md)
- 🎯 [Project Objectives](./OBJECTIVES.md)
- 📄 [API Contract](./api-contract.md)

---

**Last updated**: 2026-03-26
**Created by**: Claude + User
