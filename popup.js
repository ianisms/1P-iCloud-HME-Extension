// Popup script for managing extension settings and authentication
document.addEventListener('DOMContentLoaded', async () => {
  const authButton = document.getElementById('auth-button');
  const statusIndicator = document.getElementById('status-indicator');
  const statusText = document.getElementById('status-text');
  const messageDiv = document.getElementById('message');

  // Check authentication status on load
  await checkAuthStatus();

  // Handle authentication button click
  authButton.addEventListener('click', async () => {
    if (statusIndicator.classList.contains('connected')) {
      // Already authenticated - maybe show options or manage emails
      showMessage('You are already signed in to iCloud', 'success');
    } else {
      // Start authentication
      await authenticate();
    }
  });

  // Check if user is authenticated
  async function checkAuthStatus() {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'checkAuth' });
      
      if (response.isAuthenticated) {
        updateStatus(true);
      } else {
        updateStatus(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      updateStatus(false);
    }
  }

  // Update UI based on authentication status
  function updateStatus(isAuthenticated) {
    if (isAuthenticated) {
      statusIndicator.classList.remove('disconnected');
      statusIndicator.classList.add('connected');
      statusText.textContent = 'Connected';
      authButton.textContent = 'Manage Emails';
      authButton.classList.remove('button-primary');
      authButton.classList.add('button-secondary');
    } else {
      statusIndicator.classList.remove('connected');
      statusIndicator.classList.add('disconnected');
      statusText.textContent = 'Not Connected';
      authButton.textContent = 'Sign in with iCloud';
      authButton.classList.remove('button-secondary');
      authButton.classList.add('button-primary');
    }
  }

  // Authenticate with iCloud
  async function authenticate() {
    authButton.disabled = true;
    authButton.innerHTML = '<span class="loading"></span> Signing in...';

    try {
      const response = await chrome.runtime.sendMessage({ action: 'authenticate' });
      
      if (response.success) {
        updateStatus(true);
        showMessage('Successfully signed in to iCloud!', 'success');
      } else {
        throw new Error(response.error || 'Authentication failed');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      showMessage('Failed to sign in. Please try again.', 'error');
      updateStatus(false);
    } finally {
      authButton.disabled = false;
      await checkAuthStatus(); // Refresh status
    }
  }

  // Show message to user
  function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type} show`;
    
    setTimeout(() => {
      messageDiv.classList.remove('show');
    }, 5000);
  }
});
