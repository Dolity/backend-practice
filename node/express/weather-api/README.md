# Weather API

https://roadmap.sh/projects/weather-api-wrapper-service

A simple Express REST API that fetches weather data from the Visual Crossing API and caches responses in Redis.

## Features

- `GET /weather?city={name}` — current weather for a city
- Redis cache with 12-hour TTL (city name as key)
- Environment variables for API key and Redis URL
- Rate limiting (100 requests per 15 minutes per IP)
- Graceful fallback when Redis is unavailable (fetches from API directly)

## Technology Stack

- **Runtime**: Node.js (ES modules, native `fetch`)
- **Framework**: Express.js
- **Cache**: Redis 7 (Docker)
- **Upstream API**: [Visual Crossing Timeline API](https://www.visualcrossing.com/resources/documentation/weather-api/timeline-weather-api/)

## Requirements

- Node.js v18+
- Docker (for Redis)
- Free Visual Crossing API key — sign up at [visualcrossing.com](https://www.visualcrossing.com/)

## Installation

```bash
cd node/express/weather-api
docker compose up -d
cp .env.example .env
# Edit .env and set VISUAL_CROSSING_API_KEY
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

Fetch weather for London:

```bash
curl "http://localhost:3000/weather?city=London"
```

Sample response:

```json
{
  "city": "London, England, United Kingdom",
  "cached": false,
  "temperature": 18.5,
  "conditions": "Partially cloudy",
  "humidity": 65,
  "windSpeed": 12.3,
  "fetchedAt": "2025-06-25T10:00:00.000Z"
}
```

Call again — `cached` will be `true` if Redis is running.

Missing city parameter:

```bash
curl "http://localhost:3000/weather"
# {"error":"city query parameter is required"}
```

Invalid city:

```bash
curl "http://localhost:3000/weather?city=zzzznotacity"
# {"error":"City not found"}
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VISUAL_CROSSING_API_KEY` | — | **Required.** Your Visual Crossing API key |
| `REDIS_URL` | `redis://localhost:6379` | Redis connection string |
| `PORT` | `3000` | HTTP port |
| `CACHE_TTL_SECONDS` | `43200` | Cache TTL (12 hours) |
| `RATE_LIMIT_MAX` | `100` | Max requests per window per IP |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Rate limit window (15 minutes) |

## Project Structure

```text
weather-api/
├── index.js              # Express app and /weather route
├── docker-compose.yml    # Redis container
├── .env.example
├── lib/
│   ├── cache.js          # Redis get/set with EX TTL
│   └── weather.js        # Visual Crossing fetch + normalize
└── README.md
```

## Reference

- Original project idea from: https://roadmap.sh/projects/weather-api-wrapper-service
