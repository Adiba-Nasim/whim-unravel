// ─── TMDB API ────────────────────────────────────────────────────────────────
// Used for Movies and TV Series only
// Anime, Manga, Books handled by their own fetchers

const TMDB_BEARER = process.env.REACT_APP_TMDB_BEARER;
const TMDB_BASE = "https://api.themoviedb.org/3";

const TMDB_GENRE_IDS = {
  Romance:  10749,
  "Sci-Fi": 878,
  Fantasy:  14,
  Thriller: 53,
  Drama:    18,
  Action:   28,
  Comedy:   35,
  Horror:   27,
  Mystery:  9648,
  Animation: 16,
};

export async function queryTMDB({ genre, mood, vibe, medium, format, duration }) {
  const headers = { Authorization: `Bearer ${TMDB_BEARER}` };
  const isMovie = medium === "Movie";
  const isSeries = medium === "Series";
  const isEither = medium === "Either";
  const animationId = TMDB_GENRE_IDS["Animation"];
  const genreId = TMDB_GENRE_IDS[genre];

  const params = new URLSearchParams({
    sort_by: "vote_average.desc",
    "vote_count.gte": "100",
    "vote_average.gte": "6.5",
    page: Math.floor(Math.random() * 5) + 1,
  });

  if (genreId) {
    if (format === "Animated") {
      params.set("with_genres", `${genreId},${animationId}`);
    } else if (format === "Live Action") {
      params.set("with_genres", genreId);
      params.set("without_genres", animationId);
    } else {
      params.set("with_genres", genreId);
    }
  }

  if (isMovie || isEither) {
    if (duration === "short") params.set("with_runtime.lte", "130");
    if (duration === "long") params.set("with_runtime.gte", "130");
  }

  const type = isSeries ? "tv" : "movie";
  const endpoint = `${TMDB_BASE}/discover/${type}?${params}`;

  try {
    const res = await fetch(endpoint, { headers });
    const data = await res.json();
    const results = data?.results || [];
    if (results.length === 0) return null;

    const pool = results.slice(0, 10);
    const item = pool[Math.floor(Math.random() * pool.length)];
    return await fetchTMDBDetails(item.id, type, headers);
  } catch (err) {
    console.warn("TMDB query failed:", err);
    return null;
  }
}

async function fetchTMDBDetails(id, type, headers) {
  try {
    const [detailsRes, creditsRes] = await Promise.all([
      fetch(`${TMDB_BASE}/${type}/${id}?language=en-US`, { headers }),
      fetch(`${TMDB_BASE}/${type}/${id}/credits?language=en-US`, { headers }),
    ]);

    const details = await detailsRes.json();
    const credits = await creditsRes.json();

    const title = details.title || details.name || "Unknown Title";
    const year = (details.release_date || details.first_air_date || "").slice(0, 4);

    const director =
      type === "movie"
        ? credits.crew?.find((c) => c.job === "Director")?.name || null
        : details.created_by?.map((c) => c.name)?.join(", ") || null;

    const cast = credits.cast?.slice(0, 3)?.map((c) => c.name)?.join(", ") || null;

    const posterUrl = details.poster_path
      ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
      : null;

    const description =
      (details.overview?.slice(0, 160) + (details.overview?.length > 160 ? "..." : "")) ||
      "No description available.";

    const runtime =
      type === "movie"
        ? details.runtime ? `${details.runtime} minutes` : null
        : details.number_of_seasons
        ? `${details.number_of_seasons} season${details.number_of_seasons > 1 ? "s" : ""}`
        : null;

    return {
      title,
      year,
      type: type === "movie" ? "Movie" : "Series",
      format: details.genres?.some((g) => g.id === 16) ? "Animated" : "Live Action",
      formatLabel: type === "movie" ? "Feature Film" : "Television Series",
      director,
      cast,
      description,
      durationLabel: runtime,
      posterUrl,
      genre: details.genres?.[0]?.name || "",
      subgenre: details.genres?.[1]?.name || "",
      siteUrl: `https://www.themoviedb.org/${type}/${id}`,
    };
  } catch (err) {
    console.warn("TMDB details fetch failed:", err);
    return null;
  }
}