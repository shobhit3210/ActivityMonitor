const axios = require('axios');
const { github } = require('../config/config');

const gh = axios.create({
  baseURL: 'https://api.github.com',
  headers: { Authorization: `token ${github.token}` },
});

async function getRecentCommits(username, days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);
  try {
    const res = await gh.get('/search/commits', {
      params: {
        q: `author:${username} author-date:>${since.toISOString().split('T')[0]}`,
        sort: 'author-date',
        order: 'desc',
        per_page: 10,
      },
      headers: { Accept: 'application/vnd.github.v3+json' },
    });
    return res.data.items.map(c => ({
      repo: c.repository.full_name,
      message: c.commit.message.split('\n')[0],
      date: c.commit.author.date,
      url: c.html_url,
    }));
  } catch (err) {
    console.error('GitHub commits error:', err.response?.data || err.message);
    return [];
  }
}

async function getUserPullRequests(username) {
  try {
    const res = await gh.get('/search/issues', {
      params: {
        q: `is:pr author:${username} -is:draft`,
        per_page: 10,
      },
    });
    return res.data.items.map(pr => ({
      title: pr.title,
      repo: pr.repository_url.split('/repos/')[1],
      state: pr.state,
      url: pr.html_url,
      created: pr.created_at,
    }));
  } catch (err) {
    console.error('GitHub PRs error:', err.response?.data || err.message);
    return [];
  }
}

module.exports = { getRecentCommits, getUserPullRequests };