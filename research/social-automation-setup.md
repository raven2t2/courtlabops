# CourtLab Social Automation Setup Guide

## 🚀 FULLY AUTOMATED PIPELINE

Once set up, this runs daily with **zero manual work** from you:

1. **9:00 AM Daily** → Cron runs bird searches
2. **9:15 AM** → Process results, score leads, generate DMs
3. **9:30 AM** → You get a report with warm leads
4. **You approve** → I send the DMs (or queue them for you)

---

## SETUP CHECKLIST

### Step 1: Authenticate Bird (Twitter/X CLI)

**This is the only manual step needed.**

```bash
# Check if bird is installed
bird --version

# Check available cookie sources
bird check

# Test if authenticated
bird whoami
```

**If not authenticated:**

Bird uses cookie auth from your browser. Options:

**Option A: Chrome/Arc/Brave (Recommended)**
```bash
# Arc browser example
bird home --chrome-profile-dir "$HOME/Library/Application Support/Arc/User Data/Default"

# Chrome example
bird home --chrome-profile-dir "$HOME/Library/Application Support/Google/Chrome/Default"
```

**Option B: Direct cookie paste**
```bash
# Get cookies from browser dev tools:
# 1. Open twitter.com in browser
# 2. Open Dev Tools → Application → Cookies
# 3. Copy auth_token and ct0 values
# 4. Use:
bird whoami --auth-token YOUR_AUTH_TOKEN --ct0 YOUR_CT0
```

**Once authenticated, test:**
```bash
bird search "basketball Adelaide" -n 5
```

---

### Step 2: Enable Daily Automation

```bash
# Enable the cron job
openclaw cron update courtlab-social-listening --enabled true

# Or manually edit the job:
openclaw cron list
openclaw cron update courtlab-social-listening --patch '{"enabled":true}'
```

**What happens daily:**
- 9:00 AM: Run searches for affiliates and customers
- 9:15 AM: Process results, identify warm leads
- 9:30 AM: Generate DM templates
- You get notified with daily report

---

### Step 3: Review and Approve DMs

**Option A: Automated Approval (Recommended)**
```bash
# Review all pending leads
node /data/.openclaw/workspace/courtlabops-repo/scripts/approve-dms.js
```

This opens an interactive prompt:
- `[s]` Send DM (uses generated template)
- `[e]` Edit DM (customize before sending)
- `[r]` Reject/Skip
- `[q]` Quit

**Option B: Report Only (You send manually)**
Check the daily report file:
```bash
cat /data/.openclaw/workspace/courtlab-crm/social-leads/$(date +%Y-%m-%d)-report.json
```

Then manually send DMs via Twitter.

---

## AUTOMATION FILES

| File | Purpose |
|------|---------|
| `scripts/daily-social-listen.sh` | Daily Twitter searches |
| `scripts/process-social-leads.js` | Score leads, generate DMs |
| `scripts/approve-dms.js` | Interactive approval workflow |
| `social-listening/` | Raw search results (dated folders) |
| `social-leads/` | Processed leads with DM templates |

---

## SEARCH COVERAGE

### Affiliates (Coaches, Trainers, Creators)
- `basketball coach Adelaide`
- `basketball training Australia`
- `basketball skills coach`
- `basketball content creator`
- `basketball development`

### Target Customers (Clubs, Events)
- `basketball club Adelaide`
- `basketball association`
- `basketball trials`
- `basketball tournament`

### Competitors
- `HomeCourt app`
- `Ballogy`

---

## WARM LEAD SCORING

Leads are scored 0-100 based on:

| Factor | Points |
|--------|--------|
| Basketball keywords in post | +5 each |
| Engagement (likes/RTs) | +3-5 |
| Follower count (1K-50K) | +10 |
| Posted in last 24h | +5 |
| Red flags (crypto/NBA) | -20 |
| **WARM threshold** | **20+ points** |
| **HIGH VALUE** | **35+ points** |

---

## DM TEMPLATES (Auto-Generated)

Templates are customized by lead category:

**Coach/Trainer:** Value-first question about tracking tools  
**Content Creator:** Collaboration angle (combine content)  
**Club/Org:** Problem-solution (development tracking)  
**Event:** Value-add for their tournament  
**Parent:** Peer connection ("my son plays U12s")

---

## REDDIT AUTOMATION (Bonus)

Twitter/X is primary, but Reddit can be automated too:

```bash
# Monitor subreddits via RSS/web
# r/basketball, r/BasketballTips, r/Adelaide

# TODO: Add Reddit monitoring script
```

---

## SAFETY & LIMITS

**Rate Limiting:**
- Searches: 30 results per query, 10 queries = 300 tweets/day
- DMs: Manual approval required (no automated sending)
- Cooldown: Built into bird CLI

**Quality Control:**
- All DMs require your approval before sending
- Red flag filtering (crypto, gambling, etc.)
- Score threshold (20+ to qualify as warm)

---

## DAILY REPORT EXAMPLE

```json
{
  "date": "2026-02-07",
  "totalTweetsScanned": 300,
  "warmLeadsFound": 12,
  "highValueLeads": 3,
  "byCategory": {
    "affiliate_coach": 4,
    "affiliate_creator": 2,
    "customer_club": 3,
    "customer_event": 2,
    "customer_parent": 1
  },
  "topLeads": [
    {
      "handle": "hoopscoach_adl",
      "name": "Adelaide Hoops Coach",
      "score": 42,
      "category": "affiliate_coach",
      "followers": 3240,
      "snippet": "Frustrated with tracking player progress..."
    }
  ],
  "outputFile": "/data/.openclaw/workspace/courtlab-crm/social-leads/2026-02-07-leads.json"
}
```

---

## YOUR ACTION ITEMS

### Today (5 minutes)
1. [ ] Authenticate bird: `bird check && bird whoami`
2. [ ] Test search: `bird search "basketball Adelaide" -n 5`
3. [ ] Enable cron: `openclaw cron update courtlab-social-listening --enabled true`

### Tomorrow
1. [ ] Check daily report: `cat social-leads/$(date +%Y-%m-%d)-report.json`
2. [ ] Review leads: `node scripts/approve-dms.js`
3. [ ] Approve/send DMs

### Ongoing
- Daily: Review and approve DMs (5-10 minutes)
- Weekly: Check metrics, adjust search terms if needed

---

## FILES PUSHED TO REPO

- `scripts/daily-social-listen.sh` — Search automation
- `scripts/process-social-leads.js` — Lead scoring & DM generation
- `scripts/approve-dms.js` — Approval workflow
- `research/social-listening-strategy.md` — Full strategy doc
- `research/social-automation-setup.md` — This file

---

**Ready to activate?** Run the setup commands above and confirm bird is working, then I enable the daily automation.
