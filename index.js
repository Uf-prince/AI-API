import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ✅ Base route check
app.get("/", (req, res) => {
  res.send("🚀 AI Server is running successfully!");
});

// ✅ AI route
app.post("/api/ask", async (req, res) => {
  try {
    const prompt = req.body.prompt || req.query.q;
    if (!prompt) return res.status(400).json({ error: "Missing 'prompt' parameter" });

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini", // ✅ Free-tier friendly model
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ reply: response.data.choices[0].message.content });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
