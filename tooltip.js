const explain = document.getElementById('explain');
const copy = document.getElementById('copy');
const paste = document.getElementById('paste');

explain.addEventListener('click', () => {
  const text = document.getSelection().toString().replaceAll('\n', '');
  if (text.length == 0) return;

  createUserMessage('Please explain the selected text!');
  askAI(`Please explain the following text in a way anyone could understand. Simplify and summarize. Be very concise and explanatory:\n${text}`).then(createAIMessage);
  expandChat();
});

copy.addEventListener('click', () => {
  // TODO
});

paste.addEventListener('click', () => {
  const text = document.getSelection().toString().replaceAll('\n', '');

  textarea.value += text;
});