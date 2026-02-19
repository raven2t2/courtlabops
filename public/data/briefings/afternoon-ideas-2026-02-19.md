# ⚡ CourtLab Afternoon Marketing Ideas — Feb 19, 2026

**Generated:** 3:00 PM Adelaide time | **Execution Window:** 3 PM - 5 PM (2-3 hours)  
**Series B Narrative:** Demonstrate product-market fit through high-velocity outreach + operational excellence  
**Current App Status:** 30 users (0 trials, 0 paid) — need conversion proof point urgently

---

## IDEA #1: "Easter Classic Live Leaderboard" CMS Integration (Product Demo Asset + PR Win)

**Execution Time:** 2 hours | **Impact:** High-signal proof of product-market fit for Series B

### The Move

Build a **live leaderboard template** for Easter Classic (April 4-6) — coaches can plug in real player combine data during the tournament. Create demo page → showcase to Easter Classic organizers + coaches → multiplied visibility for launch.

**Why This Matters for Series B:**
- **Product validation:** Shows coaches *can* use CourtLab in real tournaments (not just training)
- **Revenue proof:** Tournament organizers might buy → new B2B customer segment unlocked
- **Media angle:** "First youth basketball tournament with live objective metrics" = founder authority + press
- **User acquisition:** Every coach at Easter Classic = potential trial convert

### Technical Execution

**Step 1: Build Template Page (45 min)**
- Clone existing `/courtlab-crm/content/leaderboard-template.html` (if exists) or create new
- Structure:
  ```html
  <div class="tournament-leaderboard">
    <h2>Easter Classic 2026 Combine Metrics</h2>
    <div class="filters">
      <select id="club">All Clubs</select>
      <select id="metric">Vertical Jump | 40-yard | Lane Agility | Ball Handle</select>
    </div>
    <table id="rankings">
      <!-- populated via CSV import -->
    </table>
    <footer>Powered by CourtLab</footer>
  </div>
  ```
- Make it **self-service:** coaches paste CSV, leaderboard populates
- Add CourtLab branding (logo, color, "Verify Your Talent" CTA)

**Step 2: Deploy to courtlabops.vercel.app (30 min)**
- Add new route `/tournaments/easter-classic-2026`
- Link from dashboard (Campaigns → Events → Easter Classic)
- Create shareable QR code for physical tournament printouts

**Step 3: Outreach Package (45 min)**
- Email Easter Classic organizers + top 5 coaches:
  - Screenshot of demo leaderboard
  - "We built this specifically for Easter Classic. Coaches can track real metrics live."
  - Offer: Free Pro for the tournament + feature them as partners
  - Ask: "Can we integrate this into your event site?"
- Create tweet draft: "Easter Classic coaches can now verify player metrics in real-time. Live leaderboard available here [link]. First tournament with CourtLab."

### PR Hook
Position as: **"CourtLab Launches First Live Youth Tournament Analytics Integration"** → founder article, local sports tech press

### Success Metrics
- Easter Classic organizers respond (1-week)
- 5+ coaches request access
- 10+ trial signups from tournament promotion (track via campaign code)

---

## IDEA #2: "Lead Scoring + Outreach Automation" Kanban Enhancement (Ops Multiplier)

**Execution Time:** 1.5 hours | **Impact:** Enable 3x faster affiliate/coach pipeline execution

### The Move

Automate the **outreach workflow** in kanban that's currently manual: 
1. New lead added → auto-score based on existing affiliate-scored-manifest.json
2. Score shows immediately in kanban
3. Pre-populate outreach draft based on club type (regional assoc, travel club, gym, etc.)
4. Track response rates per segment

**Why This Matters for Series B:**
- **Operational excellence:** Shows investors you can scale partner acquisition without hiring
- **Data-driven GTM:** Scores reveal what segments convert (founders love this)
- **Async execution:** Michael can approve 10 leads/day instead of 3 manual outreaches
- **Repeatable playbook:** First step toward franchise playbook (for eventual resellers)

### Technical Execution

**Step 1: Score Mapping in Kanban (30 min)**
- Read `/data/.openclaw/workspace/courtlab-crm/affiliates/affiliate-scored-manifest.json`
- Extract scoring logic: size, region, coach networks, event presence
- Create mapping function:
  ```javascript
  function scoreNewLead(clubData) {
    let score = 0;
    if (clubData.size > 50 teams) score += 30;
    if (clubData.region === 'SA') score += 20; // target region
    if (clubData.eventHost === true) score += 25;
    if (clubData.hasCoachNetwork === true) score += 15;
    return { score, tier: score > 70 ? 'PRIORITY' : score > 50 ? 'WARM' : 'COLD' };
  }
  ```

**Step 2: Kanban UI Update (30 min)**
- Add scoring badge to each lead card (PRIORITY | WARM | COLD)
- Color-code: Red (PRIORITY) | Yellow (WARM) | Gray (COLD)
- Show score breakdown on hover: "Size: +30, Region: +20, Events: +25 = 75"
- Add sort by score (drag tasks into score-based lanes)

**Step 3: Auto-Draft Outreach (30 min)**
- Create outreach template library by club type:
  - **Regional Assoc:** "We partner with regional basketball associations..."
  - **Travel Club:** "Your club evaluates talent constantly. We help coaches know..."
  - **Gym/Training Center:** "Parents invest in your facility. We give them proof it works..."
  - **Event Host:** "Easter Classic coaches need objective metrics. Here's how..."
- When lead added, suggest template based on classification
- Make it editable (not locked)

**Step 4: Response Tracking (15 min)**
- Add "Outreach Sent" date field to kanban
- Track response in 7-day window
- Report: "SA-001 (Forestville): Sent Feb 19 3:15 PM → Response Rate TBD"

### Implementation (Existing Files)
- Edit `/data/.openclaw/workspace/courtlab-crm/kanban/board.json`
- Update /data/.openclaw/workspace/courtlab-crm/react app (component adding scoring badge)
- Commit: `Afternoon ops (Feb 19 3 PM): Add lead scoring + auto-draft outreach templates`

### Success Metrics
- All 34 existing leads get automatic scores (should take <5 min)
- Response rate tracking shows which segments convert best
- Michael can qualify leads 3x faster (visual priority = instant clarity)
- Prove repeatable affiliate playbook (data for Series B)

---

## Summary: Why These Two Work

| Metric | Idea #1 (Leaderboard) | Idea #2 (Kanban Scoring) |
|--------|----------------------|--------------------------|
| **Time to Execute** | 2 hours | 1.5 hours |
| **Series B Signal** | Product-market fit (tournament use case) | Operational excellence (scale without headcount) |
| **User Acquisition** | Direct (Easter Classic coaches) | Indirect (faster outreach = more conversions) |
| **Complexity** | Medium (HTML template + deploy) | Medium (JSON scoring + UI badge) |
| **Dependencies** | None (build independently) | None (build independently) |
| **Repeatable** | Yes (template for future tournaments) | Yes (scoring system reusable for events, sponsors) |

**Execute in parallel:** Start Idea #1 build while Idea #2 specs are written. Both done by 5:30 PM Adelaide time.

**Next steps:** 
- PR #1: `feature/easter-classic-leaderboard` 
- PR #2: `ops/kanban-lead-scoring`
- Both ready for Michael's 4 PM review

---

**Briefing saved:** `/data/.openclaw/workspace/courtlab-briefings/afternoon-ideas-2026-02-19.md`  
**Next sync:** Run `bash scripts/sync-briefings-to-web.sh` to push to website
