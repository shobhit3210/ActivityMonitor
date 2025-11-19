// function extractName(question) {
//   const lower = question.toLowerCase();
//   const triggers = ['what is', 'show me', 'what has', 'tell me about', 'activity for', `what's`];
//   let cleaned = question;
//   for (const t of triggers) {
//     cleaned = cleaned.replace(new RegExp(t, 'gi'), '').trim();
//   }

//   // Remove common suffixes
//   cleaned = cleaned.replace(/working on.*/i, '')
//                    .replace(/recent activity.*/i, '')
//                    .replace(/this week.*/i, '')
//                    .replace(/\?$/, '')
//                    .trim();

//   // Assume the remaining is the name (supports first name or full name)
//   return cleaned.trim() || null;
// }

function extractName(question) {
  if (!question || typeof question !== 'string') {
    return null;
  }

  const lower = question.toLowerCase();
  
  // Trigger phrases to remove
  const triggers = ['what is', 'show me', 'what has', 'tell me about', 'activity for', `what's`, 'show me', 'who is'];
  
  let cleaned = lower;
  
  // Remove trigger phrases (case-insensitive)
  for (const t of triggers) {
    cleaned = cleaned.replace(new RegExp(`\\b${t}\\b`, 'gi'), '').trim();
  }

  // Remove common suffixes and extra words
  cleaned = cleaned.replace(/\b(working on|recent activity|this week|last week|today|yesterday).*$/i, '')
                   .replace(/\?$/, '')
                   .replace(/\b(in|on|at|for|by)\b/gi, '') // Remove prepositions
                   .replace(/\s+/g, ' ') // Normalize spaces
                   .trim();

  // Filter out common non-names
  const excludeWords = ['status', 'update', 'progress', 'report', 'tasks', 'work'];
  const words = cleaned.split(/\s+/);
  const filtered = words.filter(w => !excludeWords.includes(w.toLowerCase()));

  const result = filtered.join(' ').trim();
  
  return result || null;
}

module.exports = { extractName };