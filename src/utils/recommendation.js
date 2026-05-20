import { queryTMDB } from "./fetchPoster";
import { queryAniList } from "./fetchAniList";
import { queryOpenLibrary } from "./fetchBooks";

export async function getRecommendation(answers) {
  const { medium, type, genre, mood, vibe, format, duration } = answers;
  let result = null;

  if (type === "watch" && (medium === "Movie" || medium === "Series" || medium === "Either")) {
    result = await queryTMDB({ genre, mood, vibe, medium, format, duration });
  }
  if (type === "watch" && medium === "Anime") {
    result = await queryAniList({ genre, mood, vibe, medium: "Anime", duration });
  }
  if (type === "read" && medium === "Book") {
    result = await queryOpenLibrary({ genre, mood, vibe, duration });
  }
  if (type === "read" && medium === "Manga") {
    result = await queryAniList({ genre, mood, vibe, medium: "Manga", duration });
  }

  if (!result) result = getFallback(answers);
  return result;
}

function getFallback(answers) {
  const fallbacks = {
    Movie: { title: "Eternal Sunshine of the Spotless Mind", year: 2004, type: "Movie", format: "Live Action", formatLabel: "Feature Film", director: "Michel Gondry", cast: "Jim Carrey, Kate Winslet", description: "A couple erases each other from their memories, only to fall in love again.", durationLabel: "108 minutes", posterUrl: null, genre: "Romance", subgenre: "Sci-Fi" },
    Series: { title: "Dark", year: 2017, type: "Series", format: "Live Action", formatLabel: "Television Series", director: "Baran bo Odar", cast: "Louis Hofmann, Lisa Vicari", description: "Four families in a German town unravel a conspiracy spanning centuries.", durationLabel: "3 seasons", posterUrl: null, genre: "Sci-Fi", subgenre: "Mystery" },
    Anime: { title: "Violet Evergarden", year: 2018, type: "Anime", format: "Animated", formatLabel: "Anime Series", director: "Taichi Ishidate", cast: "Yui Ishikawa, Daisuke Namikawa", description: "A former child soldier learns to express human emotion by writing letters for others.", durationLabel: "13 episodes", posterUrl: null, genre: "Drama", subgenre: "Slice of Life" },
    Book: { title: "The Night Circus", year: 2011, type: "Book", format: null, formatLabel: "Novel", director: "Erin Morgenstern", cast: null, description: "Two rival magicians fall in love inside a mysterious circus that only appears at night.", durationLabel: null, posterUrl: null, genre: "Fantasy", subgenre: "Romance" },
    Manga: { title: "Berserk", year: 1989, type: "Manga", format: null, formatLabel: "Manga", director: "Kentaro Miura", cast: null, description: "A lone swordsman battles demons while haunted by the memory of a devastating betrayal.", durationLabel: null, posterUrl: null, genre: "Action", subgenre: "Dark Fantasy" },
  };
  return fallbacks[answers.medium] || fallbacks.Movie;
}