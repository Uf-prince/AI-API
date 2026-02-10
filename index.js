import express from "express";
import fetch from "node-fetch";
import config from "./config.js";

const app = express();
const PORT = process.env.PORT || 3000;

if (!config.HF_TOKEN) {
  console.error("❌ HF_TOKEN missing");
}

app.get("/", (req, res) => {
  res.send("✅ HuggingFace AI running!");
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

  let reply = "No response";

if (Array.isArray(data) && data[0]?.generated_text) {
  reply = data[0].generated_text;
} else if (data?.generated_text) {
  reply = data.generated_text;
} else if (data?.error) {
  reply = "HF error: " + data.error;
}

console.log("HF RAW:", data);
    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.json({ error: "Server error" });
  }
});

app.listen(PORT, () =>
  console.log(`🚀 Server running on ${PORT}`)
);
