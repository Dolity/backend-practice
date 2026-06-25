# Express.js

Learning backend development with Express.js — a minimal, unopinionated Node.js web framework.

## Syntax Topics

- Routing (`app.get`, `app.post`, `app.put`, `app.delete`)
- Middleware (`app.use`, custom middleware functions)
- Request object (`req.body`, `req.params`, `req.query`, `req.headers`)
- Response object (`res.json`, `res.status`, `res.send`)
- Error handling middleware (4-argument signature)
- Router modularization (`express.Router`)
- Environment variables with `dotenv`
- Async route handlers with `try/catch`

## CRUD Lifecycle

```
Client → Route → Middleware → Controller → Service → Database → Response
```

1. **Route** — maps HTTP method + path to a handler
2. **Middleware** — validates request, parses body, checks auth
3. **Controller** — extracts data from request, calls service
4. **Service** — business logic, calls database/repository
5. **Database** — query execution (SQL/NoSQL)
6. **Response** — formats and sends JSON back to client

## Project Structure (CRUD)

```
expressJs/
└── crud-project/
    ├── src/
    │   ├── routes/
    │   ├── controllers/
    │   ├── services/
    │   ├── middlewares/
    │   └── app.js
    ├── package.json
    └── README.md
```

## Setup

```bash
npm install
npm run dev
```

## Key Packages

- `express` — web framework
- `dotenv` — environment variables
- `zod` / `joi` — request validation
- `prisma` / `pg` / `mongoose` — database ORM/driver
