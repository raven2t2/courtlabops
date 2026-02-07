# Combine Partners Module

## Partner Categories

### 1. PHYSIOTHERAPY PARTNERS
Pre-combine assessments, injury screening, movement analysis

#### Adelaide
- **SportsMed SA** (Mile End) - info@sportsmed.com.au
- **Body Balance Physio** - Multiple locations
- **Adelaide Sports Medicine** - Various

#### Melbourne
- **Melbourne Sports Physiotherapy** (4 locations) - info@melbournesportsphysiotherapy.com.au
- **Performe Sports Medicine** - info@performe.com.au
- **Sports Clinic Melbourne** (Prahran) - info@sportsclinicmelb.com.au
- **Melbourne Spinal & Sports Medicine** - info@melbournespinalsportsmedicine.com.au

---

### 2. GYM/FITNESS PARTNERS
Giveaways, training facilities, member benefits

#### Revo Fitness (PRIORITY)
**Status:** Already partnered with Adelaide 36ers, Perth Wildcats, Melbourne Mavericks
**Adelaide Locations:** Golden Grove, Elizabeth, Trinity Gardens, Marleston, Mount Barker, Port Adelaide, Munno Para, Noarlunga, Angle Vale
**Melbourne Locations:** Footscray, Bayswater North
**Contact:** Need partnerships/community email
**Value:** Free trials, merch giveaways, brand visibility

#### Other Gyms
- Anytime Fitness (nationwide)
- Fitness First (major cities)
- Plus Fitness (suburban)
- Jetts (24/7)
- F45 (boutique)

---

### 3. SPONSORSHIP ACTIVATION PARTNERS
Club sponsors looking for combine visibility

#### Target Categories
- Sports Retail (Rebel Sport, Decathlon, Sportsmart)
- Local Businesses (cafes, restaurants, car dealers)
- Health/Wellness (physios, gyms, nutritionists)
- Apparel (local brands, basketball gear)
- Technology (local IT, phone shops)
- Finance (banks, credit unions)

#### Activation Opportunities
- Brand on combine leaderboards
- "Powered by [Sponsor]" on athlete reports
- Prize giveaways at combines
- Direct engagement with 100+ athletes + parents
- Photo/video content for sponsor social media

---

### 4. GOVERNING BODIES

#### Basketball SA
**Role:** Peak body for basketball in SA
**Address:** Building 3, Level 1, 32-56 Sir Donald Bradman Drive, Mile End
**Phone:** (08) 7088 0070
**Email:** Via contact form
**Key Staff to Find:** CEO, GM, Competitions Manager, Partnerships Manager

#### Basketball Victoria
**Role:** Peak body for basketball in VIC
**Need:** Research contact details

---

## Outreach Scripts

### Physiotherapy Partner Script
```
Subject: Partnership: CourtLab Combines + [Physio Name] Pre-Assessment

Hi [Name],

CourtLab runs verified basketball combines across Adelaide and Melbourne — QR-based shot tracking, combine testing, live leaderboards on big screens.

We're looking for a physiotherapy partner to provide pre-combine movement assessments and injury screening. Benefits for you:

• Direct access to 100+ athletes per combine event
• Brand exposure on combine leaderboards and app
• Partnership promoted to 34+ basketball clubs in our network
• Opportunity to build ongoing relationships with clubs
• Potential for ongoing athlete care post-combine

Interested in a 10-minute call to discuss?

Michael
CourtLab
```

### Gym Partner Script (Revo Fitness)
```
Subject: Partnership: CourtLab Combines + Revo (like 36ers & Wildcats)

Hi Revo Partnerships Team,

I noticed Revo already partners with Adelaide 36ers, Perth Wildcats, and Melbourne Mavericks — smart moves in basketball.

CourtLab runs verified basketball combines across Adelaide and Melbourne. QR-based shot tracking, combine testing, live leaderboards. Think NBA combine experience for grassroots players.

Partnership opportunity:
• Revo giveaways at every combine (free trials, merch)
• Brand on combine leaderboards and CourtLab app
• Access to 100+ athletes per event
• Connection to 34+ basketball clubs in our network
• Aligns with your existing basketball partnerships

Worth a 10-minute call?

Michael
CourtLab
```

### Sponsor Activation Script
```
Subject: Activate [Sponsor Name] at CourtLab Combines

Hi [Club] Partnerships Team,

CourtLab is partnering with basketball clubs to run verified combines — QR-based shot tracking, combine testing, live leaderboards on big screens.

Opportunity for [Club]'s sponsors:

• Brand visibility on combine leaderboards
• Direct engagement with 100+ athletes + parents per event
• "Powered by [Sponsor]" on athlete performance reports
• Prize giveaways (sponsor products as combine prizes)
• Photo/video content for sponsor social media

We handle the tech. You bring the athletes. Sponsors get activation they can't get at regular games.

Interested in discussing how this could work for [Club]'s sponsor portfolio?

Michael
CourtLab
```

### Basketball SA Script
```
Subject: CourtLab Combines — Official Partner Opportunity for Basketball SA

Hi [CEO/GM Name],

CourtLab is an Adelaide-based basketball technology company building verified combine systems for grassroots basketball.

What we do:
• QR-based shot tracking (no glitchy AI)
• Verified combine testing (vertical, agility, shooting)
• Live leaderboards on big screens
• NBA combine experience for U12-U18 players

Partnership opportunity for Basketball SA:
• Official combine provider for SA basketball
• Integration with BSA competitions and pathways
• Data insights for player development tracking
• Sponsor activation opportunities for BSA partners

We'd love to discuss how CourtLab can support Basketball SA's mission to develop basketball in South Australia.

Available for a 15-minute call this week?

Michael
CourtLab
```

---

## CRM Data Structure

### Partner Object
```typescript
interface CombinePartner {
  id: string
  name: string
  category: "physio" | "gym" | "sponsor" | "governing_body" | "other"
  location: string
  contactName: string
  contactEmail: string
  contactPhone: string
  website: string
  partnershipStatus: "identified" | "contacted" | "negotiating" | "active" | "declined"
  valueAdd: string
  outreachScript: string
  notes: string
  lastContactDate: string
  nextAction: string
}
```

---

## Next Actions

1. **Create Combine Partners page in CRM** with data structure above
2. **Send immediate outreach** to Mitchell Condick (Frankston) and Nick Magor (ACBA)
3. **Research Basketball SA CEO/GM** name for governing body outreach
4. **Find Revo Fitness partnerships email** (try community@ or partnerships@)
5. **Verify estimated emails** for 12 Melbourne clubs via test sends
6. **Research physio partners** in Adelaide and Melbourne for pre-combine assessments

---

## Files Created
- `research/combine-partners-research.md` — This file
- `research/priority-contacts-research.md` — Club decision-makers
- `research/complete-email-list.md` — All club emails

Next: Build the actual CRM module for combine partners with UI and data entry.
