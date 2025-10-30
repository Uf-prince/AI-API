import express from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("AI Server is running! UMAR");
});

// GET request endpoint for browser
app.get("/api/ask", async (req, res) => {
  const question = req.query.q;
  if (!question) return res.status(400).json({ error: "Query parameter 'q' is required." });

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: question }],
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ answer: response.data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

app.listen(port, () => {
  console.log(`AI Server running at http://localhost:${port}`);
});
