# Development Guide

## Quick Start for Testing

### 1. Load the Extension

#### Chrome/Edge
```bash
1. Open chrome://extensions/ (or edge://extensions/)
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Select this directory
```

#### Brave
```bash
1. Open brave://extensions/
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Select this directory
```

#### Firefox
```bash
1. Open about:debugging#/runtime/this-firefox
2. Click "Load Temporary Add-on"
3. Navigate to this directory and select manifest.json
```

### 2. Test the Extension

1. Open `test.html` in your browser
2. You should see a shield button appear to the right of each email/username field
3. Click the shield button to test email generation (requires iCloud authentication)

### 3. View Console Logs

- Open Developer Tools (F12)
- Check the Console tab for extension logs
- Look for messages like:
  - "1Password HME content script loaded"
  - "1Password Hide My Email Extension loaded"

## Testing Workflow

### Manual Testing Steps

1. **Test Field Detection**
   - Open test.html
   - Verify shield buttons appear next to:
     - Email field (type="email")
     - Username field (type="text" with name="username")
     - Login field (name includes "login")
     - User email field (id includes "user")

2. **Test Authentication**
   - Click extension icon in toolbar
   - Click "Sign in with iCloud"
   - Complete iCloud authentication
   - Verify status changes to "Connected"

3. **Test Email Generation**
   - With iCloud authenticated, visit test.html
   - Click a shield button
   - Verify:
     - Button shows loading state (spinning icon)
     - Email is generated and filled into field
     - Button shows success state (checkmark)
     - Input and change events are fired

4. **Test Error Handling**
   - Without authentication, click shield button
   - Verify error message is displayed
   - Button should show error state

### Testing on Real Websites

Good test sites:
- https://github.com/signup
- https://www.reddit.com/register
- https://twitter.com/i/flow/signup
- Any site with email/username fields

## Debugging

### Content Script Issues

Check content script is loaded:
```javascript
// In browser console
console.log('Content script loaded:', typeof processEmailFields);
```

### Background Script Issues

Check service worker:
1. Go to chrome://extensions/
2. Click "service worker" link under the extension
3. View console logs

### Button Not Appearing

1. Check element detection:
```javascript
// In browser console
document.querySelectorAll('input').forEach(input => {
  console.log(input.type, input.name, input.id);
});
```

2. Check if button was added:
```javascript
document.querySelectorAll('.hme-btn').length
```

### API Issues

Monitor network requests:
1. Open Developer Tools > Network tab
2. Filter by "icloud.com"
3. Check for API calls to:
   - p95-maildomainws.icloud.com/v1/hme/setup
   - p95-maildomainws.icloud.com/v1/hme/generate

## Code Structure

### Files Overview

- **manifest.json** - Extension configuration (Manifest V3)
- **background.js** - Service worker handling iCloud API calls
- **content.js** - Injected into pages to detect fields and add buttons
- **popup.html/js** - Extension popup UI for authentication
- **styles.css** - Styles for the injected button
- **test.html** - Test page with various field types

### Key Functions

#### content.js
- `isEmailOrUsernameField(input)` - Detects if field is email/username
- `addHMEButton(input)` - Adds button next to field
- `positionButton(input, button)` - Positions button to the right of field
- `handleButtonClick(input, button)` - Handles button click and email generation

#### background.js
- `handleAuthentication()` - Manages iCloud authentication
- `handleGenerateEmail(label)` - Calls iCloud API to generate email

## Common Issues

### Button Position Issues

The button is positioned absolutely using:
```javascript
button.style.left = `${inputRect.right + scrollX + 4}px`;
button.style.top = `${inputRect.top + scrollY + (inputRect.height - 32) / 2}px`;
```

If buttons appear in wrong positions:
- Check if input fields have absolute/fixed positioning
- Verify scroll offsets are correct
- Check if page has transforms applied

### Authentication Issues

If authentication fails:
- Ensure iCloud+ subscription is active
- Clear icloud.com cookies and try again
- Check browser console for errors

### API Call Issues

If email generation fails:
- Check Network tab for 401/403 errors (auth issue)
- Verify cookies are being sent with requests
- Check for CORS issues (should not occur with proper credentials)

## Making Changes

### Modifying Field Detection

Edit `isEmailOrUsernameField()` in content.js to change detection logic.

### Changing Button Appearance

Edit styles.css to modify button appearance:
- `.hme-btn` - Default state
- `.hme-btn.loading` - Loading state
- `.hme-btn.success` - Success state
- `.hme-btn.error` - Error state

### Updating API Endpoints

Edit `handleGenerateEmail()` in background.js to modify API calls.

## Releasing

### Before Release

1. Test on multiple browsers (Chrome, Edge, Brave, Firefox)
2. Test on multiple websites
3. Verify all console errors are handled
4. Update version in manifest.json
5. Create release notes

### Building for Distribution

For Chrome Web Store:
```bash
# Create a zip file
zip -r extension.zip . -x "*.git*" "test.html" "DEVELOPMENT.md" "*.md"
```

For Firefox Add-ons:
```bash
# Create a xpi file
zip -r extension.xpi . -x "*.git*" "test.html" "DEVELOPMENT.md" "*.md"
# Rename to .xpi
```

## Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Firefox Extension Documentation](https://extensionworkshop.com/)
- [1Password Extension Documentation](https://developer.1password.com/)
- [iCloud API (unofficial)](https://github.com/topics/icloud-api)
