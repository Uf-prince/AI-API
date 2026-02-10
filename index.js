import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// 👉 YAHAN APNA NAYA TOKEN DALO
const HF_TOKEN = "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";

app.get("/", (req, res) => {
  res.send("✅ Free HuggingFace AI running!");
});

app.get("/api/ask", async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.json({ error: "Missing question" });

    const response = await fetch(
      "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: q }),
      }
    );

    const data = await response.json();

    let reply =
      data?.generated_text ||
      data?.[0]?.generated_text ||
      "No response";

    res.json({ reply });

  } catch (err) {
    console.log(err);
    res.json({ error: "Server error" });
  }
});

app.listen(PORT, () =>
  console.log(`🚀 HuggingFace bot running on port ${PORT}`)
);
