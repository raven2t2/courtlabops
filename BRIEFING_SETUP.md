# Daily Briefing System Setup Guide

The CourtLab Daily Briefing system provides automated morning strategic briefings with metrics, lead intelligence, affiliate performance, and operational status.

## Overview

### Features
- **Real-time Metrics**: Signups, demo requests, and trial activations from the last 24 hours
- **Lead Intelligence**: Hot prospects identified through social listening and Reddit monitoring
- **Affiliate Performance**: Top-performing affiliates with conversion metrics
- **Competitive Intel**: Youth sports technology news and funding announcements
- **Content Analytics**: Top-performing posts and engagement metrics
- **Operations Status**: Current blockers and deployment updates
- **Calendar Integration**: Today's scheduled calls and meetings
- **Weather**: Adelaide weather forecast with training recommendations

### Output
- **JSON Format**: Structured data for API consumption
- **HTML Format**: Beautiful standalone HTML preview
- **Web Interface**: Interactive React UI with archive search

## Installation

The briefing system is built into the CourtLab app. No additional dependencies are required.

## Usage

### Generate Today's Briefing

```bash
npm run briefing:daily
```

This generates:
- `/data/.openclaw/workspace/courtlab-briefings/briefing-YYYY-MM-DD.json`
- `/data/.openclaw/workspace/courtlab-briefings/briefing-YYYY-MM-DD.html`

### Generate Sample Archive (Last 7 Days)

```bash
npm run briefing:samples
```

Useful for testing the archive UI with historical data.

## Accessing the Briefing

### Web Interface
- Navigate to `/briefings` in the CourtLab app
- View today's briefing with all sections
- Click "View Archive" to search and browse past briefings

### API Endpoints

#### List all briefings
```
GET /api/briefings
```

Response:
```json
{
  "files": [
    {
      "date": "2026-02-08",
      "timestamp": 1707432000
    }
  ]
}
```

#### Get specific briefing
```
GET /api/briefings/2026-02-08
```

Response includes full briefing data with all sections.

## Scheduling with Cron

### Setup Daily Generation at 7:00 AM

```bash
# Open crontab editor
crontab -e

# Add this line (generates briefing daily at 7:00 AM Adelaide time)
0 7 * * * cd /data/.openclaw/workspace/courtlabops-repo && npm run briefing:daily >> /var/log/courtlab-briefing.log 2>&1
```

### Verify Cron Job
```bash
crontab -l
```

### Monitor Logs
```bash
tail -f /var/log/courtlab-briefing.log
```

## Data Sources

Currently, the system uses mock data generators for demonstration. To connect real data sources:

### Metrics
- Replace `generateMetrics()` with API calls to:
  - CRM signup database
  - Demo request tracking system
  - Trial activation log

### Leads
- Implement Twitter API integration via `twitter-api-v2`
- Add Reddit scraping via `snoowrap` or `pushshift`
- Connect social listening tools

### Affiliates
- Query affiliate database/API
- Calculate real conversion rates
- Track revenue attribution

### Competitive Intel
- Integrate news API (NewsAPI, Webhose, etc.)
- Add Google News alerts
- Monitor industry publications

### Content
- Connect Twitter Analytics API
- Integrate Instagram Insights
- Pull TikTok analytics
- YouTube Analytics API

### Weather
- Integrate Open-Meteo API (free, no key required)
- Or use weather.gov, Weather API, etc.

## Briefing Structure

Each briefing contains:

```json
{
  "date": "2026-02-08",
  "generatedAt": "2026-02-08T07:00:00.000Z",
  "sections": {
    "metrics": { ... },
    "leads": { ... },
    "affiliates": { ... },
    "competitive": { ... },
    "content": { ... },
    "ops": { ... },
    "calendar": { ... },
    "weather": { ... }
  }
}
```

## Customization

### Modify Sections
Edit `/scripts/daily-briefing.js`:
- `generateMetrics()` - Change metric definitions
- `generateLeads()` - Adjust lead sources and scoring
- `generateAffiliates()` - Modify affiliate tracking
- `generateCompetitiveIntel()` - Change news sources
- etc.

### Change Output Directory
Update `BRIEFINGS_DIR` in:
- `scripts/daily-briefing.js`
- `src/app/api/briefings/route.ts`
- `src/app/api/briefings/[date]/route.ts`

### Customize Colors
Update Tailwind classes in `/src/app/briefings/page.tsx`:
- `tone="green"`, `tone="blue"`, `tone="orange"` props
- Badge colors: `.badge-hot`, `.badge-warm`, etc.
- Chart/stat colors match CourtLab design system

## Troubleshooting

### Briefings not appearing in archive
1. Check directory exists: `ls -la /data/.openclaw/workspace/courtlab-briefings/`
2. Verify API endpoint: `curl http://localhost:3000/api/briefings`
3. Check browser console for errors

### Cron job not running
```bash
# Check cron logs
sudo journalctl -u cron -n 50

# Verify npm is in crontab PATH
which npm  # Get full path
# Update crontab to use full path: /usr/bin/npm run briefing:daily
```

### HTML not rendering correctly
1. Ensure HTML file was created: `ls -la /data/.openclaw/workspace/courtlab-briefings/briefing-*.html`
2. Open directly in browser to test
3. Check file permissions: `chmod 644 briefing-*.html`

## Files Reference

| File | Purpose |
|------|---------|
| `src/app/briefings/page.tsx` | Main UI component with archive |
| `src/app/api/briefings/route.ts` | List all briefings endpoint |
| `src/app/api/briefings/[date]/route.ts` | Get specific briefing endpoint |
| `scripts/daily-briefing.js` | Main briefing generator |
| `scripts/generate-sample-briefings.js` | Generate sample archive |
| `BRIEFING_SETUP.md` | This file |

## Future Enhancements

- [ ] Email delivery of briefings
- [ ] Slack integration with brief summaries
- [ ] Custom metrics configuration per user
- [ ] Real-time metric updates instead of 24h aggregation
- [ ] AI-powered insights and anomaly detection
- [ ] PDF export functionality
- [ ] Scheduled briefing templates
- [ ] Alert thresholds and notifications
- [ ] Multi-language support
- [ ] Dark/light theme toggle in briefing viewer

## Support

For issues or feature requests, contact the CourtLab team or check the project README.
