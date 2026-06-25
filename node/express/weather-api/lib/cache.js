import { createClient } from "redis";

let client = null;
let available = false;

export const cacheKey = (city) => `weather:${city.toLowerCase().trim()}`;

export const connectCache = async (url) => {
  client = createClient({
    url,
    socket: {
      connectTimeout: 2000,
      reconnectStrategy: false,
    },
  });
  client.on("error", (err) => {
    console.warn("Redis error:", err.message);
    available = false;
  });
  try {
    await client.connect();
    available = true;
    console.log("Redis connected");
  } catch (err) {
    console.warn("Redis unavailable, caching disabled:", err.message);
    available = false;
    client = null;
  }
};

export const getCached = async (key) => {
  if (!available || !client?.isOpen) return null;
  try {
    const raw = await client.get(key);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.warn("Cache read failed:", err.message);
    return null;
  }
};

export const setCached = async (key, value, ttlSeconds) => {
  if (!available || !client?.isOpen) return;
  try {
    await client.set(key, JSON.stringify(value), { EX: ttlSeconds });
  } catch (err) {
    console.warn("Cache write failed:", err.message);
  }
};
