import "dotenv/config";
import express from "express";
import rateLimit from "express-rate-limit";
import { cacheKey, connectCache, getCached, setCached } from "./lib/cache.js";
import { fetchWeather, WeatherError } from "./lib/weather.js";

const PORT = Number(process.env.PORT) || 3000;
const CACHE_TTL = Number(process.env.CACHE_TTL_SECONDS) || 43200;
const API_KEY = process.env.VISUAL_CROSSING_API_KEY;
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

if (!API_KEY) {
  console.error("VISUAL_CROSSING_API_KEY is required. Copy .env.example to .env and set your key.");
  process.exit(1);
}

const app = express();

app.use(
  rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 900_000,
    max: Number(process.env.RATE_LIMIT_MAX) || 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests" },
  })
);

app.get("/weather", async (req, res) => {
  const city = req.query.city?.trim();
  if (!city) {
    return res.status(400).json({ error: "city query parameter is required" });
  }

  const key = cacheKey(city);

  try {
    const cached = await getCached(key);
    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    const weather = await fetchWeather(city, API_KEY);
    await setCached(key, weather, CACHE_TTL);
    res.json({ ...weather, cached: false });
  } catch (err) {
    if (err instanceof WeatherError) {
      return res.status(err.status).json({ error: err.message });
    }
    console.error(err);
    res.status(502).json({ error: "Weather service unavailable" });
  }
});

await connectCache(REDIS_URL);

app.listen(PORT, () => {
  console.log(`Weather API running at http://localhost:${PORT}`);
});
