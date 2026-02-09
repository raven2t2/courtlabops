# CourtLab Daily Briefing System

A production-grade morning briefing system for CourtLab with beautiful UI, real-time metrics, competitive intelligence, and operational status.

## ✨ Features

### 🎯 Daily Briefing Dashboard
- **Beautiful React UI** with dark theme matching CourtLab design
- **Responsive design** - works on mobile, tablet, desktop
- **Interactive components** with smooth animations
- **Archive search** - easily find past briefings
- **Date navigation** - browse historical briefings

### 📊 Briefing Sections
1. **CourtLab Metrics (Last 24h)**
   - New signups with % change
   - Demo requests with % change
   - Trial activations with % change

2. **Lead Temperature** (Social + Reddit)
   - Hot prospect identification
   - Lead scores (0-100)
   - Source attribution
   - Temperature indicators (hot/warm)

3. **Top Affiliates**
   - Best-performing partners
   - Conversion metrics
   - Revenue attribution
   - Performance ranking

4. **Competitive Intelligence**
   - Youth sports tech news
   - Funding announcements
   - Market movements
   - Competitor updates

5. **Content Performance**
   - Top tweets/posts yesterday
   - Platform breakdown
   - Engagement metrics
   - Trending content

6. **Ops Status**
   - Active blockers
   - Recent deployments
   - System status
   - Action items

7. **Today's Calendar**
   - Scheduled calls/meetings
   - Time slots
   - Attendees
   - Meeting prep info

8. **Weather (Adelaide)**
   - Current temperature
   - Conditions & humidity
   - Training recommendations
   - Forecast outlook

## 🚀 Quick Start

### View Today's Briefing
```bash
# Start the dev server (or open existing)
npm run dev

# Navigate to:
http://localhost:3000/briefings
```

### Generate a Briefing
```bash
# Generate today's briefing
npm run briefing:daily

# Generate last 7 days of briefings (for testing archive)
npm run briefing:samples
```

### Enable Daily Auto-Generation
See **Scheduling** section in BRIEFING_SETUP.md

## 📁 File Structure

```
courtlabops-repo/
├── src/
│   ├── app/
│   │   ├── briefings/
│   │   │   └── page.tsx              # Main briefing UI
│   │   └── api/
│   │       └── briefings/
│   │           ├── route.ts          # List briefings API
│   │           └── [date]/route.ts   # Get specific briefing API
│   ├── components/
│   │   ├── top-nav.tsx               # Navigation (includes briefing link)
│   │   └── app-shell.tsx             # Layout (updated for briefings)
│   └── lib/
│       └── briefing-utils.ts         # Utility functions
├── scripts/
│   ├── daily-briefing.js             # Main generator
│   └── generate-sample-briefings.js  # Archive generator
├── BRIEFING_SETUP.md                 # Detailed setup guide
└── README_BRIEFINGS.md               # This file

/data/.openclaw/workspace/
└── courtlab-briefings/               # Output directory
    ├── briefing-2026-02-08.json      # JSON data
    └── briefing-2026-02-08.html      # HTML preview
```

## 🔌 API Reference

### GET /api/briefings
List all available briefings with dates and timestamps.

**Response:**
```json
{
  "files": [
    {
      "date": "2026-02-08",
      "timestamp": 1707432000
    },
    {
      "date": "2026-02-07",
      "timestamp": 1707345600
    }
  ]
}
```

### GET /api/briefings/[date]
Get complete briefing data for a specific date.

**Parameters:**
- `date` (string): YYYY-MM-DD format

**Response:**
```json
{
  "date": "2026-02-08",
  "generatedAt": "2026-02-08T07:00:00.000Z",
  "sections": {
    "metrics": {
      "signups": 15,
      "signupsChange": 8,
      "demos": 5,
      "demosChange": 2,
      "trials": 2,
      "trialsChange": -1
    },
    "leads": {
      "hot": [
        {
          "name": "Forestville Eagles",
          "source": "Twitter mention",
          "temp": "hot",
          "score": 95
        }
      ]
    },
    "affiliates": {
      "topPerformers": [
        {
          "name": "Sarah Chen (TikTok)",
          "conversions": 5,
          "revenue": 2500
        }
      ]
    },
    "competitive": {
      "news": [
        {
          "title": "PlayerZone raises $5M Series A",
          "source": "TechCrunch",
          "date": "Today"
        }
      ]
    },
    "content": {
      "topPosts": [
        {
          "title": "5 Basketball Drills for Guard Development",
          "platform": "YouTube",
          "engagement": 2847
        }
      ]
    },
    "ops": {
      "blockers": ["Twitter API rate limits hitting daily"],
      "deployments": ["Kanban column reorganization"]
    },
    "calendar": {
      "events": [
        {
          "title": "Easter Classic Tournament Planning",
          "time": "10:00 AM",
          "attendees": "Michael, Coach Sarah"
        }
      ]
    },
    "weather": {
      "condition": "Partly Cloudy",
      "temp": 24,
      "humidity": 62,
      "forecast": "Clear skies with light winds. Perfect for outdoor training sessions."
    }
  }
}
```

## 🎨 Design System

Uses CourtLab's existing design system:
- **Colors**: `hyper-blue`, `velocity-orange`, `accent-green`, `accent-red`, etc.
- **Spacing**: Tailwind's standard scale (0.5rem increments)
- **Typography**: 
  - Headers: `font-display` (Outfit)
  - Body: `font-sans` (Inter)
  - Mono: `font-mono` (JetBrains Mono)
- **Dark theme**: `bg-primary` (#0f172a), `text-primary` (#f5f7f9)
- **Borders**: Subtle with `border-subtle` color
- **Radius**: `rounded-2xl` for major containers, `rounded-xl` for cards

### Components Used
- Custom `Surface` wrapper for consistent card styling
- Custom `Badge` for status indicators
- Custom `StatCard` for metrics display
- Lucide React icons throughout
- Tailwind CSS for all styling

## 🔄 Data Flow

```
daily-briefing.js (backend)
    ↓
    ├─ generateMetrics() 
    ├─ generateLeads()
    ├─ generateAffiliates()
    ├─ generateCompetitiveIntel()
    ├─ generateContentPerformance()
    ├─ generateOpsStatus()
    ├─ generateCalendarEvents()
    └─ generateWeather()
    ↓
Save to /courtlab-briefings/
    ├─ briefing-YYYY-MM-DD.json
    └─ briefing-YYYY-MM-DD.html
    ↓
Web UI (React)
    ├─ /api/briefings (list)
    ├─ /api/briefings/[date] (fetch)
    └─ /briefings page renders
```

## 🔗 Integration Points

### Navigation
The briefing link is included in `TopNav` at `/briefings` with a Newspaper icon.

### URL Routes
- **Main**: `/briefings` - Shows today's briefing
- **Archive**: Toggle within page
- **API**: `/api/briefings` and `/api/briefings/[date]`

### Database (Current)
Uses file system storage in `/data/.openclaw/workspace/courtlab-briefings/`

To migrate to a database:
1. Update API routes to query database instead of filesystem
2. Modify scripts to save to database
3. Keep JSON format for compatibility

## 📈 Extending the System

### Add a New Section
1. Create generator in `scripts/daily-briefing.js`:
```javascript
function generateNewSection() {
  return {
    // ... data
  }
}
```

2. Add to briefing in `generateBriefing()`:
```javascript
newSection: generateNewSection(),
```

3. Add UI in `src/app/briefings/page.tsx`:
```tsx
<div className="mb-8">
  <div className="mb-4 flex items-center gap-2">
    <IconComponent size={20} />
    <h2 className="text-xl font-bold text-text-primary">Section Title</h2>
  </div>
  <Surface>
    {/* Render data */}
  </Surface>
</div>
```

### Connect Real Data Sources
Edit the generator functions to fetch from APIs:
- Twitter API for content/leads
- Reddit API for social listening
- CRM API for metrics
- News API for competitive intel
- Weather API for forecasts

## 🚨 Troubleshooting

### Briefing not showing
1. Check API: `curl http://localhost:3000/api/briefings`
2. Verify files exist: `ls -la /data/.openclaw/workspace/courtlab-briefings/`
3. Check Next.js logs for errors

### Archive is empty
```bash
npm run briefing:samples  # Generate sample briefings
```

### Cron job not working
```bash
# Check cron is running
sudo systemctl status cron

# View cron logs
sudo journalctl -u cron -n 20

# Test command manually
cd /data/.openclaw/workspace/courtlabops-repo && npm run briefing:daily
```

## 📚 Documentation

- **Setup Guide**: See `BRIEFING_SETUP.md` for detailed configuration
- **Utilities**: See `src/lib/briefing-utils.ts` for helper functions
- **Generator**: See `scripts/daily-briefing.js` for data generation logic

## 🎯 Next Steps

- [ ] Connect to real Twitter API for leads
- [ ] Implement Reddit social listening
- [ ] Add CRM metrics integration
- [ ] Email delivery system
- [ ] Slack notifications
- [ ] Custom user preferences
- [ ] PDF export
- [ ] Scheduled briefing templates

## 📧 Questions?

Check `BRIEFING_SETUP.md` for common issues or see project README for team contact info.
