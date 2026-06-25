const SEARCH_URL = "https://api.github.com/search/repositories";

export class GitHubError extends Error {
  constructor(message) {
    super(message);
    this.name = "GitHubError";
  }
}

export const durationToDate = (duration) => {
  const date = new Date();
  switch (duration) {
    case "day":
      date.setUTCDate(date.getUTCDate() - 1);
      break;
    case "week":
      date.setUTCDate(date.getUTCDate() - 7);
      break;
    case "month":
      date.setUTCMonth(date.getUTCMonth() - 1);
      break;
    case "year":
      date.setUTCFullYear(date.getUTCFullYear() - 1);
      break;
    default:
      throw new GitHubError(`Unknown duration: ${duration}`);
  }
  return date.toISOString().slice(0, 10);
};

const normalizeRepo = (repo) => ({
  fullName: repo.full_name,
  description: repo.description,
  stars: repo.stargazers_count,
  language: repo.language,
});

export const fetchTrending = async ({ duration, limit, token }) => {
  const since = durationToDate(duration);
  const perPage = Math.min(limit, 100);
  const params = new URLSearchParams({
    q: `created:>${since}`,
    sort: "stars",
    order: "desc",
    per_page: String(perPage),
  });

  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "github-trending-cli",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${SEARCH_URL}?${params}`, { headers });
  } catch (err) {
    throw new GitHubError(`Failed to fetch from GitHub API: ${err.message}`);
  }

  if (res.status === 403) {
    throw new GitHubError("GitHub API rate limit exceeded. Set GITHUB_TOKEN env var.");
  }
  if (res.status === 422) {
    throw new GitHubError("Invalid search query.");
  }
  if (!res.ok) {
    throw new GitHubError(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.items
    .map(normalizeRepo)
    .sort((a, b) => b.stars - a.stars)
    .slice(0, limit);
};
