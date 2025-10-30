import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// ✅ Root check route
app.get("/", (req, res) => {
  res.send("✅ AI Server is running!");
});

// ✅ AI endpoint
app.post("/api/ask", async (req, res) => {
  const prompt = req.body.prompt || req.query.q;
  if (!prompt) return res.status(400).json({ error: "Prompt missing" });

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: process.env.AI_MODEL || "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      success: true,
      reply: response.data.choices[0].message.content,
    });
  } catch (error) {
    console.error("Error from OpenAI:", error.response?.data || error.message);
    res.status(500).json({
      error: error.response?.data || "Internal Server Error",
    });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
