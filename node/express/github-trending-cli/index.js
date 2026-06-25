#!/usr/bin/env node
import { program } from "commander";
import { fetchTrending, GitHubError } from "./lib/github.js";
import { formatRepos } from "./lib/format.js";
import { validateDuration, validateLimit } from "./lib/validate.js";

program
  .name("trending-repos")
  .description("Show trending GitHub repositories")
  .option("--duration <duration>", "time range: day, week, month, year", "week")
  .option("--limit <number>", "number of repositories to display", "10");

program.parse();

const { duration, limit } = program.opts();

const errors = [...validateDuration(duration), ...validateLimit(limit)];
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

const limitNum = Number(limit);

try {
  const repos = await fetchTrending({
    duration,
    limit: limitNum,
    token: process.env.GITHUB_TOKEN,
  });
  console.log(formatRepos(repos, duration, limitNum));
} catch (err) {
  if (err instanceof GitHubError) {
    console.error(err.message);
    process.exit(1);
  }
  throw err;
}
