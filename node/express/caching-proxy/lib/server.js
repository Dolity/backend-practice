import express from "express";
import { cacheKey, getCached, setCached } from "./cache.js";

const HOP_BY_HOP = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
  "host",
]);

// ponytail: body stored decoded from fetch; drop encoding/length so Express sets correct values
const STRIP_ENCODED = new Set(["content-encoding", "content-length"]);

const pickHeaders = (headers) => {
  const out = {};
  for (const [name, value] of headers.entries()) {
    const lower = name.toLowerCase();
    if (!HOP_BY_HOP.has(lower) && !STRIP_ENCODED.has(lower)) {
      out[name] = value;
    }
  }
  return out;
};

const forwardHeaders = (reqHeaders) => {
  const out = {};
  for (const [name, value] of Object.entries(reqHeaders)) {
    if (!HOP_BY_HOP.has(name.toLowerCase())) {
      out[name] = value;
    }
  }
  return out;
};

const sendEntry = (res, entry, cacheStatus) => {
  res.status(entry.status);
  for (const [name, value] of Object.entries(entry.headers)) {
    res.setHeader(name, value);
  }
  res.setHeader("X-Cache", cacheStatus);
  res.send(entry.body);
};

export const createProxyApp = (origin) => {
  const app = express();
  const originUrl = new URL(origin);

  app.all(/.*/, async (req, res) => {
    const target = new URL(req.originalUrl, originUrl);
    const query = new URLSearchParams(req.query).toString();
    const key = cacheKey(req.method, req.path, query ? `?${query}` : "");

    if (req.method === "GET") {
      try {
        const cached = await getCached(key);
        if (cached) {
          return sendEntry(res, cached, "HIT");
        }
      } catch (err) {
        console.error("Cache read error:", err.message);
      }
    }

    try {
      const upstream = await fetch(target, {
        method: req.method,
        headers: forwardHeaders(req.headers),
        body: ["GET", "HEAD"].includes(req.method) ? undefined : req,
        duplex: ["GET", "HEAD"].includes(req.method) ? undefined : "half",
      });

      const body = Buffer.from(await upstream.arrayBuffer());
      const headers = pickHeaders(upstream.headers);
      const entry = { status: upstream.status, headers, body };

      if (req.method === "GET" && upstream.ok) {
        try {
          await setCached(key, entry);
        } catch (err) {
          console.error("Cache write error:", err.message);
        }
      }

      sendEntry(res, entry, "MISS");
    } catch (err) {
      console.error("Origin fetch error:", err.message);
      res.status(502).setHeader("X-Cache", "MISS").json({ error: "Bad gateway", message: err.message });
    }
  });

  return app;
};
