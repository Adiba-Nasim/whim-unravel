const GEMINI_KEY = process.env.REACT_APP_GEMINI_KEY;

export async function fetchOracleDialogue(answers, recommendation) {
  const prompt = `You are The Oracle — a mysterious, literary, slightly poetic voice who recommends media.
You have just matched someone to "${recommendation.title}" (${recommendation.year}).

Their answers:
- Soul state / mood: ${answers.mood}
- Genre desired: ${answers.genre}
- Vibe wanted: ${answers.vibe}
- Format: ${answers.type === "watch" ? "watching" : "reading"} / ${answers.medium}
- Duration preference: ${answers.duration}

Write 3-4 sentences as The Oracle. Do two things:
1. Briefly tease what the person is about to step into — the world, the feeling, what awaits them. Make it atmospheric and enticing, like a trailer in words.
2. In one sentence explain why their answers led here — personal, direct, soulful.

Do NOT use emojis. Do NOT use generic phrases like "I think you'll enjoy" or "you might like".
Do NOT give away plot twists or endings. Keep it under 90 words. No quotation marks needed.`;

  const fetchWithRetry = async (retries = 3, delay = 2000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_KEY}`
          ,{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { maxOutputTokens: 200, temperature: 0.9 },
            }),
          }
        );

        if (res.status === 429) {
          console.warn(`Gemini 429 — retrying in ${delay}ms (attempt ${i + 1})`);
          await new Promise((r) => setTimeout(r, delay));
          delay *= 2;
          continue;
        }

        const data = await res.json();
        return (
          data.candidates?.[0]?.content?.parts?.[0]?.text ||
          "The stars have aligned. This is your story."
        );
      } catch (err) {
        console.warn("Oracle fetch error:", err);
        if (i === retries - 1) return "The stars have aligned. This is your story.";
        await new Promise((r) => setTimeout(r, delay));
        delay *= 2;
      }
    }
    return "The stars have aligned. This is your story.";
  };

  return await fetchWithRetry();
}