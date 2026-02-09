# 🚀 Daily Briefing - Quick Start (5 Minutes)

## View the Briefing

### Option 1: In the App
```bash
# Start the dev server (if not already running)
npm run dev

# Open in browser
http://localhost:3000/briefings
```

### Option 2: HTML Preview
```bash
# Open the HTML file directly in your browser
open /data/.openclaw/workspace/courtlab-briefings/briefing-2026-02-08.html
```

## Generate New Briefings

### Generate Today's Briefing
```bash
npm run briefing:daily
```

Output:
- `/data/.openclaw/workspace/courtlab-briefings/briefing-2026-02-08.json`
- `/data/.openclaw/workspace/courtlab-briefings/briefing-2026-02-08.html`

### Generate Past 7 Days (Archive)
```bash
npm run briefing:samples
```

Creates 8 briefing files for testing the archive UI.

## Test the API

### List all briefings
```bash
curl http://localhost:3000/api/briefings | jq
```

### Get specific briefing
```bash
curl http://localhost:3000/api/briefings/2026-02-08 | jq
```

## Setup Daily Auto-Generation

### Option 1: Cron Job (Linux/Mac)
```bash
# Edit crontab
crontab -e

# Add this line (generates at 7:00 AM daily)
0 7 * * * cd /data/.openclaw/workspace/courtlabops-repo && npm run briefing:daily >> /var/log/courtlab-briefing.log 2>&1

# Save and verify
crontab -l
```

### Option 2: Manual Check Each Morning
```bash
npm run briefing:daily
```

## What You'll See

### Main Briefing Dashboard (`/briefings`)
- 📊 **Metrics**: Signups, demos, trials (24h)
- 🔥 **Lead Temperature**: Hot prospects from social/Reddit
- ⚡ **Top Affiliates**: Best performing partners
- ⚠️ **Competitive Intel**: Industry news & funding
- 💬 **Content Performance**: Top posts by engagement
- 🚨 **Ops Status**: Blockers & deployments
- 📅 **Today's Schedule**: Calls & meetings
- 🌤️ **Weather**: Adelaide forecast

### Archive View
- Search past briefings by date
- Click to view any previous briefing
- All data persists in JSON files

## File Locations

| File | Purpose |
|------|---------|
| `src/app/briefings/page.tsx` | Main UI (551 lines) |
| `src/app/api/briefings/route.ts` | List API |
| `src/app/api/briefings/[date]/route.ts` | Detail API |
| `scripts/daily-briefing.js` | Generator (568 lines) |
| `/courtlab-briefings/` | Output directory |

## Customization

### Change Output Directory
Edit `BRIEFINGS_DIR` in `scripts/daily-briefing.js`:
```javascript
const BRIEFINGS_DIR = '/your/custom/path'
```

### Add More Data
Edit generators in `scripts/daily-briefing.js`:
```javascript
function generateCustomSection() {
  return {
    // your data
  }
}
```

### Change Colors/Styling
Edit Tailwind classes in `src/app/briefings/page.tsx`:
```tsx
<div className="bg-your-color text-your-text">
```

## Troubleshooting

**Briefing not showing?**
```bash
# Check the API
curl http://localhost:3000/api/briefings

# Check files exist
ls -la /data/.openclaw/workspace/courtlab-briefings/
```

**Cron not running?**
```bash
# Check cron logs
sudo journalctl -u cron -n 20

# Run manually to test
npm run briefing:daily
```

**Navigation link missing?**
- Should be in top nav as "Daily Briefing"
- If not, server may need restart: `npm run dev`

## Full Documentation

- **Setup & Configuration**: See `BRIEFING_SETUP.md`
- **User Guide**: See `README_BRIEFINGS.md`
- **Build Summary**: See `BRIEFING_BUILD_SUMMARY.md`
- **Developer API**: See `src/lib/briefing-utils.ts`

## Next Steps

1. ✅ View the briefing at `/briefings`
2. ✅ Test the API endpoints
3. ✅ Generate a new briefing: `npm run briefing:daily`
4. ⏳ Set up cron for daily automation (optional)
5. 🔌 Connect real data sources (future)

---

**Need help?** Check the documentation files or run:
```bash
npm run briefing:daily  # Test the generator
```
