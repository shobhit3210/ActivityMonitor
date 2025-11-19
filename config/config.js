require('dotenv').config();

module.exports = {
  jira: {
    baseUrl: process.env.JIRA_BASE_URL,
    email: process.env.JIRA_EMAIL,
    token: process.env.JIRA_API_TOKEN,
  },
  github: {
    token: process.env.GITHUB_TOKEN,
    org: process.env.GITHUB_ORG || null,
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || null,
  },
};