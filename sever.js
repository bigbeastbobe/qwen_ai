const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Qwen API Configuration
const QWEN_API_KEY = process.env.QWEN_API_KEY || 'sk-0493b1dcb5a04b41b5fe5b0e55fba100';
const QWEN_API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'Qwen API Proxy is running!' });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await fetch(QWEN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${QWEN_API_KEY}`,
        'X-DashScope-SSE': 'disable'
      },
      body: JSON.stringify({
        model: 'qwen-turbo',
        input: { messages },
        parameters: { result_format: 'message' }
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to connect to Qwen API' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});