// Filter dropdown
document.querySelector('.filter').addEventListener('click', function () {
  // Toggle filter options (Not implemented yet)
  console.log('Filter clicked');
});

// Discussion items
document.querySelectorAll('.discussion-item').forEach(item => {
  item.addEventListener('click', function () {
    // Handle discussion item click (Not implemented yet)
    console.log('Discussion item clicked');
  });
});

// Action buttons
document.querySelectorAll('.action-button').forEach(button => {
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
  const chatHeader = chatSection.querySelector('.chat-header');
  const chatInputSection = chatSection.querySelector('.chat-input-section');
  const availableHeight = chatSection.offsetHeight - chatHeader.offsetHeight - 32; // 32px for padding

  // Size constraint
  const minInputHeight = 100; // Min height
  const maxInputHeight = availableHeight - 50; // Margins

  const newHeight = Math.max(minInputHeight, Math.min(maxInputHeight, availableHeight));
  chatInputSection.style.height = `${newHeight}px`;

  // Adjust textarea height
  const actionButtons = chatInputSection.querySelector('.action-buttons');
  const inputContainer = chatInputSection.querySelector('.input-container');
  const textarea = inputContainer.querySelector('.chat-input');

  const textareaHeight = newHeight - actionButtons.offsetHeight - 20; // 20px gaps
  textarea.style.height = `${textareaHeight}px`;
}

document.querySelector('.chat-section').addEventListener('mousedown', function (e) {
  // Only start resizing if clicking near the top border
  if (e.offsetY <= 10) {
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
  if (newHeight >= 250 && newHeight <= 500) {
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

// Initial adjustment of chat input section
window.addEventListener('load', function () {
  const chatSection = document.querySelector('.chat-section');
  adjustChatInputSection(chatSection);
});

// Handle message submission
function submitMessage() {
  const input = document.querySelector('.chat-input');
  const message = input.value.trim();
  if (message) {
    console.log('Submitted:', message);
    input.value = '';
  }
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