require('dotenv').config();

module.exports = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  AI_API_URL: process.env.AI_API_URL, // optional override
  AI_MODEL: process.env.AI_MODEL,
  AI_MAX_TOKENS: process.env.AI_MAX_TOKENS,
  AI_TIMEOUT: process.env.AI_TIMEOUT ? Number(process.env.AI_TIMEOUT) : undefined
};
