import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY missing");
  process.exit(1);
}

// ✅ Default route
app.get("/", (req, res) => {
  res.send("✅ GPT-5 AI Server running!");
});

// ✅ Ask GPT-5 route
app.get("/api/ask", async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.status(400).json({ error: "Missing question" });

    const aiResponse = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-5",
          input: q,
        }),
      }
    );

    const data = await aiResponse.json();

    if (!aiResponse.ok || data.error) {
      return res.status(500).json({
        error: data.error?.message || "AI request failed",
      });
    }

    const answer =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text ||
      "No response";

    res.json({
      success: true,
      question: q,
      reply: answer,
    });
  } catch (err) {
    console.error("🔥 Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () =>
  console.log(`🚀 GPT-5 Server running on port ${PORT}`)
);
