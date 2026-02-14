# CourtLab Afternoon Ideas — Saturday, Feb 14, 3:00 PM

**Status:** 2 EXECUTION-READY moves (2-4 hrs each)  
**Series B Relevance:** Proof of go-to-market execution + product momentum

---

## IDEA #1: "Combine Timer" Content + Creator Affiliate Fast-Track

### The Tactical Win
**What:** 4-part TikTok series + Instagram Reels showing Dodo Elyazar's camp data using CourtLab  
**Why It Matters:** 
- Dodo = A-Tier creator (96/100), 120k followers, Australia-based U12-U18 specialist
- Last tour (Jan 2026) = perfect case study for "camps use CourtLab to measure progress"
- Quick-turn content that proves product-market fit with coaches running real events
- Series B narrative: "Look — coaches are *already* using us at scale"

### Execution (3.5 hours)
1. **Draft Affiliate Agreement** (30 min)
   - Revenue share: 30% commission on referred trial-to-paid conversions
   - Requirement: Link in TikTok/Instagram bio for 90 days
   - Deliverable: 4-part content series showing player data during combine
   
2. **Content Script** (45 min)
   - **Part 1:** "This is why camp combines suck without data" (pain point)
   - **Part 2:** "CourtLab: 30-second player report at camp" (demo)
   - **Part 3:** "Parents see results = they trust training" (WIIFM)
   - **Part 4:** "Link in bio for free trial with Dodo's code" (CTA)

3. **Build Affiliate Tracking** (1.5 hours)
   - Create unique code: `DODO-COMBINE-2026`
   - Set up conversion tracking dashboard
   - Implement dynamic landing page with Dodo branding
   - Test end-to-end flow

4. **Outreach** (45 min)
   - Personalized DM to Dodo with:
     - Affiliate agreement PDF
     - 4 content scripts (ready to film)
     - $500 signing bonus if series posts this month
     - Pro account + white-label option for his camps

### Why This Works for Series B
- **Proof of creator activation:** Shows M7 or Series B investors real demand signals
- **Product validation:** Camp coaches actively using CourtLab at events
- **Revenue model proof:** Measurable affiliate conversions (not theoretical)
- **Network effect:** Dodo's fans → CourtLab users → more Dodo credibility

### Owner/Timeline
- **Start:** Now (15:00)
- **Launch:** Monday, Feb 17 (content goes live)
- **ROI Benchmark:** 5+ trial signups from affiliate code by Feb 28

---

## IDEA #2: Dashboard Feature — "Bench Stat Card" Widget (courtlabops.vercel.app)

### The Tactical Win
**What:** 30-min implementation of MVP bench/substitution tracking widget  
**Why It Matters:**
- Coaches repeatedly ask: "How long is player X on the bench between quarters?"
- Current app: no bench tracking (only on-court stats)
- This fills glaring product gap in <4 hours
- Series B story: "Product-led development driven by customer feedback"

### The Problem (Real Feedback)
- Coaches want to know: Who needs rest? Who's getting playing time? Are bench players getting chances?
- Current CourtLab: Tracks only active player stats (shots, passes, fouls)
- Missing: Bench time, substitution patterns, rest cycles
- Impact: Coaches use Hudl/YouTube for bench insights → *not using CourtLab for full picture*

### Execution (2.5 hours)

**1. Design the Widget (30 min)**
```
┌─────────────────────────────────────────┐
│  PLAYER  │ ON COURT │ BENCH │ % PLAYING │
├─────────────────────────────────────────┤
│ John S.  │  18:32   │ 3:28  │  84%      │
│ Marcus H │  12:15   │ 9:45  │  55%      │
│ Tyler Z  │   8:20   │13:40  │  38%      │
│ DeVon R  │  15:00   │ 6:00  │  71%      │
└─────────────────────────────────────────┘
```
- Shows playing time vs. bench time per game
- Calculates % of match on court (parent/coach decision-making)
- Sortable by any column
- Color-coded (green = high playing time, yellow = moderate, orange = low)

**2. Backend Integration (1 hour)**
- Hook into existing player session data
- Calculate bench time = quarter duration - on-court segments
- Create `/api/bench-stats` endpoint with game filtering
- Add aggregation: total season bench time, average per game

**3. Frontend Implementation (45 min)**
- Add Bench Stat Card to player profile dashboard
- React component with sortable table
- Responsive design (mobile + desktop)
- Export CSV button for coaches

**4. Testing + Deploy (30 min)**
- Test with existing game data
- Verify calculations accuracy
- Deploy to vercel.app staging (not prod yet)
- Create PR with documentation

### Why This Works for Series B
- **Product velocity:** Feature from request → shipped in 1 day
- **Coach feedback loop:** Shows investors we listen and iterate fast
- **Competitive advantage:** Hudl doesn't have bench tracking UX this clean
- **Unlock new metrics:** Parent transparency narrative: "See your kid's playing time in real time"

### Code Path (Ready to Git)
```bash
# Branch: feature/bench-stat-card
# Files:
# - src/components/BenchStatCard.tsx (NEW)
# - src/api/bench-stats.ts (NEW)
# - src/hooks/useBenchData.ts (NEW)
# - src/pages/player/[id].tsx (MODIFY: add card)
# - tests/bench-stats.test.ts (NEW)

# Commit message:
# feat: Add bench stat card widget to player profiles
# - Shows on-court vs bench time per game
# - Calculates playing time percentage
# - Sortable by any metric
# - Resolves coach feedback #287
```

### Owner/Timeline
- **Start:** Now (15:30, after Dodo outreach)
- **Deploy to staging:** Today by 18:00
- **Review:** Michael sign-off needed for display logic
- **Launch to prod:** Tomorrow (Feb 15) if approved
- **Demo:** Use in next coach call as "new feature this week"

### Bench Data Examples (Preview)
```json
{
  "game_id": "G-2026-02-14-SA001",
  "player_id": "P-12345",
  "player_name": "John Smith",
  "quarter_1": {"on_court": 480, "bench": 0},
  "quarter_2": {"on_court": 420, "bench": 60},
  "quarter_3": {"on_court": 300, "bench": 180},
  "quarter_4": {"on_court": 480, "bench": 0},
  "game_totals": {
    "on_court_seconds": 1680,
    "bench_seconds": 240,
    "playing_time_pct": 87.5
  }
}
```

---

## Why Both Ideas Together?

1. **Creator Network Effect** (Idea #1) → drives user growth
2. **Product Excellence** (Idea #2) → keeps users engaged once inside
3. **Series B Narrative:** "Customer-driven product + Creator distribution = repeatable go-to-market"

---

## Priority Ranking
- **IDEA #1 (Dodo Affiliate):** Do ASAP (can reach him today, align for Monday posts)
- **IDEA #2 (Bench Card):** Parallel track (no blocking dependencies)

Both ship by Monday. Both are measurable.

**Metrics to Track:**
- Idea #1: Affiliate signups via `DODO-COMBINE-2026` code by Feb 28
- Idea #2: Adoption rate of Bench Stat Card in player profiles; coach feedback

---

**Generated:** Feb 14, 2026 @ 3:00 PM (Adelaide)  
**Status:** Ready for Build → PR creation → Ship
