const axios = require('axios');
const { jira } = require('../config/config');

const jiraAxios = axios.create({
  baseURL: jira.baseUrl,
  auth: {
    username: jira.email,
    password: jira.token,
  },
});

async function getUserAccountId(emailOrName) {
  // Try to find user by email or display name
  try {
    const response = await jiraAxios.get('/rest/api/3/user/search', {
      params: { query: emailOrName },
    });
    const user = response.data.find(u => 
      u.emailAddress?.toLowerCase().includes(emailOrName.toLowerCase()) ||
      u.displayName.toLowerCase().includes(emailOrName.toLowerCase())
    );
    return user ? user.accountId : null;
  } catch (err) {
    console.error('JIRA user search failed:', err.response?.data || err.message);
    return null;
  }
}

async function getAssignedIssues(accountId) {
  if (!accountId) return [];
  const jql = `assignee = "${accountId}" AND status not in (Done, Closed) ORDER BY updated DESC`;
  try {
    const res = await jiraAxios.get('/rest/api/3/search/jql', {
      params: { jql, fields: 'summary,status,updated,issuetype,key' , maxResults: 10 },
    });
    return res.data.issues.map(issue => ({
      key: issue.key,
      summary: issue.fields.summary,
      status: issue.fields.status.name,
      type: issue.fields.issuetype.name,
      url: `${jira.baseUrl}/browse/${issue.key}`,
    }));
  } catch (err) {
    console.error('JIRA issues fetch error:', err.response?.data || err.message);
    return [];
  }
}

module.exports = { getUserAccountId, getAssignedIssues };