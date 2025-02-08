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

// // Filter dropdown
// filter.addEventListener('click', function () {
//   // Toggle filter options (Not implemented yet)
//   console.log('Filter clicked');
// });

// // Discussion items
// discussionItems.forEach(item => {
//   item.addEventListener('click', function () {
//     // Handle discussion item click (Not implemented yet)
//     console.log('Discussion item clicked');
//   });
// });

// // Action buttons
// actionButtons.forEach(button => {
//   button.addEventListener('click', function () {
//     // Handle action button click (Not implemented yet)
//     console.log('Action button clicked:', this.textContent);
//   });
// });

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
    createUserMessage(message);
    askAI(message).then(createAIMessage);
    input.value = '';
  }
}

function expandChat() {
  chatSection.style.height = `${MAX_CHAT}px`;
  adjustChatInputSection(chatSection);
}

function createUserMessage(message) {
  const elem = document.createElement('div');
  elem.classList.add('user-message');
  elem.innerText = message;
  messages.appendChild(elem);
  messages.scrollTo(0, messages.scrollHeight);
}

function createAIMessage(message) {
  const elem = document.createElement('div');
  elem.classList.add('ai-message');
  elem.innerHTML = `<div class="logo"></div><div class="ai-message-content">${message}</div>`;
  messages.appendChild(elem);
  messages.scrollTo(0, messages.scrollHeight);
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

// Helper function to setup filter functionality
function setupFilter(filterButton, filterDropdown, filterOptions, filterText, filterArrow) {
  if (!filterButton || !filterDropdown) return;

  filterButton.addEventListener('click', (e) => {
      e.stopPropagation();
      filterDropdown.classList.toggle('active');
      if (filterArrow) {
          filterArrow.style.transform = filterDropdown.classList.contains('active') ? 'rotate(180deg)' : '';
      }
  });

  if (filterOptions) {
    filterOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation(); // Stop event from bubbling up
        if (filterText) {
          filterText.textContent = option.textContent;
        } else if (filterButton.querySelector('span')) {
          filterButton.querySelector('span').textContent = option.textContent;
        } else {
          filterButton.textContent = option.textContent;
          if (filterArrow) {
            filterButton.appendChild(filterArrow.cloneNode(true));
          }
        }

        // Explicitly close the dropdown
        filterDropdown.classList.remove('active');
        if (filterArrow) {
          filterArrow.style.transform = '';
        }
      });
    });
  }
}

// Setup sidebar filter
const sidebarFilter = document.querySelector('.sidebar .filter');
const sidebarFilterDropdown = document.querySelector('.sidebar .filter-dropdown');
const sidebarFilterOptions = document.querySelectorAll('.sidebar .filter-option');
const sidebarFilterText = document.querySelector('.sidebar .filter-text');
const sidebarFilterArrow = document.querySelector('.sidebar .filter-arrow');

setupFilter(sidebarFilter, sidebarFilterDropdown, sidebarFilterOptions, sidebarFilterText, sidebarFilterArrow);

// Setup fullscreen filter
const fullscreenFilterButton = document.querySelector('.filter-button');
const fullscreenFilterDropdown = document.querySelector('.fullscreen-container .filter-dropdown');
const fullscreenFilterOptions = document.querySelectorAll('.fullscreen-container .filter-option');
const fullscreenFilterArrow = fullscreenFilterButton?.querySelector('.filter-arrow');

setupFilter(fullscreenFilterButton, fullscreenFilterDropdown, fullscreenFilterOptions, null, fullscreenFilterArrow);

// Global click handler to close all dropdowns when clicking outside
document.addEventListener('click', (e) => {
  console.log(e.target, e);

  // Handle sidebar filter
  if (sidebarFilter && !sidebarFilter.contains(e.target)) {
    sidebarFilterDropdown?.classList.remove('active');
    if (sidebarFilterArrow) {
      sidebarFilterArrow.style.transform = '';
    }
  }

  // Handle fullscreen filter
  if (fullscreenFilterButton && !fullscreenFilterButton.contains(e.target)) {
    fullscreenFilterDropdown?.classList.remove('active');
    if (fullscreenFilterArrow) {
      fullscreenFilterArrow.style.transform = '';
    }
  }
});

// Fullscreen functionality
const fullscreenContainer = document.querySelector('.fullscreen-container');
const expandButton = document.querySelector('.expand-icon');
const closeButton = document.querySelector('.close-button');
const discussionList = document.querySelector('.discussion-list');
const fullscreenDiscussionContent = document.querySelector('.discussion-content');

// Function to enter fullscreen mode
function enterFullscreen() {
  // Clone discussion items to fullscreen view
  const discussionItems = discussionList.innerHTML;
  fullscreenDiscussionContent.innerHTML = discussionItems;
  fullscreenContainer.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Function to exit fullscreen mode
function exitFullscreen() {
  fullscreenContainer.classList.remove('active');
  document.body.style.overflow = ''; // Restore scrolling
}

// Event listeners
expandButton.addEventListener('click', enterFullscreen);
closeButton.addEventListener('click', exitFullscreen);

// Handle post submission
function submitPost() {
  const titleInput = document.querySelector('.title-input');
  const discussionTextarea = document.querySelector('.discussion-textarea');
  const selectedTags = [];
  
  // Get selected tags
  document.querySelectorAll('.tag-btn').forEach(tagBtn => {
    if (tagBtn.classList.contains('selected')) {
      selectedTags.push(tagBtn.textContent);
    }
  });
  
  const postData = {
    title: titleInput.value.trim(),
    content: discussionTextarea.value.trim(),
    tags: selectedTags
  };
  
  if (postData.title && postData.content) {
    console.log('Post submitted:', postData);
    
    // Clear form
    titleInput.value = '';
    discussionTextarea.value = '';
    document.querySelectorAll('.tag-btn').forEach(btn => btn.classList.remove('selected'));
    
    // Here you would typically send the data to your backend
    createDiscussionItem(postData);
  } else {
    alert('Please fill in both title and content before posting.');
  }
}

// Create new discussion item from submitted data
function createDiscussionItem(postData) {
  const discussionItem = document.createElement('div');
  discussionItem.className = 'discussion-item';
  discussionItem.innerHTML = `
    <div class="discussion-title">${postData.title}</div>
    <div class="discussion-preview">
      ${postData.content.substring(0, 100)}... 
      <span class="read-more">Read More</span>
    </div>
    <div class="item-footer">
      <svg class="checkmark" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 6L9 17l-5-5"/>
      </svg>
      <span class="comment-count">0</span>
    </div>
  `;
  
  // Add to both sidebar and fullscreen discussion lists
  document.querySelector('.discussion-list').prepend(discussionItem);
  document.querySelector('.discussion-content').prepend(discussionItem.cloneNode(true));
}

// Add click event for post button
document.querySelector('.post-btn').addEventListener('click', submitPost);

// Add click events for tag buttons to toggle selection
document.querySelectorAll('.tag-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('selected');
  });
});

// Handle discussion item clicks in fullscreen mode
fullscreenDiscussionContent.addEventListener('click', function(e) {
  const discussionItem = e.target.closest('.discussion-item');
  if (discussionItem) {
    const title = discussionItem.querySelector('.discussion-title').textContent;
    const preview = discussionItem.querySelector('.discussion-preview').textContent;
    
    // Get full content (in a real application, you might fetch this from a database)
    const fullContent = preview.replace('Read More', '').trim();
    
    updateMiddleSection(title, fullContent);
  }
});

// Handle chat submission in fullscreen mode
const chatInput = document.querySelector('.chat-section-fullscreen .chat-input');
const submitButton = document.querySelector('.chat-section-fullscreen .submit-button');

function sendMessage() {
  const message = chatInput.value.trim();
  if (message) {
    console.log('Sending message:', message);
    chatInput.value = '';
  }
}

submitButton.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Function to update middle section content
function updateMiddleSection(title, content) {
  const conversationSelector = document.querySelector('.conversation-selector');
  const emptyStateIcon = conversationSelector.querySelector('.empty-state-icon');
  const emptyStateText = conversationSelector.querySelector('.empty-state-text');
  
  // Create new content container if it doesn't exist
  let contentContainer = conversationSelector.querySelector('.selected-discussion-content');
  if (!contentContainer) {
    contentContainer = document.createElement('div');
    contentContainer.className = 'selected-discussion-content';
    conversationSelector.insertBefore(contentContainer, emptyStateText);
  }
  
  // Update content
  contentContainer.innerHTML = `
    <h2 class="discussion-title text-xl font-medium mb-4">${title}</h2>
    <div class="discussion-content">${content}</div>
  `;
  
  // Hide empty state elements
  emptyStateIcon.style.display = 'none';
  emptyStateText.style.display = 'none';
}

// Handle discussion item clicks in fullscreen mode
fullscreenDiscussionContent.addEventListener('click', function(e) {
  const discussionItem = e.target.closest('.discussion-item');
  if (discussionItem) {
    const title = discussionItem.querySelector('.discussion-title').textContent;
    const preview = discussionItem.querySelector('.discussion-preview').textContent;
    
    // Get full content (in a real application, you might fetch this from a database)
    const fullContent = preview.replace('Read More', '').trim();
    
    updateMiddleSection(title, fullContent);
  }
});