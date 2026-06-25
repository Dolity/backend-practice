# TMDB CLI Tool

https://roadmap.sh/projects/tmdb-cli

A command-line tool that fetches movie lists from [The Movie Database (TMDB)](https://www.themoviedb.org/) API and displays them in the terminal.

## Features

- Fetch now playing, popular, top rated, or upcoming movies
- Display title, overview, rating, and release date
- Error handling for invalid input, API failures, and network issues

## Requirements

- Node.js v18+ (uses native `fetch`)
- TMDB API key (free at https://www.themoviedb.org/settings/api)

## Installation

```bash
cd node/express/tmdb-cli-tool
npm install
cp .env.example .env
# Edit .env — set TMDB_API_KEY to your API key
```

Optional — install globally to use `tmdb-app` command:

```bash
npm link
```

## Usage

```bash
tmdb-app --type playing
tmdb-app --type popular
tmdb-app --type top
tmdb-app --type upcoming

# Or run directly
node index.js --type popular
```

### Options

| Flag | Required | Values |
|------|----------|--------|
| `--type` | Yes | `playing`, `popular`, `top`, `upcoming` |

### Type mapping

| `--type` | TMDB endpoint | Description |
|----------|---------------|-------------|
| `playing` | `/movie/now_playing` | Now playing in theaters |
| `popular` | `/movie/popular` | Popular movies |
| `top` | `/movie/top_rated` | Top rated movies |
| `upcoming` | `/movie/upcoming` | Upcoming releases |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `TMDB_API_KEY` | Yes | Your TMDB API key |

## Project Structure

```text
tmdb-cli-tool/
├── index.js          # CLI entry point (commander + dotenv)
├── package.json
├── .env.example
├── lib/
│   ├── tmdb.js       # TMDB API client
│   ├── validate.js   # Input validation
│   └── format.js     # Console output formatting
└── README.md
```

## Reference

- Original project idea from: https://roadmap.sh/projects/tmdb-cli
- TMDB API docs: https://developer.themoviedb.org/docs
