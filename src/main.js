require('dotenv').config();
const express = require('express');
const path = require('path');
const { getTeamMemberActivity } = require('../src/activity-service');

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Simple health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Main query endpoint
app.post('/api/ask', async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: 'Question required' });

  try {
    const answer = await getTeamMemberActivity(question);
    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ answer: 'Sorry, something unexpected happened. Please try again later.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});