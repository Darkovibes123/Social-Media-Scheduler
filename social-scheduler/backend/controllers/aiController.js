// Uses Groq Cloud's API (OpenAI-compatible format) // Docs: https://console.groq.com/docs/quickstart
const GROQ_MODEL = "llama-3.3-70b-versatile"; const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
// @route POST /api/ai/generate-caption // body: { theme: "pageant evening gown look" } exports.generateCaption = async (req, res) => { try { const { theme } = req.body;
if (!theme || theme.trim().length === 0) {
  return res.status(400).json({ message: "Please provide a theme or keyword." });
}

if (!process.env.GROQ_API_KEY) {
  return res.status(500).json({ message: "Server is missing GROQ_API_KEY." });
}

const prompt = `You are a social media assistant for a student influencer.
Generate exactly 3 short, engaging Instagram/TikTok captions for a post about: ${theme}. For each caption, also provide 5-8 relevant hashtags. Respond ONLY in valid JSON, with no extra text, no markdown fences, in this exact format: [ { "caption": "caption text here", "hashtags": "#tag1 #tag2 #tag3" }, { "caption": "caption text here", "hashtags": "#tag1 #tag2 #tag3" }, { "caption": "caption text here", "hashtags": "#tag1 #tag2 #tag3" } ]`;
const response = await fetch(GROQ_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
  },
  body: JSON.stringify({
    model: GROQ_MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.9,
  }),
});

const data = await response.json();

if (!response.ok) {
  return res.status(502).json({
    message: "Groq API error. Check your GROQ_API_KEY and try again.",
    error: data?.error?.message || "Unknown error",
  });
}

const raw = data?.choices?.[0]?.message?.content;
const cleaned = raw.replace(/```json/g, "").replace(/```/g, "");

let options;
try {
  options = JSON.parse(cleaned);
} catch (parseErr) {
  return res.status(502).json({
    message: "AI returned an unexpected format. Please try again.",
  });
}

res.json({ theme, options });
} catch (err) { res.status(500).json({ message: "Error generating captions from AI service", error: err.message, }); } };