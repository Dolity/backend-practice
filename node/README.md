# Node.js

Learning backend development with Node.js and its ecosystem.

## Frameworks Covered

| Framework | Type | Folder |
|-----------|------|--------|
| Express.js | Minimal, unopinionated web framework | `expressJs/` |
| NestJS | Opinionated, modular framework (TypeScript-first) | `nestJs/` |
| Elysia | Bun-based, high-performance framework | `elysia/` |

## Syntax Topics

- Variables, types, and type coercion
- Functions, arrow functions, closures
- Async/await, Promises, callbacks
- Modules (CommonJS vs ESM)
- Classes and prototypes
- Error handling (`try/catch`, custom errors)
- Streams and file I/O
- TypeScript basics (types, interfaces, generics, decorators)

## CRUD Lifecycle

Each framework subfolder contains a CRUD project covering:

- **Routing** — defining HTTP routes (GET, POST, PUT/PATCH, DELETE)
- **Request handling** — parsing body, query params, path params
- **Middleware** — logging, validation, error handling middleware
- **Response** — JSON responses, status codes
- **Database** — connecting to a database (e.g. PostgreSQL, MongoDB, SQLite)
- **Lifecycle hooks** — startup/shutdown logic, dependency injection (NestJS)

## Mini Projects (Express.js)

- `task-tracker/` — CLI task manager (JSON file storage)
- `github-user-activity/` — Fetch GitHub user events via API
- `expense-tracker/` — Expense management CLI
- `number-guessing-game/` — Console number guessing game
- `unit-converter/` — Unit conversion CLI/API

## Setup

```bash
# Node.js projects
npm install
npm run dev

# Bun (Elysia)
bun install
bun dev
```

## Runtime Requirements

- **Node.js** >= 20.x
- **Bun** >= 1.x (for Elysia)
- **TypeScript** (for NestJS and typed Express projects)
