const express = require("express");
const fetch = require("node-fetch");
const config = require("./config");

const app = express();
const PORT = process.env.PORT || 3000;

// startup check
if (!config.HF_TOKEN) {
  console.error("❌ HF_TOKEN missing in environment variables");
}

app.get("/", (req, res) => {
  res.send("✅ HuggingFace AI server running!");
});

app.get("/api/ask", async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.json({ error: "Missing question" });

    const response = await fetch(
      `https://api-inference.huggingface.co/models/${config.HF_MODEL}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: q }),
        timeout: config.AI_TIMEOUT,
      }
    );

    const data = await response.json();

    let reply =
      data?.generated_text ||
      data?.[0]?.generated_text ||
      "No response";

    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.json({ error: "Server error" });
  }
});

app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
