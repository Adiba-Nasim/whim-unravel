const ANILIST_ENDPOINT = "https://graphql.anilist.co";

const GENRE_MAP = {
  Romance: "Romance",
  "Sci-Fi": "Sci-Fi",
  Fantasy: "Fantasy",
  Thriller: "Thriller",
  Drama: "Drama",
  Action: "Action",
  Comedy: "Comedy",
};

const MOOD_TAG_MAP = {
  melancholic: ["Tragedy", "Melancholic", "Grief"],
  tense:       ["Psychological", "Survival", "Suspense"],
  dark:        ["Dark Fantasy", "Psychological", "Gore", "Horror"],
  playful:     ["Slapstick", "Parody", "Cute", "School Life"],
  wonder:      ["Adventure", "Magic", "Supernatural"],
  chaotic:     ["Action", "Surreal", "Absurdist Comedy"],
  quiet:       ["Slice of Life", "Iyashikei", "Calming"],
  intense:     ["Action", "Suspense", "Survival"],
  dreamlike:   ["Surreal", "Magic", "Mythology"],
  cerebral:    ["Psychological", "Mystery", "Philosophical"],
  warm:        ["Found Family", "Slice of Life", "Heartwarming"],
  haunting:    ["Horror", "Psychological", "Supernatural"],
};

const VIBE_TAG_MAP = {
  quiet:       ["Slice of Life", "Iyashikei"],
  intense:     ["Action", "Suspense"],
  dreamlike:   ["Surreal", "Magic"],
  cerebral:    ["Psychological", "Mystery"],
  warm:        ["Found Family", "Heartwarming"],
  haunting:    ["Horror", "Supernatural"],
  bittersweet: ["Tragedy", "Romance"],
  nostalgic:   ["Coming of Age", "Slice of Life"],
  epic:        ["Action", "Adventure", "Military"],
  eerie:       ["Horror", "Mystery", "Supernatural"],
  introspective: ["Psychological", "Drama"],
  absurdist:   ["Comedy", "Surreal"],
};

const QUERY = `
  query ($genre: String, $type: MediaType, $perPage: Int, $page: Int) {
    Page(perPage: $perPage, page: $page) {
      media(
        type: $type,
        genre: $genre,
        sort: [SCORE_DESC, POPULARITY_DESC],
        isAdult: false,
        status_in: [FINISHED, RELEASING]
      ) {
        id
        title { english romaji }
        description(asHtml: false)
        genres
        tags { name rank }
        coverImage { extraLarge large }
        averageScore
        popularity
        episodes
        chapters
        startDate { year }
        format
        countryOfOrigin
        staff(perPage: 3) {
          edges {
            role
            node { name { full } }
          }
        }
        characters(perPage: 3, sort: [ROLE, RELEVANCE]) {
          edges {
            role
            node { name { full } }
          }
        }
        siteUrl
      }
    }
  }
`;

export async function queryAniList({ genre, mood, vibe, medium, duration }) {
  const mediaType = medium === "Anime" ? "ANIME" : "MANGA";
  const genreParam = GENRE_MAP[genre] || genre;

  const moodTags = MOOD_TAG_MAP[mood] || [];
  const vibeTags = VIBE_TAG_MAP[vibe] || [];

  // Randomise page so we don't always get the same top result
  const page = Math.floor(Math.random() * 4) + 1;

  try {
    const res = await fetch(ANILIST_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: QUERY,
        variables: { genre: genreParam, type: mediaType, perPage: 25, page },
      }),
    });

    const data = await res.json();
    let results = data?.data?.Page?.media || [];

    if (results.length === 0) {
      // retry page 1 if random page was empty
      const retry = await fetch(ANILIST_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: QUERY,
          variables: { genre: genreParam, type: mediaType, perPage: 25, page: 1 },
        }),
      });
      const retryData = await retry.json();
      results = retryData?.data?.Page?.media || [];
    }

    if (results.length === 0) return null;

    // Duration filter
    if (duration === "short") {
      const filtered = results.filter(
        (m) => (m.episodes && m.episodes <= 26) || (m.chapters && m.chapters <= 60) || (!m.episodes && !m.chapters)
      );
      if (filtered.length > 0) results = filtered;
    }
    if (duration === "long") {
      const filtered = results.filter(
        (m) => (m.episodes && m.episodes > 26) || (m.chapters && m.chapters > 60)
      );
      if (filtered.length > 0) results = filtered;
    }

    // Score by mood and vibe tags — genre is already hard-filtered by the API query
    const scored = results.map((item) => {
      let score = 0;
      const itemTags = item.tags?.map((t) => t.name) || [];
      const itemGenres = item.genres || [];

      moodTags.forEach((t) => { if (itemTags.includes(t) || itemGenres.includes(t)) score += 3; });
      vibeTags.forEach((t) => { if (itemTags.includes(t) || itemGenres.includes(t)) score += 2; });

      // Boost webtoons for Manga medium
      if (medium === "Manga" && (item.countryOfOrigin === "KR" || item.format === "MANHWA")) score += 2;

      // Slightly penalise extremely long running titles for short preference
      if (duration === "short" && item.episodes > 50) score -= 2;

      return { ...item, _score: score };
    });

    scored.sort((a, b) => b._score - a._score);

    // Pick from top 5 randomly for variety
    const top = scored.slice(0, 5);
    const pick = top[Math.floor(Math.random() * top.length)];

    return formatAniListResult(pick, medium);
  } catch (err) {
    console.warn("AniList query failed:", err);
    return null;
  }
}

function formatAniListResult(item, medium) {
  if (!item) return null;

  const title = item.title?.english || item.title?.romaji || "Unknown Title";
  const year = item.startDate?.year || "";

  const director = item.staff?.edges?.find(
    (e) => e.role === "Director" || e.role === "Story" || e.role === "Original Creator"
  )?.node?.name?.full || null;

  const cast = item.characters?.edges
    ?.filter((e) => e.role === "MAIN")
    ?.slice(0, 3)
    ?.map((e) => e.node?.name?.full)
    ?.filter(Boolean)
    ?.join(", ") || null;

  const description = item.description
    ? item.description.replace(/<[^>]*>/g, "").replace(/\n/g, " ").trim().slice(0, 180) + "..."
    : "No description available.";

  const durationLabel = item.episodes
    ? `${item.episodes} episodes`
    : item.chapters
    ? `${item.chapters} chapters`
    : "Ongoing";

  const isWebtoon =
    item.countryOfOrigin === "KR" ||
    item.format === "MANHWA" ||
    item.format === "MANHUA";

  const formatLabel = isWebtoon
    ? "Manhwa / Webtoon"
    : item.format === "MANGA"
    ? "Manga"
    : item.format === "NOVEL"
    ? "Light Novel"
    : medium;

  return {
    title,
    year,
    type: medium,
    format: medium === "Anime" ? "Animated" : null,
    formatLabel,
    director,
    cast,
    description,
    durationLabel,
    posterUrl: item.coverImage?.extraLarge || item.coverImage?.large || null,
    genre: item.genres?.[0] || "",
    subgenre: item.genres?.[1] || "",
    siteUrl: item.siteUrl || null,
  };
}