# CourtLab Complete Monitoring System

## 🎯 FULL COVERAGE OVERVIEW

You now have **24/7 automated monitoring** across all channels:

| Source | What It Finds | When It Runs |
|--------|---------------|--------------|
| **Twitter/X** | New affiliate prospects, customers, warm leads | 9:00 AM daily |
| **Reddit** | Community discussions, pain points, opportunities | 10:00 AM daily |
| **Lead Activity** | Existing contacts' posts, engagement signals | 11:00 AM daily |
| **Intelligence Report** | Aggregated actions and priorities | 12:00 PM daily |

---

## 📊 MONITORING SCHEDULE (Sydney/Adelaide Time)

```
09:00 AM → Twitter Search (10 queries, ~300 tweets)
10:00 AM → Reddit Scan (8 subreddits, ~400 posts)
11:00 AM → Lead Activity Check (existing contacts)
12:00 PM → Daily Intelligence Report (compiled actions)
```

**Your time investment:** 10-15 minutes reviewing the 12 PM report, approving DMs

---

## 🔍 WHAT EACH MONITOR DOES

### 1. Twitter Monitor (`daily-social-listen.sh`)
**Searches for:**
- Basketball coaches in Adelaide
- Basketball training in Australia
- Content creators
- Clubs and associations
- Tournaments and trials
- Competitors (HomeCourt, Ballogy)

**Outputs:**
- Warm leads (20+ point score)
- High-value leads (35+ points)
- Auto-generated DM templates
- Ready-to-send messages

---

### 2. Reddit Monitor (`reddit-monitor.js`)
**Scans subreddits:**
- r/basketball
- r/BasketballTips
- r/basketballcoach
- r/youthsports
- r/Adelaide
- r/melbourne
- r/sports
- r/SportsAnalytics

**Looks for keywords:**
- "basketball training"
- "basketball coach"
- "youth basketball"
- "track stats"
- "player development"
- "basketball combine"
- "tryouts"
- "coaching advice"
- "Australia basketball"

**Outputs:**
- Warm posts (score 20+)
- Suggested outreach comments
- Author information for DM follow-up

---

### 3. Lead Activity Tracker (`lead-activity-tracker.js`)
**Monitors your existing leads:**
- Coaches discovered yesterday
- Clubs in your database
- Potential affiliates
- Sponsor contacts

**Tracks signals:**
- 😤 Frustration ("struggling with...")
- 🆘 Seeking help ("looking for advice...")
- 📅 Upcoming events ("announcement...")
- 🎉 Celebrations ("proud of our team...")
- 💬 Engagement ("what do you think...")

**Generates:**
- Updated outreach based on their recent posts
- Priority scoring (high/medium/low)
- Context-aware DMs

---

### 4. Intelligence Report (`daily-intelligence-report.js`)
**Compiles everything into:**
- Summary of all leads found
- Top opportunities by priority
- Immediate actions (do now)
- Today's tasks
- This week's follow-ups

**Example output:**
```
⚡ IMMEDIATE ACTIONS
   1. [DM_TWITTER] Send high-value lead DM
      Target: @coach_john
      Preview: "Hey John, saw your post about..."
   
   2. [DM_TWITTER] Respond to frustration signal
      Target: @melrose_bball
      Preview: "Saw your post about struggling with..."

📅 TODAY'S TASKS
   1. [COMMENT_REDDIT] Engage with value-first comment
      Target: u/bballparent23 on r/basketball
      Context: "Looking for training advice..."
```

---

## 📁 FILE STRUCTURE

```
courtlab-crm/
├── social-listening/           # Raw Twitter search results
│   └── 2026-02-07/
│       ├── coach-adelaide.json
│       ├── club-adelaide.json
│       └── ...
├── social-leads/               # Processed Twitter leads
│   ├── 2026-02-07-leads.json
│   ├── 2026-02-07-report.json
│   └── sent/                   # Approved & sent DMs
├── reddit-monitoring/          # Reddit findings
│   ├── 2026-02-07-reddit-posts.json
│   └── 2026-02-07-reddit-report.json
├── lead-activity/              # Existing lead tracking
│   ├── 2026-02-07-activity.json
│   └── 2026-02-07-summary.json
└── intelligence-reports/       # Daily compiled reports
    └── 2026-02-07-report.json
```

---

## 🚀 AUTOMATION STATUS

| Component | Status | Next Run |
|-----------|--------|----------|
| Twitter Search | ✅ Enabled | Tomorrow 9:00 AM |
| Reddit Monitor | ✅ Enabled | Tomorrow 10:00 AM |
| Lead Activity | ✅ Enabled | Tomorrow 11:00 AM |
| Intelligence Report | ✅ Enabled | Tomorrow 12:00 PM |

---

## 📧 GMAIL INTEGRATION

Your Gmail (`courtlaibestherbot@gmail.com`) can be used for:
- Google Alerts (basketball + Adelaide + Australia)
- Email outreach to clubs (via Himalaya or API)
- Calendar invites for calls
- Google Sheets exports

**To set up:**
1. Use the `google-sheets` skill already in workspace
2. Configure Himalaya for email CLI
3. Set up Google Alerts and forward to your Gmail

---

## 🎯 IMMEDIATE NEXT STEPS

### Today (You):
1. ✅ Review today's Twitter leads (5 found)
2. ✅ Review Reddit results (scanning now)
3. ✅ Approve high-priority DMs to send

### Tomorrow (Automated):
1. 9:00 AM → New Twitter search runs
2. 10:00 AM → Reddit scan completes
3. 11:00 AM → Lead activity checked
4. 12:00 PM → You get compiled report

### This Week:
- Monitor which outreach gets responses
- Adjust keywords if needed
- Add new club contacts to tracking
- Review sponsor research updates

---

## 📊 EXPECTED RESULTS

| Metric | Daily Target | Weekly |
|--------|--------------|--------|
| Twitter leads | 5-15 warm | 35-100 |
| Reddit posts | 3-8 warm | 20-50 |
| Activity signals | 2-5 high-priority | 15-30 |
| DMs sent | 5-10 (your choice) | 35-70 |
| Conversations | 2-5 | 15-30 |

---

## 🛡️ SAFETY & QUALITY

- ✅ **Manual DM approval** — No automated sending
- ✅ **Rate limiting** — Respects platform limits
- ✅ **Context-aware** — DMs reference actual posts
- ✅ **Quality scoring** — Only 20+ point leads qualify
- ✅ **Signal detection** — Prioritizes real opportunities

---

## 🔧 CUSTOMIZATION

### Add More Keywords
Edit the scripts to add keywords:
- `scripts/daily-social-listen.sh` — Twitter search terms
- `scripts/reddit-monitor.js` — Reddit keywords
- `scripts/lead-activity-tracker.js` — Activity signals

### Adjust Timing
```bash
# View all cron jobs
openclaw cron list

# Modify schedule
openclaw cron update courtlab-social-listening --patch '{"schedule":{"kind":"cron","expr":"0 8 * * *"}}'
```

### Add More Subreddits
Edit `scripts/reddit-monitor.js`:
```javascript
const SUBREDDITS = [
  'basketball',
  'BasketballTips',
  // Add more here
];
```

---

## 📱 HOW YOU INTERACT

### Daily (10-15 min):
1. Check Telegram at 12 PM for intelligence report
2. Review immediate actions
3. Run approval script: `node scripts/approve-dms.js`
4. Approve DMs to send

### Weekly (30 min):
1. Review all sent DMs and responses
2. Update CRM with conversation outcomes
3. Adjust strategy based on what's working
4. Add new leads to tracking

---

## FILES PUSHED TO REPO

- `scripts/daily-social-listen.sh` — Twitter automation
- `scripts/process-social-leads.js` — Lead scoring
- `scripts/approve-dms.js` — DM approval workflow
- `scripts/reddit-monitor.js` — Reddit scanning
- `scripts/lead-activity-tracker.js` — Lead monitoring
- `scripts/daily-intelligence-report.js` — Master report
- `research/complete-monitoring-system.md` — This file

---

**Status: FULLY OPERATIONAL** 🚀

All systems running. You'll get your first complete intelligence report tomorrow at 12 PM.
