export const TYPE_LABELS = {
  playing: "Now Playing Movies",
  popular: "Popular Movies",
  top: "Top Rated Movies",
  upcoming: "Upcoming Movies",
};

export const formatMovies = (movies, type) => {
  if (!movies.length) {
    return "No movies found.";
  }

  const lines = [TYPE_LABELS[type] ?? "Movies", ""];

  movies.forEach((movie, i) => {
    const year = movie.releaseDate?.slice(0, 4) || "—";
    const overview = movie.overview?.trim() || "(no overview)";
    const release = movie.releaseDate || "—";
    const rating = movie.rating?.toFixed(1) ?? "—";

    lines.push(`${i + 1}. ${movie.title} (${year})`);
    lines.push(`   ${overview}`);
    lines.push(`   Rating: ${rating}/10  |  Release: ${release}`);
    lines.push("");
  });

  return lines.join("\n").trimEnd();
};
