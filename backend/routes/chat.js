const express = require('express');
const axios = require('axios');
require('dotenv').config();

// Create a router instead of an app
const router = express.Router();

// Middleware to validate user messages
const validateMessage = (req, res, next) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  next();
};

// Apply the validation middleware to the chatbot route
router.post('/', validateMessage, async (req, res) => {
  const { message } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'Missing OpenAI API key' });
  }

  try {
    const openAiResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo', // or 'gpt-4' depending on the model you want
        messages: [
          { role: 'system', content: 'You are a helpful travel assistant.' },
          { role: 'user', content: message },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({ reply: openAiResponse.data.choices[0]?.message?.content });
  } catch (error) {
    console.error(
      'Chatbot Error:',
      error.response ? error.response.data : error.message
    );
    res.status(error.response?.status || 500).json({
      error: 'Failed to get response from AI.',
      details: error.response?.data || error.message,
    });
  }
});

// Export the router
module.exports = router;
