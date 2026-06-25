export const formatRepos = (repos, duration, limit) => {
  if (!repos.length) {
    return "No repositories found.";
  }

  const lines = [`GitHub Trending Repositories (${duration}, top ${limit})`, ""];

  repos.forEach((repo, i) => {
    const desc = repo.description?.trim() || "(no description)";
    const lang = repo.language || "—";
    lines.push(`${i + 1}. ${repo.fullName}`);
    lines.push(`   ${desc}`);
    lines.push(`   Stars: ${repo.stars.toLocaleString()}  |  Language: ${lang}`);
    lines.push("");
  });

  return lines.join("\n").trimEnd();
};
