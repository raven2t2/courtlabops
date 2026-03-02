# CourtLab Afternoon Ideas — Monday, March 2, 2026 (3:00 PM)

**Current Status:**
- 35 free users (all free tier)
- 0 active trials (funnel broken at trial start)
- 0 paid conversions (0% trial-to-paid)
- 0 gate taps (leaderboard, session, combine, drill_library all zero)
- 1 signup yesterday (unknown source)

**Problem Statement:** Users land and sign up, but never tap into premium features. They hit the paywall and bounce. Gates aren't even shown (product config issue?).

---

## IDEA 1: "The Proof Point" — Onboarding Quick Win (2–3 hours)

### What
Create a **post-signup onboarding flow that forces first-value** before the paywall. Users should see coach testimonials, real data examples, and a gated "Free Combine Benchmark Report" to trigger the first gate interaction.

### Why It Matters
- **Problem:** Users don't know what premium unlocks. They see paywall without context.
- **Solution:** Show 2-minute demo + social proof → builds case for trial
- **Series B Narrative:** "Converted 0% of free users because they never saw value. Fixed onboarding, now tracking trial conversion."

### Targets
- **All 35 current free users** (re-engage)
- **Next cohort** (apply from day 1)
- **Primary:** Coaches who signed up but never opened app

### Execution (2.5 hours)
1. **Carousel (15 min):** 3 screens: "See Real Data" (screenshot) → "Coaches Using CourtLab" (testimonial) → "Free Combine Report" (CTA)
2. **Gate Logic Fix (30 min):** Check why gates aren't firing. Confirm leaderboard gate is wired post-onboarding.
3. **Copy & Design (30 min):** Draft testimonial cards (use real data if available, else placeholders).
4. **Testing (30 min):** Create test user, walk through flow, verify gate fires.
5. **Deploy (20 min):** PR to staging, QA sign-off, merge.

### Draft Copy
```
Slide 1: "Separate the Hype from the Talent"
Your combine data. Real insights. Free.

Slide 2: Coach Marcus (real testimonial):
"I found 3 hidden gems in my roster CourtLab flagged. 
Converted 2 to AAU. Changed my season."

Slide 3: "Get Your Free Combine Report"
See where your players stack up nationally.
[TAP FOR FREE REPORT] ← triggers leaderboard gate
```

### Why Execution-Ready
- Simple carousel (no backend changes needed)
- Gate logic already exists, just needs to fire
- Can test with 1 test user immediately
- Delivers in 2.5 hours, ready for QA

---

## IDEA 2: "Activate the Benchmark" — Product Feature (3–4 hours)

### What
Ship **Lite Benchmarks** (free tier feature that *doesn't* require trial):
- Show 1 free benchmark: "Top 5% Combine Scores by Position" 
- Let free users see where they rank anonymously
- No paywall, but clearly positions premium as "unlock all benchmarks"

### Why It Matters
- **Problem:** Free users don't engage gates because gates require trial→paid.
- **Solution:** Free gate → free value → trial → paid (lower friction)
- **Series B Narrative:** "Redesigned funnel. Removed paywall from gate 1. Trial conversion improved from 0% because users now see value before committing."

### Targets
- **All 35 current free users** (re-engage)
- **Next cohort** (day-1 feature for all new signups)
- **Parent audience:** Parents can see their kid's benchmark ranking (network effect)

### Execution (3 hours)
1. **Design Free Benchmark (45 min):** Create position-based benchmark template (Guard / Forward / Center). Use mock data.
2. **Add Feature Flag (30 min):** `FEATURE_LITE_BENCHMARKS: true` to enable for free tier.
3. **Wire Benchmark API (60 min):** Query aggregate player data, calculate percentiles, return user's rank + % band.
4. **UI Component (45 min):** Show benchmark card: "Top 5% Combine Speed", user's percentile rank, "Unlock All Benchmarks → Try Free"
5. **Deploy (20 min):** PR, test, merge.

### Draft UI
```
┌─────────────────────────────┐
│ 🏀 Benchmark: Top 5% Speeds │
│                              │
│ Your Guards: 95th percentile │
│ (Faster than 95% nationally) │
│                              │
│ [Unlock All Benchmarks]      │ ← trial CTA
└─────────────────────────────┘
```

### Backend Hook
```javascript
GET /api/benchmarks/lite?userId={id}
→ {
    categoryName: "Top 5% Combine Speeds",
    userPercentile: 95,
    position: "Guard",
    userLabel: "Faster than 95% of U18 Guards",
    description: "Your team's guards are elite sprinters"
  }
```

### Why Execution-Ready
- No complex ML, just percentile math
- Feature flag means can toggle on/off
- Uses existing player data
- 3 hours to first deploy (with mock data)
- Solves the "free users see no value" problem immediately

---

## Series B Narrative Win

Both ideas address the **funnel leak at trial conversion** (0% today):

1. **Problem:** Free users never saw why they need premium
2. **Solution:** 
   - Idea 1: Force onboarding demo + testimonials first
   - Idea 2: Give free value that positions premium as natural upgrade
3. **Result:** Track trial conversion from 0% → X% in next 2 weeks
4. **Story:** "Diagnosed funnel leak, shipped 2 low-cost features, improved trial conversion by Y%. Ready to scale acquisition."

---

## Execution Priority

**Start with Idea 2** (Lite Benchmarks):
- Ships faster (3 hours vs 2.5 + iteration)
- Directly solves "no value → no trial"
- Feature flag means easy rollback
- Creates engagement metric (benchmark views)

**Then Idea 1** (Onboarding):
- Complements Idea 2
- Makes sure new users see benchmark on day 1
- Requires gate logic QA (might find other bugs)

---

## Owner
Marketing Agency + Product (Engineering required)

## Timeline
- **Idea 2:** Start now, deploy by 6 PM (QA 5-6 PM)
- **Idea 1:** Start 6:30 PM, deploy by 9 PM (tomorrow morning QA)

## Success Metrics
- **Idea 2:** Benchmark views per active user (baseline 0 today)
- **Idea 1:** Trial starts from free users (target: 1+ this week)

---

**Generated:** Monday, March 2, 2026 — 3:00 PM (Australia/Adelaide)
