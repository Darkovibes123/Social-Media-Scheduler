// Uses Google Gemini's free-tier API
// Docs: https://ai.google.dev/gemini-api/docs

const GEMINI_MODEL = "gemini-3.6-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// @route POST /api/ai/generate-caption
// body: { theme: "pageant evening gown look" }
exports.generateCaption = async (req, res) => {
  try {
    const { theme } = req.body;

    if (!theme || theme.trim().length === 0) {
      return res.status(400).json({ message: "Please provide a theme or keyword." });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: "Server is missing GEMINI_API_KEY." });
    }

    const prompt = `You are a social media assistant for a student influencer.
Generate exactly 3 short, engaging Instagram/TikTok captions for a post about: ${theme}.
For each caption, also provide 5-8 relevant hashtags.
Respond ONLY in valid JSON, with no extra text, no markdown fences, in this exact format:
[
  { "caption": "caption text here", "hashtags": "#tag1 #tag2 #tag3" },
  { "caption": "caption text here", "hashtags": "#tag1 #tag2 #tag3" },
  { "caption": "caption text here", "hashtags": "#tag1 #tag2 #tag3" }
]`;

    const response = await fetch(`${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.9 },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(502).json({
        message: "Gemini API error. Check your GEMINI_API_KEY and try again.",
        error: data?.error?.message || "Unknown error",
      });
    }

    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();

    let options;
    try {
      options = JSON.parse(cleaned);
    } catch (parseErr) {
      return res.status(502).json({
        message: "AI returned an unexpected format. Please try again.",
      });
    }

    res.json({ theme, options });
  } catch (err) {
    res.status(500).json({
      message: "Error generating captions from AI service",
      error: err.message,
    });
  }
};