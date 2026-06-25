const BASE_URL = "https://api.themoviedb.org/3";

const ENDPOINTS = {
  playing: "/movie/now_playing",
  popular: "/movie/popular",
  top: "/movie/top_rated",
  upcoming: "/movie/upcoming",
};

export class TmdbError extends Error {
  constructor(message) {
    super(message);
    this.name = "TmdbError";
  }
}

const normalizeMovie = (movie) => ({
  title: movie.title,
  overview: movie.overview,
  releaseDate: movie.release_date,
  rating: movie.vote_average,
});

export const fetchMovies = async ({ type, apiKey }) => {
  const path = ENDPOINTS[type];
  const params = new URLSearchParams({
    api_key: apiKey,
    language: "en-US",
  });

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}?${params}`);
  } catch (err) {
    throw new TmdbError(`Failed to fetch from TMDB API: ${err.message}`);
  }

  if (res.status === 401) {
    throw new TmdbError("Invalid TMDB API key.");
  }
  if (!res.ok) {
    throw new TmdbError(`TMDB API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return (data.results ?? []).map(normalizeMovie);
};
