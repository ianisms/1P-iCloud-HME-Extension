# 1Password Hide My Email Extension

A browser extension that seamlessly integrates Apple's iCloud Hide My Email service with 1Password, allowing you to generate private email addresses directly from login forms.

## Features

- 🔐 **One-Click Email Generation**: Generate Hide My Email addresses with a single click
- 🎯 **Smart Field Detection**: Automatically detects email and username fields on any website
- 🔄 **Seamless 1Password Integration**: Works alongside 1Password's save login flow
- 🎨 **Beautiful UI**: Clean, modern interface that matches Apple's design language
- 🚀 **Fast & Lightweight**: Minimal performance impact on your browsing experience

## How It Works

1. **Install the Extension**: Load the extension in your browser (Chrome, Edge, Brave, or Firefox)
2. **Sign in to iCloud**: Click the extension icon and authenticate with your Apple ID
3. **Visit Any Website**: Navigate to a website with a login form
4. **Click the Shield Button**: A blue shield icon appears to the right of email/username fields
5. **Generate Email**: Click the shield to create a new Hide My Email address
6. **Save with 1Password**: The generated email is filled into the field, ready for 1Password to save

## Installation

### Chrome/Edge (Developer Mode)

1. Clone or download this repository
2. Open Chrome/Edge and navigate to `chrome://extensions/` (or `edge://extensions/`)
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked"
5. Select the extension directory
6. The extension icon should appear in your browser toolbar

### Brave (Developer Mode)

1. Clone or download this repository
2. Open Brave and navigate to `brave://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked"
5. Select the extension directory
6. The extension icon should appear in your browser toolbar

### Firefox (Temporary Installation)

1. Clone or download this repository
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Navigate to the extension directory and select `manifest.json`
5. The extension will be loaded temporarily

## Usage

### First Time Setup

1. Click the extension icon in your browser toolbar
2. Click "Sign in with iCloud"
3. A new tab will open to iCloud.com
4. Sign in with your Apple ID
5. Once authenticated, return to the extension popup
6. You should see "Connected" status

### Generating Hide My Email Addresses

1. Visit any website with a login or registration form
2. Look for email or username input fields
3. A blue shield button will appear to the right of these fields
4. Click the shield button
5. A new Hide My Email address will be generated and filled into the field
6. Continue with your normal 1Password save flow

### Managing Your Emails

All generated Hide My Email addresses can be managed through:
- iCloud Settings on your Apple device
- iCloud.com on the web
- The Mail settings in System Preferences (macOS)

## Requirements

- **Browser**: Chrome, Edge, Brave, or Firefox (Manifest V3 compatible)
- **iCloud+**: Active iCloud+ subscription (Hide My Email is an iCloud+ feature)
- **Apple ID**: Valid Apple ID for authentication
- **1Password**: 1Password browser extension (optional but recommended)

## Privacy & Security

- **No Data Storage**: This extension does not store your credentials or generated emails
- **Direct Communication**: All API calls go directly to Apple's iCloud servers
- **Secure Authentication**: Uses Apple's official authentication flow
- **Open Source**: All code is available for review in this repository

## Technical Details

### Project Structure

```
1P-HME-Extension/
├── manifest.json          # Extension manifest (Manifest V3)
├── background.js          # Service worker for API communication
├── content.js            # Content script for page integration
├── popup.html            # Extension popup UI
├── popup.js              # Popup logic and settings
├── styles.css            # Styles for injected button
└── icons/                # Extension icons
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

### API Integration

The extension uses Apple's official iCloud Hide My Email API endpoints:
- `https://p95-maildomainws.icloud.com/v1/hme/setup` - Get setup token
- `https://p95-maildomainws.icloud.com/v1/hme/generate` - Generate new email address

### Button Positioning

The extension intelligently positions the Hide My Email button to the right of email/username fields using:
- Dynamic position calculation based on input field boundaries
- Responsive repositioning on window resize
- ResizeObserver for input field dimension changes

## Troubleshooting

### Button Not Appearing

- Refresh the page after installing the extension
- Check that the extension is enabled in your browser
- Verify the field is detected as an email/username field

### Authentication Issues

- Ensure you have an active iCloud+ subscription
- Clear browser cookies for icloud.com and try again
- Try signing out and back in through the extension

### Email Generation Fails

- Verify you're authenticated (check extension popup)
- Ensure you have available Hide My Email slots
- Check your internet connection

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Apple, iCloud, and Hide My Email are trademarks of Apple Inc. 1Password is a trademark of AgileBits, Inc.

## Disclaimer

This is an unofficial extension and is not affiliated with, endorsed by, or sponsored by Apple Inc. or AgileBits, Inc. Use at your own risk.