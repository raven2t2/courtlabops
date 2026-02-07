# Bird Authentication Setup Guide

Bird needs Twitter/X cookies to work. Since you're on Linux without GUI browsers, we need to extract cookies from your personal device.

## Option 1: Cookie Export (Recommended - 2 minutes)

### Step 1: Get Cookies from Your Browser
1. Open **Chrome/Edge/Brave** on your computer
2. Go to **x.com** (Twitter) and make sure you're **logged in**
3. Press **F12** to open Dev Tools
4. Click **Application** tab (or **Storage** in Firefox)
5. Click **Cookies** → **https://x.com**
6. Find these two values:
   - `auth_token` 
   - `ct0`
7. Copy both values (double-click, Ctrl+C)

### Step 2: Set Environment Variables
Run these commands in your terminal:

```bash
export AUTH_TOKEN="your_auth_token_here"
export CT0="your_ct0_here"
```

To make them permanent, add to `~/.bashrc` or `~/.zshrc`:

```bash
echo 'export AUTH_TOKEN="your_auth_token_here"' >> ~/.bashrc
echo 'export CT0="your_ct0_here"' >> ~/.bashrc
source ~/.bashrc
```

### Step 3: Test
```bash
bird whoami
```

You should see your Twitter handle.

---

## Option 2: Direct Cookie Flag (One-time use)

If you don't want to set env vars:

```bash
bird whoami --auth-token "YOUR_TOKEN" --ct0 "YOUR_CT0"
```

But you'll need to add these flags to every command.

---

## Option 3: Browser Cookie File (Advanced)

If you have Chrome/Chromium installed and logged in:

```bash
# Find Chrome cookies
cd ~/.config/google-chrome/Default
ls Cookies

# Use with bird
bird home --chrome-profile-dir ~/.config/google-chrome/Default
```

---

## Quick Test Commands

Once authenticated, test with:

```bash
# Check who you are
bird whoami

# Search for basketball content
bird search "basketball Adelaide" -n 5

# Read a tweet
bird read "https://x.com/nba/status/1234567890"
```

---

## Troubleshooting

### "Missing auth_token"
- You copied the wrong value — make sure it's the full token
- Token expired — log out and back in to x.com, get fresh cookies

### "Rate limited"
- Wait a few minutes between searches
- Bird has built-in rate limiting

### "Not authorized"
- Your Twitter account might have restrictions
- Try a different account

---

## Security Note

Your auth_token is like a password. **Never commit it to git.**

The automation scripts will use environment variables:
```bash
export AUTH_TOKEN="..."
export CT0="..."
```

These are stored in memory only (unless you add to .bashrc).

---

## Ready?

Once you've set AUTH_TOKEN and CT0, run:
```bash
bird whoami
```

Then I'll enable the daily automation.
