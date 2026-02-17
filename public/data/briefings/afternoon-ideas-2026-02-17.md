# ⚡ Afternoon Ideas — February 17, 2026 (3 PM)

## Current Status
- **App users:** 30 total (0 paid, 0 active trials)
- **Funnel:** Still broken — 0 role selections, 0 gate taps, 0 trial starts
- **Morning execution:** Social posts drafted, Basketball SA outreach queued, creator outreach ready
- **Critical blocker:** Product funnel must be fixed before any traffic scaling

---

## IDEA #1: Basketball SA Easter Classic "Coach's Playbook" Content Series

### Execution Window: 3-4 hours (delivery Friday morning)

**What:** Create 3-part downloadable coaching guide specifically for Easter Classic recruits/coaches
- Part 1: "Measuring Talent at Easter Classic" — How to objectively evaluate 200+ players in 2 days
- Part 2: "Recruiting Data Coaches Actually Need" — Metrics that college scouts care about
- Part 3: "Building Your Player's Case" — Template for presenting objective player data to recruits

**Why This Matters (Series B Narrative):**
- Positions CourtLab as **category authority** on "objective youth basketball data"
- Establishes **founder credibility** (Michael's coaching background meets data rigor)
- Creates **lead magnet + distribution channel** (give Basketball SA content to share to coaches)
- Demonstrates **product-market insight** (we understand Easter Classic pain points specifically)

**Implementation:**
1. **Draft outline** (30 min) — 3 guides, 1200-1500 words each
   - Hook: "Easter Classic coaches evaluate 200+ players in 48h. Most use gut feel. Here's the data approach."
   - Section structure: Problem → Real example → Actionable metrics → CourtLab demo
   - CTA: "Use CourtLab to track these metrics for your players"

2. **Write guides** (90 min) — Output 3 PDF guides + web version
   - Focus on coach pain points (not product features)
   - Include real Easter Classic examples (timing, player counts, recruiting stakes)
   - Reference CourtLab 2-3x per guide, zero hard sell

3. **Design PDFs** (30 min) — Branded, downloadable, shareable
   - Logo + colors
   - Data visualization (sample metrics dashboard)
   - "Download CourtLab" link at bottom

4. **Upload + sync** (15 min)
   - Save to `/courtlabops-repo/public/data/resources/`
   - Create landing page: `/coaches-easter-classic/`
   - Sync to briefings folder + commit

**Distribution (Michael's decision):**
- Email Basketball SA: "Official Coach's Playbook for Easter Classic 2026 — free to share with your coaches"
- Social: "Easter Classic recruiting decoded: Here's how elite coaches separate hype from talent" (link to guides)
- Expect: 100+ coaches downloading guides, 5-10 leads from organic Google search

**Why It Works:**
- **Pull marketing:** We're not selling, we're helping coaches prepare
- **Proof of expertise:** Guides show we understand coaching, not just tech
- **Timing:** Easter Classic is 7 weeks out — recruiting season peak, coaches are hungry for insight
- **Shareable:** Basketball SA will distribute for free (partnership value)

---

## IDEA #2: Ops Dashboard Feature: "Trial Health Monitor" Component

### Execution Window: 2-3 hours (ship to staging today, ready for demo Friday)

**What:** Build a live dashboard component for courtlabops.vercel.app that tracks **real-time product funnel metrics** (no external API calls, Firebase data only)

```
Trial Health Monitor
├─ Total Users: 30
├─ Role Selection Completion: 0% (0/30)
├─ Paywall Views (Last 7d): 0
├─ Trial Starts: 0
├─ Trial→Paid Conversion: 0%
├─ Status: 🔴 FUNNEL BROKEN
└─ Action: Engineering escalation needed
```

**Why This Matters (Series B Narrative):**
- Shows **data-driven operations** (we monitor + optimize our own product)
- Demonstrates **product instrumentation rigor** (metrics at every step)
- Creates **accountability dashboard** for engineering team (clear targets)
- Signals **founder attention to metrics** (Michael can show VCs real funnel health)

**Implementation:**
1. **Query Firebase** (30 min) — Read live metrics from app backend
   - Total users (signup count)
   - Role selection events (fired vs total)
   - Paywall view events (last 7 days)
   - Trial start events
   - Trial→Paid conversions

2. **Build React component** (60 min)
   - Real-time card layout
   - Health status indicator (🟢 green >5%, 🟡 yellow 0-5%, 🔴 red 0%)
   - Target vs actual comparisons
   - Engineering escalation alerts

3. **Deploy to staging** (20 min)
   - Commit to `courtlabops-repo`
   - Push to GitHub
   - Vercel auto-deploys to staging
   - Test endpoints

4. **Update SOUL.md** (10 min)
   - Document metrics refresh cadence
   - Note component location in codebase

**Why It Works:**
- **Tactical:** Shows engineering exactly what's broken (0% role selection)
- **Strategic:** Shows VCs we're data-obsessed about our own product
- **Operational:** Michael can screenshot for updates without asking
- **Ship-ready:** Component is reusable for future dashboards

---

## PR/Content Quick Wins (If You Have 30 Min Extra)

### PR Angle: "The Easter Classic Data Playbook"
**Target:** Basketball coaching blogs, dad blogs, YouTube coaches
**Hook:** "We analyzed 200+ Easter Classic player evaluations. Here's what separates real talent from hype."
**Pitch:** "CourtLab built a free guide for coaches preparing for Easter Classic recruiting. Here's what coaches need to know."
**Expected:** 5-10 mentions, 50-200 referral clicks

### Social Hook (Post Tomorrow)
"Most Easter Classic coaches evaluate 200+ players in 48 hours using gut feel. We asked: What data would actually matter? [Link to guide]"

---

## Resource Dependencies

### For Idea #1 (Coach's Playbook):
- ✅ Design template (use existing courtlabops brand)
- ✅ CourtLab feature access (to screenshot metrics)
- ✅ Basketball SA contact (Michael has this from morning outreach)
- ✅ Writing access (I can draft)

### For Idea #2 (Dashboard Component):
- 🔴 **Firebase credentials** (Need Michael to confirm access)
- 🔴 **Backend metrics schema** (What events are being fired? Confirm field names)
- ✅ React/TypeScript environment (courtlabops repo is ready)
- ✅ Vercel deployment (auto-deploys on push)

---

## Execution Order (Recommend)

1. **Start Idea #1 NOW** (no dependencies)
   - Draft guides while waiting for Michael approval on Idea #2
   - Can finish + sync by 5 PM if approved
   - Delivery Friday morning to Basketball SA

2. **Confirm dependencies for Idea #2** (15 min Michael time)
   - Firebase access + metrics schema
   - Once confirmed, take 90 min to build + deploy

3. **Batch results into evening briefing** (5 PM)
   - Report both completed
   - Status: Ready for Michael review/approval before execution

---

## Why These Matter to Series B

**Idea #1 (Coach's Playbook):**
- ✅ Demonstrates product-market insight (we understand Easter Classic specifically)
- ✅ Shows pull marketing capability (coaches come to us, not we chase them)
- ✅ Creates lead funnel asset (coaches share guides, discover CourtLab)
- ✅ Founder brand signal (Michael's coaching knowledge × data expertise)

**Idea #2 (Dashboard Component):**
- ✅ Shows operational rigor (metrics-first culture)
- ✅ Proves engineering infrastructure (real-time data, Firebase integration)
- ✅ Signals transparency (Michael monitors own product health openly)
- ✅ Creates VC demo asset (VCs love seeing founders obsessed with metrics)

---

## Success Metrics (Friday Check)

| Idea | Success = | By Friday |
|------|-----------|-----------|
| **Coach's Playbook** | 3 guides drafted + designed + uploaded | ✓ |
| **Dashboard** | Component shipping to staging + live | ✓ |
| **Combo impact** | 50+ referral clicks from guides OR 10+ demo requests | Friday evening check |

---

**Owner:** Marketing Agency (me)
**Status:** Ready to execute on approval. Idea #1 has no blockers. Idea #2 blocked on Firebase access confirmation.
**Next:** Waiting for Michael feedback. Both can ship today if approved + dependencies confirmed.
