import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { marked } from 'marked';

// After getting the review string
const markdownHtml = marked(review); // Converts markdown to HTML
res.json({ review: markdownHtml, raw: review });

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Basic rate limiter: max 30 requests per 15 min per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: 'Too many requests, please try again later.' },
});

app.use(limiter);

// Helper function to get full review with continuation logic
async function getFullReview(prompt) {
  const messages = [{ role: 'user', content: prompt }];
  let fullReview = '';
  let truncated = false;

  do {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 2000,
        temperature: 0.5,
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    const part = data.choices[0].message.content;
    const finishReason = data.choices[0].finish_reason;

    fullReview += part;
    messages.push({ role: 'assistant', content: part });

    truncated = finishReason !== 'stop';
    if (truncated) {
      messages.push({ role: 'user', content: 'Continue.' });
    }
  } while (truncated);

  return fullReview;
}

app.post('/api/review', async (req, res) => {
  const { code, language } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Code is required' });
  }

  const truncatedCode = code.length > 3000 ? code.slice(0, 3000) : code;

  const prompt = `You are a helpful code reviewer. Review the following ${language} code and suggest improvements, point out bugs or bad practices. Provide a clear and concise explanation.\n\nCode:\n${truncatedCode}`;

  try {
    const review = await getFullReview(prompt);
    res.json({ review });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Something went wrong' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
