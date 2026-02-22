# Go (Golang)

Learning backend development with Go — a statically typed, compiled language designed for simplicity and performance.

## Syntax Topics

- Variables (`var`, `:=`), constants (`const`)
- Basic types: `int`, `float64`, `string`, `bool`, `byte`, `rune`
- Arrays, slices, and maps
- Structs and methods
- Interfaces and duck typing
- Pointers (`*`, `&`)
- Functions — multiple return values, named returns
- Error handling — `error` interface, `errors.New`, `fmt.Errorf`, `errors.Is/As`
- Goroutines and channels — basic concurrency
- Packages and modules (`go.mod`, `go.sum`)
- `defer`, `panic`, `recover`

## CRUD Lifecycle

```
Client → Router (net/http / Gin) → Middleware → Handler → Service → Repository → Database → Response
```

1. **Router** — registers routes with HTTP method and path
2. **Middleware** — logging, auth, CORS (chained via `http.Handler`)
3. **Handler** — parses request, calls service, writes response
4. **Service** — business logic
5. **Repository** — database queries (raw SQL / GORM / sqlx)
6. **Response** — `json.Marshal` / `c.JSON` (Gin)

## Application Lifecycle

```go
// Graceful shutdown pattern
srv := &http.Server{Addr: ":8080", Handler: router}

go srv.ListenAndServe()

// Wait for interrupt signal
quit := make(chan os.Signal, 1)
signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
<-quit

ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()
srv.Shutdown(ctx)
```

## Project Structure (CRUD)

```
golang/
└── crud-project/
    ├── cmd/
    │   └── main.go
    ├── internal/
    │   ├── handler/
    │   ├── service/
    │   ├── repository/
    │   └── model/
    ├── go.mod
    └── go.sum
```

## Setup

```bash
go mod tidy
go run ./cmd/main.go

# Or with air (live reload)
air
```

## Key Packages

- `net/http` — standard library HTTP server
- `github.com/gin-gonic/gin` — popular web framework
- `github.com/gofiber/fiber` — Express-inspired framework
- `gorm.io/gorm` — ORM
- `github.com/jmoiron/sqlx` — SQL extensions
- `github.com/joho/godotenv` — `.env` loader
