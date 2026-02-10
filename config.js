import dotenv from "dotenv";
dotenv.config();

export default {
  HF_TOKEN: process.env.HF_TOKEN,
  HF_MODEL:
    process.env.HF_MODEL || "facebook/blenderbot-400M-distill",
  AI_TIMEOUT: process.env.AI_TIMEOUT
    ? Number(process.env.AI_TIMEOUT)
    : 30000,
};
