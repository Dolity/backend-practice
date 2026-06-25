# Blogging Platform API

https://roadmap.sh/projects/blogging-platform-api

A RESTful API for a personal blogging platform with CRUD operations on blog posts, backed by MySQL.

## Features

- `POST /posts` — create a blog post
- `GET /posts` — list all posts
- `GET /posts?term=tech` — search posts by title, content, or category
- `GET /posts/:id` — get a single post
- `PUT /posts/:id` — update a post
- `DELETE /posts/:id` — delete a post

## Technology Stack

- **Runtime**: Node.js (ES modules)
- **Framework**: Express.js
- **Database**: MySQL 8 (Docker)
- **Driver**: `mysql2`

## Requirements

- Node.js v18+
- Docker (for MySQL)

## Installation

```bash
cd node/express/bloging-platform-api
docker compose up -d
cp .env.example .env
npm install
```

## Usage

Start the server:

```bash
npm start
```

For development with auto-restart:

```bash
npm run dev
```

### Examples

Create a post:

```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Blog Post",
    "content": "This is the content of my first blog post.",
    "category": "Technology",
    "tags": ["Tech", "Programming"]
  }'
```

List all posts:

```bash
curl http://localhost:3000/posts
```

Search posts:

```bash
curl "http://localhost:3000/posts?term=tech"
```

Get a single post:

```bash
curl http://localhost:3000/posts/1
```

Update a post:

```bash
curl -X PUT http://localhost:3000/posts/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Updated Blog Post",
    "content": "This is the updated content.",
    "category": "Technology",
    "tags": ["Tech", "Programming"]
  }'
```

Delete a post:

```bash
curl -X DELETE http://localhost:3000/posts/1
```

Validation error (missing fields):

```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"title": ""}'
# {"errors":["title is required","content is required","category is required","tags must be an array"]}
```

Post not found:

```bash
curl http://localhost:3000/posts/999
# {"error":"Post not found"}
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `MYSQL_HOST` | `localhost` | MySQL host |
| `MYSQL_PORT` | `3306` | MySQL port |
| `MYSQL_USER` | `blog` | MySQL user |
| `MYSQL_PASSWORD` | `blog` | MySQL password |
| `MYSQL_DATABASE` | `blog` | Database name |
| `PORT` | `3000` | HTTP port |

## Project Structure

```text
bloging-platform-api/
├── index.js              # Express app and /posts routes
├── docker-compose.yml    # MySQL container
├── init.sql              # posts table schema
├── .env.example
├── lib/
│   ├── db.js             # mysql2 pool with connect retry
│   ├── posts.js          # CRUD + search SQL
│   └── validate.js       # request body validation
└── README.md
```

## Reference

- Original project idea from: https://roadmap.sh/projects/blogging-platform-api
