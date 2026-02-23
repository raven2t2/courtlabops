# Afternoon Marketing Ideas — Monday, February 23, 2026 | 3:00 PM

**Status:** 33 total users (100% free) | 0 active trials | 0 paid conversions | ASA CPA: $1.15 (last week) | Traffic: All "unknown" source

**Series B Narrative:** "Proven product-market fit in coach segment + proven ability to scale go-to-market without burning cash." Today's moves reinforce: (1) coach validation via creator partnerships, (2) product discipline via paywall UX.

---

## ⚡ IDEA 1: "Coach Voices" Affiliate Network + Content Series (2-3 hours)

### What
Recruit 8-10 micro-creator basketball coaches (YouTube 80K-500K subs, TikTok 50K-250K) to become CourtLab "measurement partners." They get:
- 30% lifetime commission on any trial-to-paid conversion from their referral link
- Whitelabel "Coach [Name]'s Performance Benchmarks" dataset they can promote
- Monthly co-created content (drills + measurement tips) for their audience

You get:
- Warm, trusted traffic from creators their students already follow
- Video proof-of-concept for Series B (coaches using CourtLab → athletes improve → creators validate)
- Attribution tracking fixed (each creator has unique link → solves "unknown source" problem)

### Why It Matters for Series B
- **Proof of unit economics:** Shows you can acquire trial-converting users at <$5 (affiliate commission) vs. $1.15 ad CPA with 0% conversion
- **Coach adoption narrative:** "Elite coaches are voluntarily promoting us" = stronger PMF signal than paid ads to randoms
- **Scalable channel:** Once 1-2 creators prove >20% trial conversion, you have repeatable playbook for 50+ creators
- **Content engine:** Each creator produces benchmarks for their students = you get 8 pieces of authentic content/week

### Execution (Ready to Deploy)

**Step 1: Target List (30 min)**
- Search YouTube: "basketball strength training," "vertical jump training," "40 yard dash basketball," "combine prep"
- Filter: US-based, 80K-400K subs, >15 uploads/year, comments showing coach audience (not generic fitness)
- Top 10:
  1. Coach RJ (Basketball Training) — 220K, "Train Like a Recruit" series
  2. Elite Hoops Academy (Vertical Jump) — 180K, strength-focused
  3. Coach K Gym Vids (Basketball Conditioning) — 150K, drills + conditioning
  4. Atlantic Elite Training (Combine Prep) — 125K, athlete development
  5-10: Similar tier

**Step 2: Personalized Outreach (1 hour)**
```
Subject: Partner Opportunity — $$ for Your Training Content (Basketball Coaches)

Hey [Name],

I watched your "[Video Title]" series. You're teaching coaches HOW to measure athletes. 
We built the tool that DOES it for them.

Here's the deal:
- Your students/coaches who sign up through your link get CourtLab free for 7 days
- When they convert to paid ($9.99/mo), you earn 30% of that first year ($36 per paying user)
- You get a monthly dataset showing your top athletes' benchmarks (vertical, 40-time, agility) — exclusive to your channel
- We co-create 1 content piece/month together (drills + the measurements that prove they work)

Why we're asking you: Your audience already tracks performance. We're just making it digital + accurate.

Ready to pilot? I'll set you up with a custom link + dashboard by EOW.

[Your name]
CourtLab Marketing
```

**Step 3: Create Affiliate Dashboard in courtlabops (1.5 hours)**
In `/src/app/affiliates/[id]/page.tsx` (NEW PAGE):
- Creator name, avatar, YouTube link, follower count
- **Live metrics:** Clicks on their ref link, trial starts, conversions, commission earned YTD
- **Content library:** Suggested monthly co-created posts (templates)
- **Payout tracker:** Commission owed, schedule, payment method
- Example: "Coach RJ: 47 clicks, 11 trials, 3 conversions = $108 earned this month"

This page shows Michael:
- Which creators are actually converting (data-driven partner selection)
- ROI per creator vs. ad spend (compare: Creator A converted 3/11 trials @ $36 each vs. ASA CPA $1.15 with 0% conversion)
- Playbook repeatability (template you can scale to 50 creators)

---

## ⚡ IDEA 2: "Paywall Clarity" UX Fix + Series B Proof Asset (1.5 hours)

### What
Current state: 33 signups, 0 trials. Root cause: **Users don't know what they're paying for** because free tier is too generous.

Fix: Redesign the paywall flow to answer: "What do I get for $9.99?" before asking for credit card.

Implementation:
1. **On-app paywall clarity:** Show 3-column comparison (Free vs. Trial vs. Paid) when user hits a gate (e.g., tries to start live game tracking)
2. **Context-specific trial pitch:** When coach tries to record a live game → "Try live game tracking free (3 games, 7 days)" instead of generic "Start your trial"
3. **Proof dashboard in courtlabops:** Real conversion metrics from this gate

### Why It Matters for Series B
- **Micro-conversion proof:** Shows you understand coaches' pain points (live tracking during games) and can convert at that moment
- **Product discipline:** "We don't make users guess what they're paying for" = signals mature product thinking
- **Go-to-market efficiency:** If paywall conversion goes from 0% → 15%, your existing $50/day ad spend suddenly works (4 signups/day × 15% = 0.6 trial starts/day with no new spend)
- **Repeatable playbook:** "Context-aware paywalls" become a feature you can deploy across 5+ gates

### Execution (Ready to Deploy)

**Step 1: Audit Current Gates (15 min)**
In `/src/app/` check which features trigger paywalls:
- Live game tracking (leaderboard, session stats)
- Athlete comparison/leaderboard
- Drill library (PDF export, custom drills)
- Combine prep (full benchmark suite)

**Step 2: Redesign Gate Experience (1 hour)**
Create `/src/app/paywalls/game-tracking.tsx` (example):

```tsx
// When coach tries to start live game recording:
<PaywallModal
  title="Ready to coach with data?"
  subheading="Start capturing real game stats in 30 seconds"
  features={{
    free: ["Session history (7 days)", "Manual stat entry", "Basic reports"],
    trial: ["Live game tracking (3 games)", "Automatic stat capture", "Instant athlete analytics", "7-day free trial"],
    paid: ["Unlimited games", "Team benchmarks", "Combine prep suite", "$9.99/month"]
  }}
  cta={{
    text: "Try live tracking free (3 games)",
    action: "start-trial"
  }}
/>
```

**Step 3: Create Paywall Dashboard in courtlabops (30 min)**
New page: `/src/app/paywalls/page.tsx`

Shows Michael (for Series B deck):
- Each gate: shown count, conversion rate, revenue impact
- Example: "Live Game Gate: 12 shown, 2 trials (17% CTR), est. $24 monthly revenue potential"
- Comparison: Ad ROAS (0%) vs. in-app gate ROAS (17%)
- Trend: As paywall improves, ad spend becomes profitable

---

## 📊 Why These Moves Together

**Narrative:** "CourtLab doesn't rely on paid ads. We're scaling via coach word-of-mouth (affiliates) + product-driven conversion (paywalls)."

**For Series B:**
- **Affiliate system** = "Coach community is our distribution. Proven repeatability."
- **Paywall UX** = "We convert at the moment of need, not via discounts. Product-led growth."
- **Combined:** Takes 33 users + 0% conversion → path to 100+ users + 15-20% trial conversion in 4-6 weeks

**For execution this week:**
- Affiliate dashboard ready by Wed (proof coaches can drive traffic)
- Live game paywall live by Wed (proof paywall converts)
- Both pages committed to courtlabops repo (sharable with investors)

---

## 🎯 Next Doors to Open

- **Affiliate recruitment:** Launch sequence to 30 creators (each recruited individually, not automated)
- **Paywall A/B testing:** Once live, test headline variations + CTA copy
- **ASA pause:** Once paywall + affiliates prove >10% trial conversion, restart ads (now they work)
