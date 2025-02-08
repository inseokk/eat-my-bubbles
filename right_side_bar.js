const chatSection = document.querySelector('.chat-section');
const chatHeader = chatSection.querySelector('.chat-header');
const chatInputSection = chatSection.querySelector('.chat-input-section');

const actionButtonContainer = chatInputSection.querySelector('.action-buttons');
const inputContainer = chatInputSection.querySelector('.input-container');
const textarea = inputContainer.querySelector('.chat-input');

const filter = document.querySelector('.filter');
const discussionItems = document.querySelectorAll('.discussion-item');
const actionButtons = document.querySelectorAll('.action-button');

const messages = document.querySelector('.messages');

const MIN_CHAT = 250;
const MAX_CHAT = 600;

// Filter dropdown
filter.addEventListener('click', function () {
  // Toggle filter options (Not implemented yet)
  console.log('Filter clicked');
});

// Discussion items
discussionItems.forEach(item => {
  item.addEventListener('click', function () {
    // Handle discussion item click (Not implemented yet)
    console.log('Discussion item clicked');
  });
});

// Action buttons
actionButtons.forEach(button => {
  button.addEventListener('click', function () {
    // Handle action button click (Not implemented yet)
    console.log('Action button clicked:', this.textContent);
  });
});

// Make the chat section resizable
let isResizing = false;
let startY;
let startHeight;

// Adjust chat input
function adjustChatInputSection(chatSection) {
  const availableHeight = chatSection.offsetHeight - chatHeader.offsetHeight + 50;

  // Size constraint
  const minInputHeight = 100; // Min height
  const maxInputHeight = availableHeight - 50; // Margins

  const newHeight = Math.max(minInputHeight, Math.min(maxInputHeight, availableHeight));
  chatInputSection.style.height = `${newHeight}px`;

  // Adjust textarea height
  const textareaHeight = newHeight - actionButtonContainer.offsetHeight - 40;
  textarea.style.height = `${textareaHeight}px`;
}

chatSection.addEventListener('mousedown', function (e) {
  // Only start resizing if clicking near the top border
  if (e.target == chatHeader) {
    isResizing = true;
    startY = e.pageY;
    startHeight = parseInt(document.defaultView.getComputedStyle(this).height, 10);

    // Add temporary overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.right = '0';
    overlay.style.bottom = '0';
    overlay.style.zIndex = '9999';
    document.body.appendChild(overlay);

    // Store overlay reference
    this.overlay = overlay;
  }
});

document.addEventListener('mousemove', function (e) {
  if (!isResizing) return;

  const chatSection = document.querySelector('.chat-section');
  const newHeight = startHeight - (e.pageY - startY);

  // Apply constraints
  if (newHeight >= MIN_CHAT && newHeight <= MAX_CHAT) {
    chatSection.style.height = `${newHeight}px`;
    adjustChatInputSection(chatSection);
  }
});

document.addEventListener('mouseup', function () {
  if (isResizing) {
    isResizing = false;

    // Remove the temporary overlay
    const chatSection = document.querySelector('.chat-section');
    if (chatSection.overlay) {
      chatSection.overlay.remove();
      delete chatSection.overlay;
    }
  }
});

adjustChatInputSection(chatSection);

// Handle message submission
function submitMessage() {
  const input = document.querySelector('.chat-input');
  const message = input.value.trim();
  if (message) {
    console.log('Submitted:', message);
    chatSection.style.height = `${MAX_CHAT}px`;
    adjustChatInputSection(chatSection);
    createUserMessage(message);
    askAI(message).then(createAIMessage);
    input.value = '';
  }
}

function createUserMessage(message) {
  const elem = document.createElement('div');
  elem.classList.add('user-message');
  elem.innerText = message;
  messages.appendChild(elem);
}

function createAIMessage(message) {
  const elem = document.createElement('div');
  elem.classList.add('ai-message');
  elem.innerHTML = `<div class="logo"></div><div class="ai-message-content">${message}</div>`;
  messages.appendChild(elem);
}

// Handle chat input submission with button
document.querySelector('.submit-button').addEventListener('click', submitMessage);

// Handle chat input submission with Enter key
document.querySelector('.chat-input').addEventListener('keypress', function (e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    submitMessage();
  }
});