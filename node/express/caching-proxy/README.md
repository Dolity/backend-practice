# Caching Proxy

https://roadmap.sh/projects/caching-server

A CLI tool that starts a caching proxy server. It forwards requests to an origin server and caches GET responses to disk. Repeat requests return the cached response with `X-Cache: HIT`.

## Requirements

- Node.js v18+ (uses native `fetch`)

## Installation

```bash
cd node/express/caching-proxy
npm install
```

Optional — install globally:

```bash
npm link
```

## Usage

Start the proxy:

```bash
node index.js --port 3000 --origin http://dummyjson.com
```

Clear cached responses:

```bash
node index.js --clear-cache
```

### Options

| Flag | Description |
|------|-------------|
| `--port <number>` | Port for the caching proxy server (1–65535) |
| `--origin <url>` | Origin server URL (`http:` or `https:`) |
| `--clear-cache` | Delete all cached responses in `.cache/` |

## Manual Test

Terminal 1 — start server:

```bash
node index.js --port 3000 --origin http://dummyjson.com
```

Terminal 2:

```bash
curl -i localhost:3000/products        # X-Cache: MISS
curl -i localhost:3000/products        # X-Cache: HIT
node index.js --clear-cache
curl -i localhost:3000/products        # X-Cache: MISS (after clear)
```

## How It Works

1. Client requests `http://localhost:3000/products`
2. Proxy forwards to `http://dummyjson.com/products`
3. On first GET, response is saved under `.cache/` and returned with `X-Cache: MISS`
4. On repeat GET, response is read from disk with `X-Cache: HIT`
5. Non-GET requests are forwarded but not cached

## Project Structure

```text
caching-proxy/
├── index.js          # CLI entry point (commander)
├── package.json
├── lib/
│   ├── cache.js      # File-based cache read/write/clear
│   ├── server.js     # Express proxy handler
│   └── validate.js   # Input validation
└── README.md
```
