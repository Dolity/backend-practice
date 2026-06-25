#!/usr/bin/env node
import { program } from "commander";
import { clearCache } from "./lib/cache.js";
import { createProxyApp } from "./lib/server.js";
import { normalizeOrigin, validateOrigin, validatePort } from "./lib/validate.js";

program
  .name("caching-proxy")
  .description("Caching proxy server that forwards requests to an origin")
  .option("--port <number>", "port for the caching proxy server")
  .option("--origin <url>", "origin server URL to forward requests to")
  .option("--clear-cache", "clear all cached responses");

program.parse();

const { port, origin, clearCache: shouldClear } = program.opts();

if (shouldClear) {
  if (port !== undefined || origin !== undefined) {
    console.error("--clear-cache cannot be combined with --port or --origin");
    process.exit(1);
  }
  try {
    await clearCache();
    console.log("Cache cleared");
  } catch (err) {
    console.error("Failed to clear cache:", err.message);
    process.exit(1);
  }
  process.exit(0);
}

const errors = [...validatePort(port), ...validateOrigin(origin)];
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

const normalizedOrigin = normalizeOrigin(origin);
const app = createProxyApp(normalizedOrigin);
const portNum = Number(port);

app.listen(portNum, () => {
  console.log(`Caching proxy listening on port ${portNum}`);
  console.log(`Forwarding to ${normalizedOrigin}`);
});
