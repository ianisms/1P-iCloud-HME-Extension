// Content script for detecting email fields and adding HME button
console.log('1Password HME content script loaded');

// Configuration
const BUTTON_ID = 'hme-button';
const BUTTON_CLASS = 'hme-btn';
const BUTTON_SIZE = 32; // px
const BUTTON_GAP = 4; // px from input field
const BUTTON_Z_INDEX = 10000;

// Track which fields already have buttons
const processedFields = new WeakSet();
const buttonFieldMap = new Map(); // Map buttons to their input fields

// Global resize throttling
let resizeTimeout = null;

// Single ResizeObserver instance for all input fields
const inputResizeObserver = new ResizeObserver((entries) => {
  entries.forEach((entry) => {
    const input = entry.target;
    // Find the button for this input
    for (const [button, field] of buttonFieldMap.entries()) {
      if (field === input) {
        positionButton(input, button);
        break;
      }
    }
  });
});

// Initialize the extension
function init() {
  // Watch for new email/username fields
  observeDOM();
  
  // Process existing fields
  processEmailFields();
  
  // Set up global resize listener (throttled for performance)
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(repositionAllButtons, 100);
  });
}

// Detect email/username input fields
function isEmailOrUsernameField(input) {
  if (input.tagName !== 'INPUT') return false;
  
  const type = input.type?.toLowerCase();
  const name = input.name?.toLowerCase() || '';
  const id = input.id?.toLowerCase() || '';
  const placeholder = input.placeholder?.toLowerCase() || '';
  const autocomplete = input.autocomplete?.toLowerCase() || '';
  
  // Check if it's an email or username field
  const isEmail = type === 'email' || 
                  name.includes('email') || 
                  id.includes('email') ||
                  placeholder.includes('email') ||
                  autocomplete.includes('email');
  
  const isUsername = type === 'text' && (
                     name.includes('user') || 
                     name.includes('login') ||
                     id.includes('user') || 
                     id.includes('login') ||
                     placeholder.includes('user') ||
                     placeholder.includes('login') ||
                     autocomplete.includes('username'));
  
  return isEmail || isUsername;
}

// Process all email fields on the page
function processEmailFields() {
  const inputs = document.querySelectorAll('input');
  
  inputs.forEach(input => {
    if (isEmailOrUsernameField(input) && !processedFields.has(input)) {
      addHMEButton(input);
      processedFields.add(input);
    }
  });
}

// Add the HME button next to an input field
function addHMEButton(input) {
  // Check if button already exists
  const existingButton = input.parentElement?.querySelector(`.${BUTTON_CLASS}`);
  if (existingButton) return;
  
  // Create button
  const button = document.createElement('button');
  button.className = BUTTON_CLASS;
  button.type = 'button';
  button.title = 'Generate Hide My Email';
  button.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 1L3 4V7C3 10.5 5.5 13.5 8 14.5C10.5 13.5 13 10.5 13 7V4L8 1Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M8 8H8.008" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `;
  
  // Add click handler
  button.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await handleButtonClick(input, button);
  });
  
  // Insert button into DOM next to the input
  if (input.parentElement) {
    // Insert button right after the input field
    input.parentElement.insertBefore(button, input.nextSibling);
    
    // Track button-field mapping
    buttonFieldMap.set(button, input);
    
    // Position button dynamically
    positionButton(input, button);
    
    // Observe input field size changes with shared observer
    inputResizeObserver.observe(input);
  }
}

// Reposition all buttons (called on window resize)
function repositionAllButtons() {
  buttonFieldMap.forEach((input, button) => {
    if (document.contains(button) && document.contains(input)) {
      positionButton(input, button);
    } else {
      // Clean up if button or input was removed
      buttonFieldMap.delete(button);
    }
  });
}

// Position the button next to the input field
function positionButton(input, button) {
  const inputRect = input.getBoundingClientRect();
  const scrollX = window.scrollX || window.pageXOffset;
  const scrollY = window.scrollY || window.pageYOffset;
  
  // Position button to the right of the input field
  button.style.position = 'absolute';
  button.style.left = `${inputRect.right + scrollX + BUTTON_GAP}px`;
  button.style.top = `${inputRect.top + scrollY + (inputRect.height - BUTTON_SIZE) / 2}px`;
  button.style.zIndex = BUTTON_Z_INDEX.toString();
}

// Handle button click
async function handleButtonClick(input, button) {
  // Disable button and show loading state
  button.disabled = true;
  button.classList.add('loading');
  button.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="spinner">
      <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="30" stroke-dashoffset="30">
        <animateTransform attributeName="transform" type="rotate" from="0 8 8" to="360 8 8" dur="1s" repeatCount="indefinite"/>
      </circle>
    </svg>
  `;
  
  try {
    // Get label from page context (domain name)
    const label = window.location.hostname;
    
    // Request email generation from background script
    const response = await chrome.runtime.sendMessage({
      action: 'generateEmail',
      label: label
    });
    
    if (response.success) {
      // Fill the input field with the generated email
      input.value = response.email;
      
      // Trigger input events to ensure frameworks detect the change
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      
      // Show success state
      button.classList.remove('loading');
      button.classList.add('success');
      button.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 4L6 11L3 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
      
      // Focus the field to trigger 1Password
      input.focus();
      
      // Reset button after 2 seconds
      setTimeout(() => {
        button.classList.remove('success');
        button.disabled = false;
        button.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 1L3 4V7C3 10.5 5.5 13.5 8 14.5C10.5 13.5 13 10.5 13 7V4L8 1Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8 8H8.008" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        `;
      }, 2000);
      
    } else {
      throw new Error(response.error || 'Failed to generate email');
    }
  } catch (error) {
    console.error('Error generating HME:', error);
    
    // Show error state
    button.classList.remove('loading');
    button.classList.add('error');
    button.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 1L3 4V7C3 10.5 5.5 13.5 8 14.5C10.5 13.5 13 10.5 13 7V4L8 1Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M6 6L10 10M10 6L6 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    `;
    
    // Show error message
    showNotification('Failed to generate email. Please check your iCloud authentication.', 'error');
    
    // Reset button after 3 seconds
    setTimeout(() => {
      button.classList.remove('error');
      button.disabled = false;
      button.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 1L3 4V7C3 10.5 5.5 13.5 8 14.5C10.5 13.5 13 10.5 13 7V4L8 1Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M8 8H8.008" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      `;
    }, 3000);
  }
}

// Show notification to user
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `hme-notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// Observe DOM for new fields
function observeDOM() {
  const observer = new MutationObserver((mutations) => {
    processEmailFields();
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
