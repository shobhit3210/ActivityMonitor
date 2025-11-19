const { extractName } = require('./query-parser');
const { getUserAccountId, getAssignedIssues } = require('./jira-client');
const { getRecentCommits, getUserPullRequests } = require('./github-client');
const { generateResponse } = require('./response-generator');

async function getTeamMemberActivity(question) {
  const name = extractName(question);
  if (!name) return "I couldn't figure out who you're asking about. Try: 'What is John working on?'";

  // Try to map name → GitHub username (simple heuristic: lowercase, no spaces)
  const ghUsername = name.toLowerCase().replace(/\s+/g, '').trim();

  // Parallel fetches
  const [jiraAccountId, commits, prs] = await Promise.all([
    getUserAccountId(name),
    getRecentCommits(ghUsername),
    getUserPullRequests(ghUsername),
  ]);

  const issues = await getAssignedIssues(jiraAccountId);

  return await generateResponse(name, issues, commits, prs);
}

module.exports = { getTeamMemberActivity };