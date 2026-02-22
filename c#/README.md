# C# (.NET)

Learning backend development with C# and ASP.NET Core — a modern, cross-platform framework for building web APIs.

## Syntax Topics

- Variables (`var`, explicit types), constants (`const`, `readonly`)
- Value types vs reference types
- Classes, structs, records
- Properties, auto-properties, and access modifiers
- Interfaces and abstract classes
- Generics (`List<T>`, `Dictionary<TKey, TValue>`)
- LINQ — querying collections with `Where`, `Select`, `FirstOrDefault`, etc.
- Async/await with `Task<T>` and `ValueTask<T>`
- Exception handling (`try/catch/finally`, custom exceptions)
- Nullable reference types (`string?`, `int?`)
- Pattern matching (`switch` expressions, `is` patterns)
- Dependency Injection (built-in DI container)
- Attributes and reflection basics

## CRUD Lifecycle

```
Client → ASP.NET Core Pipeline → Middleware → Controller / Minimal API → Service → Repository → Database → Response
```

1. **Middleware pipeline** — request passes through registered middleware (auth, logging, CORS)
2. **Routing** — matches URL to controller action or minimal API endpoint
3. **Model binding** — maps request body/params to C# objects
4. **Validation** — `DataAnnotations` or `FluentValidation`
5. **Controller / Handler** — calls service layer
6. **Service** — business logic, injected via DI
7. **Repository** — data access via Entity Framework Core or Dapper
8. **Response** — serialized to JSON via `System.Text.Json`

## Application Lifecycle

ASP.NET Core uses a `WebApplication` host with a built-in lifecycle:

| Phase | Description |
|-------|-------------|
| `builder.Build()` | Configures services and middleware |
| `app.Run()` | Starts the HTTP server |
| `IHostedService` | Background services (startup/shutdown hooks) |
| `IApplicationLifetime` | `ApplicationStarted`, `ApplicationStopping`, `ApplicationStopped` events |

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddScoped<IItemService, ItemService>();

var app = builder.Build();

app.UseHttpsRedirection();
app.MapControllers();

app.Run();
```

## Project Structure (CRUD)

```
c#/
└── crud-project/
    ├── Controllers/
    │   └── ItemsController.cs
    ├── Services/
    │   ├── IItemService.cs
    │   └── ItemService.cs
    ├── Repositories/
    │   └── ItemRepository.cs
    ├── Models/
    │   └── Item.cs
    ├── DTOs/
    │   └── CreateItemDto.cs
    ├── Program.cs
    └── crud-project.csproj
```

## Setup

```bash
dotnet restore
dotnet run

# With live reload
dotnet watch run
```

## Key Packages (NuGet)

- `Microsoft.AspNetCore` — web framework (included in SDK)
- `Microsoft.EntityFrameworkCore` — ORM
- `Microsoft.EntityFrameworkCore.SqlServer` / `.Npgsql` / `.Sqlite` — database providers
- `FluentValidation.AspNetCore` — request validation
- `Swashbuckle.AspNetCore` — Swagger / OpenAPI docs
- `Dapper` — lightweight SQL micro-ORM
