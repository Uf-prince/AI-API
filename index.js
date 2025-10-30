import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // apni key env me rakho

// ✅ Default route
app.get("/", (req, res) => {
  res.send("✅ AI Server is running successfully!");
});

// ✅ /api/ask route
app.get("/api/ask", async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.status(400).json({ error: "Missing 'q' parameter" });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // ⚡ free/light model
        messages: [{ role: "user", content: q }]
      })
    });

    const data = await response.json();
    if (data.error) return res.status(400).json({ error: data.error });

    const answer = data.choices?.[0]?.message?.content || "No response from AI";
    res.json({ reply: answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
