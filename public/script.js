const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

function addMessage(text, type) {
  const div = document.createElement('div');
  div.className = `message ${type}`;
  div.innerHTML = text.replace(/\n/g, '<br>');
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!input.value.trim()) return;

  addMessage(input.value, 'user');
  const question = input.value;
  input.value = '';

  addMessage('Thinking...', 'bot');

  try {
    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
    const data = await res.json();
    // Replace last "Thinking..." with real answer
    messages.lastElementChild.innerHTML = data.answer.replace(/\n/g, '<br>');
  } catch (err) {
    messages.lastElementChild.textContent = 'Error – please try again.';
  }
});