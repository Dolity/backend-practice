# Expense Tracker API

https://roadmap.sh/projects/expense-tracker-api

A RESTful API for tracking personal expenses with user registration, JWT authentication, date-range filters, and MySQL persistence.

## Features

- `POST /register` — create a user account, returns JWT
- `POST /login` — authenticate, returns JWT
- `POST /expenses` — add an expense (auth required)
- `GET /expenses?period=&startDate=&endDate=` — list expenses with optional date filters (auth required)
- `PUT /expenses/:id` — update an expense (auth + ownership required)
- `DELETE /expenses/:id` — delete an expense (auth + ownership required)

### Date filters (`period`)

| Value | Description |
|-------|-------------|
| *(omit)* | All expenses |
| `week` | Past 7 days |
| `month` | Past month |
| `3months` | Past 3 months |
| `custom` | Requires `startDate` and `endDate` (`YYYY-MM-DD`) |

### Categories

Groceries, Leisure, Electronics, Utilities, Clothing, Health, Others

## Technology Stack

- **Runtime**: Node.js (ES modules)
- **Framework**: Express.js
- **Database**: MySQL 8 (Docker, port 3308)
- **Auth**: JWT (`jsonwebtoken`) + bcrypt password hashing

## Requirements

- Node.js v18+
- Docker (for MySQL)

## Installation

```bash
cd node/express/expense-tracker-api
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
curl -X POST http://localhost:3002/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@doe.com","password":"password"}'
```

Login:

```bash
curl -X POST http://localhost:3002/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@doe.com","password":"password"}'
```

Create an expense (use token from register/login):

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X POST http://localhost:3002/expenses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"description":"Weekly groceries","amount":45.50,"category":"Groceries","date":"2024-06-01"}'
```

List all expenses:

```bash
curl http://localhost:3002/expenses \
  -H "Authorization: Bearer $TOKEN"
```

Filter by past week:

```bash
curl "http://localhost:3002/expenses?period=week" \
  -H "Authorization: Bearer $TOKEN"
```

Filter by custom date range:

```bash
curl "http://localhost:3002/expenses?period=custom&startDate=2024-01-01&endDate=2024-12-31" \
  -H "Authorization: Bearer $TOKEN"
```

Update an expense:

```bash
curl -X PUT http://localhost:3002/expenses/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"description":"Weekly groceries","amount":52.00,"category":"Groceries","date":"2024-06-01"}'
```

Delete an expense:

```bash
curl -X DELETE http://localhost:3002/expenses/1 \
  -H "Authorization: Bearer $TOKEN"
```

Unauthorized (no token):

```bash
curl http://localhost:3002/expenses
# {"message":"Unauthorized"}
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `MYSQL_HOST` | `localhost` | MySQL host |
| `MYSQL_PORT` | `3308` | MySQL port (3308 to avoid clash with other projects) |
| `MYSQL_USER` | `expense` | MySQL user |
| `MYSQL_PASSWORD` | `expense` | MySQL password |
| `MYSQL_DATABASE` | `expense` | Database name |
| `JWT_SECRET` | — | **Required.** Secret for signing JWTs |
| `JWT_EXPIRES_IN` | `7d` | Token expiry |
| `PORT` | `3002` | HTTP port |

## Project Structure

```text
expense-tracker-api/
├── index.js              # Express app and routes
├── docker-compose.yml    # MySQL container (port 3308)
├── init.sql              # users + expenses schema
├── .env.example
├── lib/
│   ├── db.js             # mysql2 pool with connect retry
│   ├── auth.js           # bcrypt + JWT + requireAuth middleware
│   ├── users.js          # register + login
│   ├── expenses.js       # CRUD scoped by user_id + date filters
│   └── validate.js       # request body and period validation
└── README.md
```

## Reference

- Original project idea from: https://roadmap.sh/projects/expense-tracker-api
