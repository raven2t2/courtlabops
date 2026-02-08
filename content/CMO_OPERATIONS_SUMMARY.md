# Chief Marketing Officer + Sales + Lead Project Manager Operations

**Status:** 🟢 LIVE  
**Deployed:** 2026-02-08 21:10 ACDT  
**Updated:** Vercel auto-deploy in progress

---

## Your Three Operating Workflows

### 1️⃣ Approval Queue (Social + Email + Affiliate Outreach)

**Location:** `/content/APPROVAL_QUEUE.md` (Vercel live)

**What's Waiting for You:**
- **6 Twitter/X posts** (@CourtLabApp + @EstherCourtLab) — ready to copy/paste
- **8 Affiliate DMs** — personalized outreach to coaches, media, brands
- **4 Email outreach templates** — SA club secretaries (incl. warm lead: Zane's club)

**Your Workflow:**
1. Read `/content/APPROVAL_QUEUE.md`
2. For each item: ✅ Approve or 💬 Request revisions
3. I execute immediately (post, send DM, send email)
4. I log everything in `/content/sent` with timestamp

**Cadence:**
- Twitter: 1-3 posts/day (morning, midday, evening)
- Affiliate DMs: 3-5/week (batch approval)
- Email: 2-5/week (club secretaries)

---

### 2️⃣ Kanban Dashboard (Your Task Queue)

**Location:** https://courtlabops.vercel.app (live)

**New Column Added:** ⏳ **Awaiting Your Approval** (top priority)

**What's in Your Queue Right Now:**
- 18 approval tasks (Twitter, DMs, emails) — all assigned to you
- Status shows which need your action vs. in-progress

**Dashboard Structure:**
```
⏳ Awaiting Your Approval (18 items) ← YOU ARE HERE
📋 Drafted (10 SA clubs) → next stage: approve + send outreach
📤 Sent → awaiting responses
💬 Replied → conversations active
📅 Meeting Scheduled → next step
✅ Closed - Won → won deals
❌ Closed - Lost → archived
```

**API Endpoint (Live):**
```
GET https://courtlabops.vercel.app/api/kanban
```
Returns full board state with all tasks assigned to Michael.

---

### 3️⃣ Daily Lead Pipeline (6 Sources)

**Location:** `/data/crm/lead-pipeline-daily.json` (Vercel API)

**Lead Sources (34 Total, Target: 90+):**

| Source | Count | Target | Priority | Status |
|--------|-------|--------|----------|--------|
| **SA Clubs (District)** | 10 | 15 | HIGHEST | Drafted |
| **Affiliates (Micro-influencers)** | 8 | 25 | HIGH | DMs drafted |
| **Combine Sponsors** | 5 | 10 | HIGH | Researching |
| **Coach Prospects** | 4 | 20 | HIGH | Monitoring |
| **Facilities/Gyms** | 2 | 10 | MEDIUM | New |
| **End Users (Players/Parents)** | 3 | Unlimited | MEDIUM | Organic |
| **Media/Podcasts/Events** | 2 | 10 | MEDIUM | Researching |

**Daily Workflow:**
- ✅ Generate 10+ new leads daily (auto-feed pipeline)
- ✅ Research & qualify each lead (score, fit reason, contact)
- ✅ Build outreach draft (email, DM, comment)
- ✅ Queue for your approval in `/content/APPROVAL_QUEUE.md`
- ✅ Execute immediately upon approval

**Next Actions (Raven):**
- Monitor Twitter/Reddit daily for pain point signals
- Research missing contact info (phone, emails, social)
- Build outreach variations for different lead types
- Track response rates and move leads through funnel

---

## Approval Workflow — Step by Step

### For Twitter Posts:
1. I draft tweet
2. Queue in `APPROVAL_QUEUE.md` under "Twitter Drafts"
3. You review → ✅ Approve or 💬 Revise
4. I post immediately to @CourtLabApp or @EstherCourtLab
5. I log in `/content/sent/twitter-[date].json`

### For Affiliate DMs:
1. I research prospect (followers, niche, fit angle)
2. Draft personalized DM (references their work/audience)
3. Queue in `APPROVAL_QUEUE.md` under "Affiliate Outreach"
4. You review → ✅ Approve or 💬 Revise
5. I send DM from your account
6. I track response in kanban (moved to "replied" when they respond)

### For Email Outreach:
1. I research club (size, programs, sponsors, pain points)
2. Draft personalized email (specific fit reason, no generic copy)
3. Queue in `APPROVAL_QUEUE.md` under "Email Outreach"
4. You review → ✅ Approve or 💬 Revise
5. I send from Michael@courtlab.app
6. I track responses and follow-ups

---

## Data Architecture (Live & Dynamic)

**All systems pull from JSON sources:**

| Data | Location | API Endpoint | Updates |
|------|----------|--------------|---------|
| Kanban Board | `data/crm/kanban/board.json` | `/api/kanban` | Real-time |
| Leads | `data/crm/leads/sa-basketball-clubs.json` | `/api/leads` | Daily |
| Affiliates | `data/crm/affiliate-leads-v1.json` | `/api/affiliates-complete` | Daily |
| Coaches | `data/crm/coaches/coach-prospects.json` | `/api/coaches` | Daily |
| Sponsors | `data/crm/sponsors.json` | `/api/sponsors` | Daily |
| Lead Pipeline | `data/crm/lead-pipeline-daily.json` | Custom endpoint | Daily |

**No hardcoded data.** Everything updates via JSON push → Vercel auto-deploy.

---

## Your Daily Rhythm (Suggested)

### Morning (10 min):
- Check `/content/APPROVAL_QUEUE.md` for overnight batch
- ✅ Approve tweets + DMs for today
- I post/send immediately

### Afternoon (10 min):
- Check Telegram for intelligence reports (Reddit, Twitter monitoring)
- Review any new lead research
- Request changes if needed

### Evening (Optional):
- Check kanban for conversation updates
- Plan tomorrow's approvals

**Total time:** ~20 min/day for full oversight

---

## What I'm Doing (Raven, CMO/Sales/PM)

### Daily:
- ✅ Monitor Twitter + Reddit for basketball pain points
- ✅ Identify 10+ new leads (clubs, coaches, sponsors, affiliates, facilities)
- ✅ Research & qualify (fit reason, contact, angle)
- ✅ Draft outreach (email, DM, Twitter comment)
- ✅ Queue for your approval

### Weekly:
- ✅ Track outreach responses (move leads through kanban)
- ✅ Generate performance reports (opens, clicks, conversions)
- ✅ Adjust strategy based on what's working
- ✅ Research new sponsor + facility opportunities

### On Approval:
- ✅ Post to Twitter (manual, via web interface)
- ✅ Send DMs (personalized, with context)
- ✅ Send emails (addressed, specific fit reason)
- ✅ Log in CRM + kanban (track stage)

---

## Files Structure (Repo Deployed to Vercel)

```
courtlabops-repo/
├── content/
│   ├── APPROVAL_QUEUE.md ← YOU READ THIS DAILY
│   ├── CMO_OPERATIONS_SUMMARY.md (this file)
│   └── sent/ (I log executed items here)
│
├── data/crm/
│   ├── kanban/board.json (v1.2 — includes awaiting-approval column)
│   ├── leads/sa-basketball-clubs.json (10 clubs drafted)
│   ├── affiliate-leads-v1.json (8 prospects drafted)
│   ├── coaches/coach-prospects.json (4 coaches drafted)
│   ├── sponsors.json (5 sponsors researching)
│   └── lead-pipeline-daily.json (34 total, 6 sources)
│
├── src/app/api/
│   ├── kanban/route.ts (serves /api/kanban)
│   ├── leads/route.ts (serves /api/leads)
│   ├── affiliates-complete/route.ts (serves /api/affiliates)
│   ├── coaches/route.ts (serves /api/coaches)
│   └── sponsors/route.ts (serves /api/sponsors)
```

---

## Key Metrics to Track

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| **Approval Queue Items** | 20+ | 18 | ✅ On track |
| **Daily New Leads** | 10+ | 14 | ✅ Above target |
| **SA Clubs Drafted** | 15 | 10 | ⏳ Growing |
| **Affiliates Identified** | 25 | 8 | ⏳ Growing |
| **Emails Sent** | 5/week | 0 | ⏳ Awaiting approval |
| **Affiliate DMs Sent** | 5/week | 0 | ⏳ Awaiting approval |
| **Twitter Posts** | 7/week | 0 | ⏳ Awaiting approval |
| **Pipeline Total** | 90+ | 34 | ⏳ Target |

---

## Next Actions

### For Michael (You):
1. ✅ Open `/content/APPROVAL_QUEUE.md` (takes 15-20 min to review)
2. ✅ Comment with approvals/revisions for top items
3. ✅ I execute immediately (post, send, email)

### For Raven (Me):
1. ✅ Monitor Twitter + Reddit for daily signals
2. ✅ Generate 10+ new leads + research daily
3. ✅ Build approval queue for tomorrow
4. ✅ Execute all approvals same day

### For Kanban:
- Today: 18 approval items (your queue)
- Tomorrow: +10-15 new leads added (from daily research)
- Weekly: Move leads from drafted → sent → replied → won

---

## Critical Rule

**Everything lives in `/content/APPROVAL_QUEUE.md` until you approve it.**

- No posting without your sign-off
- No sending DMs without your sign-off
- No emails without your sign-off
- All drafts queue here for review

**When you approve:** "✅ Approved" comment → I execute in next 30 minutes

---

**Status:** 🟢 LIVE and waiting for your approvals  
**Deployment:** Vercel (auto-sync on git push)  
**Last Updated:** 2026-02-08 21:10 ACDT  
**Next Sync:** Daily at midnight ACDT
