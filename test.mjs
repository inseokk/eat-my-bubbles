/* IMPORT ENVIORNMENT VARIABLES (for API KEYS) */
import dotenv from 'dotenv';
dotenv.config();

/* IMPORT OPENAI GPT API */
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const response = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [
    {
      "role": "system",
      "content": [
        {
          "type": "text",
          "text": "You are a helpful assistant for a PDF editor app named Verca. Your responses are as helpful and education while not violating any academic dishonesty. Be extra friendly; ask if any more information can be given. At the end of every response, say \"Eat my bubbles!\""
        }
      ]
    }
  ],
  response_format: {
    "type": "text"
  },
  temperature: 1,
  max_completion_tokens: 5000,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0
});

console.dir(response, {depth: null});