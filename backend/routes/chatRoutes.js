const express = require("express");
const router = express.Router();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args)); // for Node <18
require("dotenv").config();

// POST /api/chat
router.post("/chat", async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid message format" });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:5173", // your site url
        "X-Title": "My React Chatbot App",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "qwen/qwen3-0.6b-04-28:free",
        messages: messages
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", errorText);
      return res.status(500).json({ error: "Failed to fetch from OpenRouter" });
    }

    const data = await response.json();
    res.json({ choices: data.choices });


  } catch (error) {
    console.error("Error calling OpenRouter API:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
