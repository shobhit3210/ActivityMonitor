const { OpenAI } = require('openai');
const { openai: openaiConfig } = require('../config/config');

const openai = openaiConfig.apiKey ? new OpenAI({ apiKey: openaiConfig.apiKey }) : null;

async function generateResponse(name, jiraIssues, commits, prs) {
  if (!openai) {
    return fallbackResponse(name, jiraIssues, commits, prs);
  }

  const prompt = `
You are a friendly engineering manager. Summarize what ${name} has been working on recently.
Be conversational, concise, and positive.

JIRA Issues (active):
${jiraIssues.map(i => `- ${i.key}: ${i.summary} (${i.status})`).join('\n') || 'None'}

Recent GitHub Commits (last ~2 weeks):
${commits.map(c => `- ${c.repo}: ${c.message}`).join('\n') || 'None'}

Open Pull Requests:
${prs.map(p => `- ${p.repo}: ${p.title} (${p.state})`).join('\n') || 'None'}

If there is no activity, say something polite.
`;

  try {
    const completion = await openai.chat.completions.create({
      // model: 'gpt-3.5-turbo',
      model: 'gpt-4.1',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
    });
    return completion.choices[0].message.content.trim();
  } catch (err) {
    console.error('OpenAI failed, using fallback:', err.message);
    return fallbackResponse(name, jiraIssues, commits, prs);
  }
}

function fallbackResponse(name, jiraIssues, commits, prs) {
  let parts = [`Here's what I found for **${name}**:\n`];

  if (jiraIssues.length > 0) {
    parts.push(`**Active JIRA tickets:**`);
    jiraIssues.forEach(i => parts.push(`• [${i.key}] ${i.summary} – ${i.status}`));
  } else {
    parts.push(`No active JIRA tickets found.`);
  }

  if (commits.length > 0) {
    parts.push(`\n**Recent commits:**`);
    commits.slice(0, 5).forEach(c => parts.push(`• ${c.repo}: ${c.message}`));
  }

  if (prs.length > 0) {
    parts.push(`\n**Open pull requests:**`);
    prs.forEach(p => parts.push(`• ${p.repo}: ${p.title}`));
  }

  if (commits.length === 0 && prs.length === 0 && jiraIssues.length === 0) {
    parts.push(`\nLooks like ${name.split(' ')[0]} has been pretty quiet recently or might be on vacation!`);
  }

  return parts.join('\n');
}

module.exports = { generateResponse };