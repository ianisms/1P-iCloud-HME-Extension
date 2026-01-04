# Screenshots and Visual Guide

## Extension Popup

The extension popup provides a clean interface for authentication and status:

### Not Authenticated
```
┌─────────────────────────────────────┐
│  🔐 iCloud Hide My Email            │
│  For 1Password                      │
├─────────────────────────────────────┤
│  iCloud Status                      │
│  ⚫ Not Connected                   │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  Sign in with iCloud          │ │
│  └───────────────────────────────┘ │
│                                     │
│  How to Use                         │
│  • Click "Sign in with iCloud"      │
│  • Visit any website with a form    │
│  • Click the shield button          │
│  • Email will be generated          │
│  • Save login with 1Password        │
└─────────────────────────────────────┘
```

### Authenticated
```
┌─────────────────────────────────────┐
│  🔐 iCloud Hide My Email            │
│  For 1Password                      │
├─────────────────────────────────────┤
│  iCloud Status                      │
│  🟢 Connected                       │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  Manage Emails                │ │
│  └───────────────────────────────┘ │
│                                     │
│  How to Use                         │
│  • Visit any website with a form    │
│  • Click the shield button          │
│  • Email will be generated          │
│  • Save login with 1Password        │
└─────────────────────────────────────┘
```

## Page Integration

### Login Form with Extension

```
┌──────────────────────────────────────────────┐
│  Sign In                                     │
├──────────────────────────────────────────────┤
│                                              │
│  Email Address                               │
│  ┌──────────────────────────────┐  ┌─────┐ │
│  │ your@email.com               │  │ 🛡️  │ │
│  └──────────────────────────────┘  └─────┘ │
│                                       ↑      │
│  Password                        Shield     │
│  ┌──────────────────────────────┐  Button   │
│  │ ••••••••••••••               │           │
│  └──────────────────────────────┘           │
│                                              │
│  ┌──────────────────────────────┐           │
│  │      Sign In                 │           │
│  └──────────────────────────────┘           │
└──────────────────────────────────────────────┘
```

### Button States

#### Default State
```
┌─────┐
│ 🛡️  │  Blue shield icon
└─────┘  Hover: Darker blue, slight scale up
```

#### Loading State
```
┌─────┐
│ ⟳  │  Spinning circle, light blue background
└─────┘
```

#### Success State
```
┌─────┐
│ ✓  │  Checkmark, green background
└─────┘  Appears for 2 seconds after success
```

#### Error State
```
┌─────┐
│ ✗  │  X mark, red background
└─────┘  Appears for 3 seconds after error
```

## User Flow

### Complete Flow Diagram

```
1. User visits website
        ↓
2. Extension detects email/username fields
        ↓
3. Shield button appears to the right of field
        ↓
4. User clicks shield button
        ↓
5. Extension checks authentication
        ├─ Not authenticated → Show error, prompt to sign in
        └─ Authenticated → Continue
                ↓
6. Button shows loading state
        ↓
7. Extension calls iCloud API
        ├─ Success → Generated email (e.g., xyz@icloud.com)
        └─ Error → Show error notification
                ↓
8. Email is filled into input field
        ↓
9. Input and change events fired
        ↓
10. Button shows success state
        ↓
11. 1Password detects the field change
        ↓
12. User continues with 1Password save flow
```

## Example Generated Email

iCloud Hide My Email addresses follow this pattern:
```
[random]@icloud.com

Examples:
• abc123xyz@icloud.com
• def456uvw@icloud.com
• ghi789rst@icloud.com
```

## Button Positioning

The button is dynamically positioned to the right of the input field:

```
Input Field                Button
┌────────────────┐        ┌───┐
│ email@site.com │  4px   │ 🛡️│
└────────────────┘  gap   └───┘
```

Position calculation:
- Left: `input.right + 4px`
- Top: `input.top + (input.height - 32px) / 2`
- Size: `32px × 32px`

## Field Detection

The extension detects these input types:

### Email Fields
✓ `<input type="email">`
✓ `<input name="email">`
✓ `<input id="email">`
✓ `<input placeholder="Email">`

### Username Fields
✓ `<input type="text" name="username">`
✓ `<input type="text" id="username">`
✓ `<input type="text" name="login">`
✓ `<input type="text" autocomplete="username">`

## Notifications

Success notification:
```
┌─────────────────────────────────┐
│ ✓ Email generated successfully │
│   abc123xyz@icloud.com         │
└─────────────────────────────────┘
```

Error notification:
```
┌─────────────────────────────────┐
│ ✗ Failed to generate email.    │
│   Please check authentication. │
└─────────────────────────────────┘
```

## Integration with 1Password

The extension works seamlessly with 1Password:

1. **Field Detection**: Both extensions detect the same fields
2. **Auto-fill**: Generated email triggers 1Password's detection
3. **Save Flow**: 1Password's save dialog includes the generated email
4. **No Conflicts**: Extension buttons don't interfere with each other

```
Email field with both extensions:
┌──────────────────────────────┐  ┌───┐  ┌────┐
│ abc123@icloud.com           │  │ 🛡️│  │ 1P │
└──────────────────────────────┘  └───┘  └────┘
                                   HME    1Password
                                  Button   Icon
```
