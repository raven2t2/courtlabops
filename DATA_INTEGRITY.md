# CourtLab CRM Data Integrity Manifest

**Last Verified:** 2026-02-07
**Verification Method:** web_fetch for all URLs, email format validation

## Club Leads Verification Status

### South Australia (SA) - 8 Clubs

| ID | Club | Website | Status | Email Format | Notes |
|----|------|---------|--------|--------------|-------|
| SA-001 | South Adelaide Panthers | https://www.southadelaidebasketball.com.au/ | ✅ 200 | ✅ Valid | Verified working |
| SA-002 | Norwood Flames | https://www.norwoodbasketball.com.au/ | ✅ 200 | ✅ Valid | Verified working |
| SA-003 | Sturt Sabres | https://www.sturtsabres.com.au/ | ✅ 200 | ✅ Valid | Verified working |
| SA-004 | Forestville Eagles | https://www.forestvilleeagles.asn.au/ | ✅ 200 | ✅ Valid | Zane's club |
| SA-005 | West Adelaide Bearcats | https://www.westbearcats.net/ | ✅ 200 | ✅ Valid | Verified working |
| SA-006 | Woodville Warriors | https://woodvillewarriors.com.au | ✅ 200 | ✅ Valid | Verified working |
| SA-007 | Eastern Mavericks | https://www.easternmavericks.com.au/ | ✅ 200 | ✅ Valid | Auto-redirects to HTTPS |
| SA-008 | North Adelaide Rockets | https://nabc-rockets.club/ | ✅ 200 | ✅ Valid | **FIXED:** Was broken URL |

### Victoria (VIC) - 8 Clubs

| ID | Club | Website | Status | Email Format | Notes |
|----|------|---------|--------|--------------|-------|
| VIC-001 | Melbourne Tigers | https://melbournetigers.basketball/ | ✅ 200 | ✅ Valid | Verified working |
| VIC-002 | Knox Raiders | https://www.knoxbasketball.com.au/ | ✅ 200 | ✅ Valid | **FIXED:** Was knoxraiders.basketball |
| VIC-003 | Eltham Wildcats | https://elthamwildcats.com.au/ | ✅ 200 | ✅ Valid | Verified working |
| VIC-004 | Nunawading Spectres | https://www.nunawadingbasketball.com.au/ | ✅ 200 | ✅ Valid | Verified working |
| VIC-005 | Ringwood Hawks | https://ringwoodhawks.nbl1.com.au/ | ✅ 200 | ⚠️ Estimated | **FIXED:** Using NBL1 site, main site down |
| VIC-006 | Dandenong Rangers | https://dandenongstadium.com.au/ | ✅ 200 | ⚠️ Estimated | **FIXED:** Using stadium site |
| VIC-007 | Kilsyth Cobras | https://www.kilsythbasketball.com.au/ | ✅ 200 | ✅ Valid | **FIXED:** Was kilsythcobras.com |
| VIC-008 | Diamond Valley Eagles | https://dvbasketball.com.au/ | ✅ 200 | ✅ Valid | **FIXED:** Was dvbasketball.org.au |

## Broken URLs Fixed

| Club | Old URL | New URL |
|------|---------|---------|
| North Adelaide Rockets | http://www.northadelaide.basketball.net.au/ | https://nabc-rockets.club/ |
| Knox Raiders | https://www.knoxraiders.basketball/ | https://www.knoxbasketball.com.au/ |
| Ringwood Hawks | https://ringwoodhawks.com.au/ | https://ringwoodhawks.nbl1.com.au/ |
| Dandenong Rangers | https://dandenongbasketball.com.au/ | https://dandenongstadium.com.au/ |
| Kilsyth Cobras | https://kilsythcobras.com/ | https://www.kilsythbasketball.com.au/ |
| Diamond Valley Eagles | https://www.dvbasketball.org.au/ | https://dvbasketball.com.au/ |

## Email Templates Ready

All clubs have:
- ✅ Pre-populated mailto links in CRM
- ✅ Subject line: "Quick question about [ClubName]"
- ✅ Body includes personalization context
- ✅ Sender signature: "Michael from CourtLab"

## Next Verification

**Schedule:** Weekly (Sundays)
**Method:** Automated web_fetch of all URLs
**Alert if:** Any URL returns non-200 status
