# Elysia

Learning backend development with Elysia — a high-performance, Bun-native TypeScript web framework.

## Syntax Topics

- Route definition with method chaining (`.get`, `.post`, `.put`, `.delete`)
- Schema validation with built-in `t` (TypeBox) — body, params, query, headers
- Context object (`ctx.body`, `ctx.params`, `ctx.query`, `ctx.set.status`)
- Lifecycle hooks (`onRequest`, `onBeforeHandle`, `onAfterHandle`, `onError`)
- Plugins — modular route grouping with `new Elysia().use(plugin)`
- Guards and decorators for shared state
- `derive` and `decorate` for extending context

## CRUD Lifecycle

```
Client → Elysia Router → Schema Validation → Hook (onBeforeHandle) → Handler → Hook (onAfterHandle) → Response
```

1. **Router** — matches HTTP method + path
2. **Schema validation** — validates body/params/query against TypeBox schema
3. **Before handle hook** — auth checks, logging
4. **Handler** — business logic, database calls
5. **After handle hook** — response transformation
6. **Response** — auto-serialized JSON

## Application Lifecycle Hooks

| Hook | When it runs |
|------|-------------|
| `onStart` | When the server starts |
| `onStop` | When the server stops |
| `onRequest` | On every incoming request |
| `onBeforeHandle` | Before the route handler |
| `onAfterHandle` | After the route handler |
| `onError` | On any thrown error |

## Project Structure (CRUD)

```
elysia/
└── crud-project/
    ├── src/
    │   ├── routes/
    │   ├── services/
    │   └── index.ts
    ├── package.json
    └── tsconfig.json
```

## Setup

```bash
bun install
bun dev
```

## Key Packages

- `elysia` — web framework
- `@elysiajs/swagger` — auto-generated Swagger docs
- `@elysiajs/cors` — CORS plugin
- `prisma` / `drizzle-orm` — database ORM
