# GitHub Trending CLI

https://roadmap.sh/projects/github-trending-cli

A command-line tool that fetches trending GitHub repositories via the GitHub Search REST API and displays them in a readable format.

## Features

- Filter by time range: `day`, `week`, `month`, `year` (default: `week`)
- Limit number of results (default: `10`, max: `100`)
- Sorted by star count
- Displays repository name, description, stars, and language
- Error handling for invalid input and API failures

## Requirements

- Node.js v18+ (uses native `fetch`)

## Installation

```bash
cd node/express/github-trending-cli
npm install
```

Optional — install globally to use `trending-repos` command:

```bash
npm link
```

## Usage

```bash
# Default: week, top 10
node index.js

# Custom duration and limit
node index.js --duration month --limit 20

# Via bin (after npm link)
trending-repos --duration month --limit 20
```

### Options

| Flag | Default | Description |
|------|---------|-------------|
| `--duration` | `week` | Time range: `day`, `week`, `month`, `year` |
| `--limit` | `10` | Number of repositories (1–100) |

### Examples

Past day, top 5:

```bash
node index.js --duration day --limit 5
```

Past year, top 20:

```bash
node index.js --duration year --limit 20
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_TOKEN` | No | Personal access token — raises rate limit from 60 to 5000 requests/hour |

```bash
export GITHUB_TOKEN=ghp_your_token_here
node index.js --duration week
```

## How It Works

GitHub has no official trending REST endpoint. This CLI uses the [Search Repositories API](https://docs.github.com/en/rest/search/search#search-repositories) with a `created:>DATE` filter to find recently created repositories, sorted by stars.

## Project Structure

```text
github-trending-cli/
├── index.js          # CLI entry point (commander)
├── package.json
├── lib/
│   ├── github.js     # GitHub Search API client
│   ├── validate.js   # Input validation
│   └── format.js     # Console output formatting
└── README.md
```

## Reference

- Original project idea from: https://roadmap.sh/projects/github-trending-cli
