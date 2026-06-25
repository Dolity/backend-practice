# Personal Blog

A simple personal blog built with Express.js. Publish articles for guests to read, and manage them from a password-protected admin section.

## Features

### Guest Section (public)

- **Home Page** — list of published articles with title and date
- **Article Page** — full article content with publication date

### Admin Section (login required)

- **Dashboard** — list articles with add, edit, and delete actions
- **Add Article** — form with title, content, and publication date
- **Edit Article** — update an existing article

## Technology Stack

- **Runtime**: Node.js (ES modules)
- **Framework**: Express.js
- **Templating**: EJS
- **Auth**: `express-session` with hardcoded credentials (practice only)
- **Storage**: JSON files in `articles/` directory

## Requirements

- Node.js v18+ recommended

## Installation

```bash
cd node/express/personal-blog
npm install
```

## Usage

Start the server:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

For development with auto-restart on file changes:

```bash
npm run dev
```

### Default Admin Credentials

| Field    | Value   |
|----------|---------|
| Username | `admin` |
| Password | `admin` |

Override with environment variables `ADMIN_USER` and `ADMIN_PASS` if needed.

## Project Structure

```text
personal-blog/
├── index.js              # Express app and routes
├── package.json
├── articles/             # One JSON file per article
├── lib/
│   └── articles.js       # Filesystem CRUD helpers
├── middleware/
│   └── auth.js           # Session guard for admin routes
├── public/
│   └── style.css
└── views/
    ├── partials/
    ├── home.ejs
    ├── article.ejs
    ├── login.ejs
    └── admin/
```

## Data Storage

Each article is stored as `articles/<slug>.json`:

```json
{
  "slug": "welcome-to-my-blog",
  "title": "Welcome to My Blog",
  "content": "Article body as plain text.",
  "publishedAt": "2025-06-20"
}
```

## Reference

- Original project idea from: https://roadmap.sh/projects/personal-blog
