# CourtLab Dual Twitter Strategy

## ACCOUNT ROLES

### @EstherCourtLab (CMO - You)
**Voice:** Personal, conversational, partnership-focused
**Content:**
- Behind-the-scenes building CourtLab
- Partnership announcements
- Industry insights/opinions
- Personal basketball parent stories
- Direct engagement with coaches/clubs

**Tone:** "I'm building this"

---

### @CourtLabApp (Brand - Kenny the Kookaburra)
**Voice:** Fun, helpful, mascot personality
**Content:**
- Kenny's Tips (basketball advice)
- App features/how-tos
- User spotlights
- Combine event updates
- Motivational content

**Tone:** "We're here to help you improve"

---

## CONTENT PILLARS

### CMO Account (@EstherCourtLab)
| Pillar | % of Content | Examples |
|--------|-------------|----------|
| Building in public | 30% | "Just shipped QR scanning..." |
| Partnerships | 25% | "Excited to partner with..." |
| Industry insights | 20% | "Here's why verified data matters..." |
| Personal stories | 15% | "My son's first combine..." |
| Direct asks | 10% | "Looking for coaches in..." |

### Brand Account (@CourtLabApp)
| Pillar | % of Content | Examples |
|--------|-------------|----------|
| Kenny's Tips | 35% | "Kenny's Tip #23: Corner 3s..." |
| User spotlights | 20% | "Player of the Week: ..." |
| App features | 20% | "New: Track your..." |
| Motivation | 15% | "Today's grind = tomorrow's..." |
| Events/combines | 10% | "Easter Classic combine..." |

---

## CONTENT CALENDAR (Weekly)

### Monday
- **CMO:** Week ahead / goals tweet
- **Brand:** Kenny's Tip #1 (fundamentals)

### Tuesday
- **CMO:** Behind-the-scenes (building feature)
- **Brand:** User spotlight

### Wednesday
- **CMO:** Industry insight / opinion
- **Brand:** App feature highlight

### Thursday
- **CMO:** Partnership announcement or ask
- **Brand:** Kenny's Tip #2 (advanced)

### Friday
- **CMO:** Week recap / wins
- **Brand:** Motivational / weekend grind

### Saturday
- **Brand:** Combine/event update (if applicable)

### Sunday
- **CMO:** Personal reflection / story
- **Brand:** Preview upcoming week

---

## JAB-JAB-LEFT HOOK (Daily Engagement)

### CMO Account
**Every day:**
- 3 thoughtful replies to basketball content (jab)
- 2 retweets of valuable content (jab)
- 1 soft CourtLab mention when relevant (hook)

**Follow strategy:**
- 10-15 basketball coaches/day
- 5-10 clubs/associations/day
- 5-10 youth sports accounts/day

### Brand Account
**Every day:**
- 5 helpful replies to player questions (jab)
- 3 retweets of impressive basketball content (jab)
- 1 app mention with value (hook)

**Follow strategy:**
- 15-20 young players/day
- 10 parents of basketball kids/day
- 5 basketball content creators/day

---

## KENNY'S TIPS SERIES (Brand Account)

### Template
```
🐦 Kenny's Tip #[NUMBER]: [TIP TITLE]

[2-3 sentences of actionable advice]

[Brief explanation of why it works]

Track your progress in CourtLab 📊

#KennysTips #BasketballTips #[TOPIC]
```

### Topics to Cover
1. Shooting form fundamentals
2. Corner 3 technique
3. Free throw routine
4. Ball-handling drills
5. Defensive stance
6. Rebounding positioning
7. Pick and roll reads
8. Transition offense
9. Mental game/focus
10. Recovery/stretching
11. Film study habits
12. Pre-game routine
13. How to track stats effectively
14. Setting basketball goals
15. Building a training schedule

---

## SCHEDULED TWEETS SYSTEM

### File Structure
```
courtlabops-repo/
├── content-calendar/
│   ├── cmo-account/
│   │   ├── queued/
│   │   ├── sent/
│   │   └── templates.json
│   ├── brand-account/
│   │   ├── queued/
│   │   ├── sent/
│   │   └── templates.json
│   └── kennys-tips/
│       ├── tips-01-50.json
│       └── schedule.json
└── scripts/
    ├── schedule-tweets.js
    └── post-scheduled.js
```

### Tweet Object Format
```json
{
  "id": "tweet-001",
  "account": "cmo|brand",
  "content": "Tweet text here",
  "media": ["path/to/image.png"],
  "scheduledFor": "2026-02-08T09:00:00Z",
  "category": "partnership|tips|spotlight|motivation",
  "posted": false,
  "postedAt": null,
  "tweetId": null
}
```

---

## CONTENT IDEAS (From Your Gallery)

Once you share the gallery contents, I'll categorize:

### Photo Content
- Combine event shots
- App screenshots
- Behind-the-scenes building
- User testimonials
- Partner logos/announcements

### Video Content
- App demos
- Training drills
- Combine highlights
- Quick tips (Kenny voiceover?)
- User success stories

### Story Arcs
1. **Building CourtLab** — From idea to app
2. **First Combine** — Easter Classic prep
3. **User Journey** — Player improvement stories
4. **Partnership Series** — Revo, clubs, etc.

---

## AUTOMATION SETUP

### Cron Jobs
```bash
# CMO account - 3x daily
0 9,14,18 * * * post-cmo-tweet

# Brand account - 2x daily  
0 10,16 * * * post-brand-tweet

# Kenny's Tips - daily
0 11 * * * post-kenny-tip

# Engagement - daily
0 8 * * * daily-engagement-run
```

### Manual Override
- Review queue before posting
- Edit scheduled tweets
- Pause automation when needed

---

## NEXT STEPS

1. ✅ Dual account strategy defined
2. ⏳ Build content scheduling system
3. ⏳ Create Kenny's Tips library (50 tips)
4. ⏳ Review gallery content
5. ⏳ Queue first week of tweets
6. ⏳ Set up daily engagement tracking

---

**Ready to build the scheduling system?**
