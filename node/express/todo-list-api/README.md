# Todo List API

https://roadmap.sh/projects/todo-list-api

A RESTful API for managing a personal to-do list with user registration, JWT authentication, and MySQL persistence.

## Features

- `POST /register` — create a user account, returns JWT
- `POST /login` — authenticate, returns JWT
- `POST /todos` — create a to-do (auth required)
- `GET /todos?page=1&limit=10&q=` — list to-dos with pagination and optional text filter (auth required)
- `PUT /todos/:id` — update a to-do (auth + ownership required)
- `DELETE /todos/:id` — delete a to-do (auth + ownership required)

## Technology Stack

- **Runtime**: Node.js (ES modules)
- **Framework**: Express.js
- **Database**: MySQL 8 (Docker, port 3307)
- **Auth**: JWT (`jsonwebtoken`) + bcrypt password hashing

## Requirements

- Node.js v18+
- Docker (for MySQL)

## Installation

```bash
cd node/express/todo-list-api
docker compose up -d
cp .env.example .env
# Edit .env — set JWT_SECRET to a long random string
npm install
```

## Usage

```bash
npm start
```

Development with auto-restart:

```bash
npm run dev
```

### Full flow example

Register:

```bash
curl -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@doe.com","password":"password"}'
```

Login:

```bash
curl -X POST http://localhost:3001/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@doe.com","password":"password"}'
```

Create a to-do (use token from register/login):

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X POST http://localhost:3001/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Buy groceries","description":"Buy milk, eggs, and bread"}'
```

List to-dos (paginated):

```bash
curl "http://localhost:3001/todos?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

Filter to-dos:

```bash
curl "http://localhost:3001/todos?q=groceries" \
  -H "Authorization: Bearer $TOKEN"
```

Update a to-do:

```bash
curl -X PUT http://localhost:3001/todos/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Buy groceries","description":"Buy milk, eggs, bread, and cheese"}'
```

Delete a to-do:

```bash
curl -X DELETE http://localhost:3001/todos/1 \
  -H "Authorization: Bearer $TOKEN"
```

Unauthorized (no token):

```bash
curl http://localhost:3001/todos
# {"message":"Unauthorized"}
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `MYSQL_HOST` | `localhost` | MySQL host |
| `MYSQL_PORT` | `3307` | MySQL port (3307 to avoid clash with bloging-platform-api) |
| `MYSQL_USER` | `todo` | MySQL user |
| `MYSQL_PASSWORD` | `todo` | MySQL password |
| `MYSQL_DATABASE` | `todo` | Database name |
| `JWT_SECRET` | — | **Required.** Secret for signing JWTs |
| `JWT_EXPIRES_IN` | `7d` | Token expiry |
| `PORT` | `3001` | HTTP port |

## Project Structure

```text
todo-list-api/
├── index.js              # Express app and routes
├── docker-compose.yml    # MySQL container (port 3307)
├── init.sql              # users + todos schema
├── .env.example
├── lib/
│   ├── db.js             # mysql2 pool with connect retry
│   ├── auth.js           # bcrypt + JWT + requireAuth middleware
│   ├── users.js          # register + login
│   ├── todos.js          # CRUD scoped by user_id
│   └── validate.js       # request body validation
└── README.md
```

## Reference

- Original project idea from: https://roadmap.sh/projects/todo-list-api
