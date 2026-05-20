export const QUESTIONS = [
  {
    id: "mood",
    text: "Before we begin... tell me. What state is your soul in right now?",
    choices: [
      { label: "Melancholic. Something aches.", value: "melancholic" },
      { label: "Tense. I need the edge of my seat.", value: "tense" },
      { label: "Dark. Give me the abyss.", value: "dark" },
      { label: "Playful. Light, alive, warm.", value: "playful" },
      { label: "Full of wonder. Show me something extraordinary.", value: "wonder" },
      { label: "Chaotic. Nothing makes sense right now.", value: "chaotic" },
    ],
  },
  {
    id: "genre",
    text: "What world do you wish to step into?",
    choices: [
      { label: "Romance. Hearts and longing.", value: "Romance" },
      { label: "Sci-Fi. The impossible made real.", value: "Sci-Fi" },
      { label: "Fantasy. Magic and myth.", value: "Fantasy" },
      { label: "Thriller. Dread and consequence.", value: "Thriller" },
      { label: "Drama. Raw human truth.", value: "Drama" },
      { label: "Action. Blood, sweat, and motion.", value: "Action" },
      { label: "Comedy. Laughter that stings.", value: "Comedy" },
    ],
  },
  {
    id: "vibe",
    text: "How should it feel when you consume it?",
    choices: [
      { label: "Quiet and slow. Like rain on a window.", value: "quiet" },
      { label: "Intense. Every second matters.", value: "intense" },
      { label: "Dreamlike. Reality bending at the edges.", value: "dreamlike" },
      { label: "Cerebral. Make me think for days.", value: "cerebral" },
      { label: "Warm. Like something that cares for me.", value: "warm" },
      { label: "Haunting. I want it to follow me.", value: "haunting" },
    ],
  },
  {
    id: "type",
    text: "How do you wish to receive it?",
    choices: [
      { label: "Watch it. I want motion and sound.", value: "watch" },
      { label: "Read it. I want words and silence.", value: "read" },
    ],
  },

  // ── WATCH BRANCH ──────────────────────────────────────────────────────────
  {
    id: "format",
    text: "Animated or live action?",
    showIf: (answers) => answers.type === "watch",
    choices: [
      { label: "Animated. Drawn worlds.", value: "Animated" },
      { label: "Live action. Real faces.", value: "Live Action" },
      { label: "Either. I do not mind.", value: "Either" },
    ],
  },
  {
    id: "medium",
    text: "A film or a series?",
    showIf: (answers) => answers.type === "watch",
    choices: [
      { label: "A film. One sitting, complete.", value: "Movie" },
      { label: "A series. Give me episodes to devour.", value: "Series" },
   { label: "Either. Surprise me.", value: "Either" },
    ],

  },

  // ── READ BRANCH ───────────────────────────────────────────────────────────
  {
    id: "medium",
    text: "What vessel should carry the story?",
    showIf: (answers) => answers.type === "read",
    choices: [
      { label: "A book. Pages and imagination.", value: "Book" },
      { label: "Manga or Webtoon. Panels and art.", value: "Manga" },
    ],
  },

  {
    id: "duration",
    text: "And how much time will you give it?",
    choices: [
      { label: "Something contained. One night.", value: "short" },
      { label: "Something vast. I want to live in it.", value: "long" },
      { label: "Surprise me.", value: "any" },
    ],
  },
];