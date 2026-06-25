#!/usr/bin/env node
import "dotenv/config";
import { program } from "commander";
import { formatMovies } from "./lib/format.js";
import { fetchMovies, TmdbError } from "./lib/tmdb.js";
import { validateType } from "./lib/validate.js";

const API_KEY = process.env.TMDB_API_KEY;

if (!API_KEY) {
  console.error("TMDB_API_KEY is required. Copy .env.example to .env and set your key.");
  process.exit(1);
}

program
  .name("tmdb-app")
  .description("Fetch movies from The Movie Database (TMDB)")
  .requiredOption("--type <type>", "movie list: playing, popular, top, upcoming");

program.parse();

const { type } = program.opts();

const errors = validateType(type);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

try {
  const movies = await fetchMovies({ type, apiKey: API_KEY });
  console.log(formatMovies(movies, type));
} catch (err) {
  if (err instanceof TmdbError) {
    console.error(err.message);
    process.exit(1);
  }
  throw err;
}
