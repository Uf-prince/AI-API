const express = require("express");
const axios = require("axios");
const config = require("./config");

const app = express();
app.use(express.json());

// Simple health
app.get('/', (req, res) => res.send('✅ AI API running. Use POST /api/ask'));

// Main endpoint for bot
app.post('/api/ask', async (req, res) => {
  const prompt = (req.body && req.body.prompt) || '';
  if (!prompt) return res.status(400).json({ success: false, error: 'prompt is required in JSON body' });

  try {
    const response = await axios.post(
      (config.AI_API_URL || 'https://api.openai.com/v1/chat/completions'),
      {
        model: config.AI_MODEL || 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: config.AI_MAX_TOKENS || 500
      },
      {
        headers: {
          Authorization: `Bearer ${config.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: config.AI_TIMEOUT || 15000
      }
    );

    const reply = response.data?.choices?.[0]?.message?.content || response.data?.choices?.[0]?.text || JSON.stringify(response.data).slice(0,200);
    res.json({ success: true, reply });
  } catch (err) {
    console.error('OpenAI Error:', err && err.toString());
    const message = err.response?.data?.error?.message || err.message || 'Unknown error';
    res.status(500).json({ success: false, error: message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
