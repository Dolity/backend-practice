import { createHash } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

export const CACHE_DIR = path.join(process.cwd(), ".cache");

const cacheFilePath = (key) => path.join(CACHE_DIR, key);

export const cacheKey = (method, pathname, search) => {
  const query = search.startsWith("?") ? search.slice(1) : search;
  const sorted = query
    ? new URLSearchParams(query).toString()
    : "";
  const raw = `${method.toUpperCase()}:${pathname}${sorted ? `?${sorted}` : ""}`;
  return createHash("sha256").update(raw).digest("hex");
};

export const getCached = async (key) => {
  try {
    const raw = await readFile(cacheFilePath(key), "utf8");
    const entry = JSON.parse(raw);
    return {
      status: entry.status,
      headers: entry.headers,
      body: Buffer.from(entry.body, "base64"),
    };
  } catch (err) {
    if (err.code === "ENOENT") return null;
    throw err;
  }
};

export const setCached = async (key, { status, headers, body }) => {
  await mkdir(CACHE_DIR, { recursive: true });
  const entry = {
    status,
    headers,
    body: Buffer.from(body).toString("base64"),
  };
  await writeFile(cacheFilePath(key), JSON.stringify(entry));
};

export const clearCache = async () => {
  await rm(CACHE_DIR, { recursive: true, force: true });
};
