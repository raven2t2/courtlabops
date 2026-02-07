// Types
export interface Lead {
  id: string;
  clubName: string;
  location: string;
  state: string;
  tier: string;
  contactEmail: string;
  website: string;
  facebook: string;
  instagram: string;
  personalizationAnchor: string;
  draftedIntro: string;
  status: string;
  lastContact: string | null;
  nextAction: string;
  priority: string;
  notes: string;
  tags: string[];
}

export interface LeadsData {
  version: string;
  lastUpdated: string;
  leads: Lead[];
}

export interface Event {
  id: string;
  name: string;
  dates: string;
  location: string;
  venue: string;
  host: string;
  type: string;
  ageGroups: string[];
  expectedAttendance: string;
  courtLabOpportunity: string;
  actionItems: string[];
  priority: string;
  website: string;
}

export interface EventsData {
  version: string;
  lastUpdated: string;
  events: Event[];
}

export interface Competitor {
  name: string;
  company: string;
  founded: string;
  funding: string;
  whatTheyClaim: {
    primary: string;
    features: string[];
    targetAudience: string;
    keyDifferentiator: string;
  };
  whatTheyCharge: {
    freeTier?: string;
    monthly?: string;
    yearly?: string;
    teamPlans?: string;
    familySharing?: string;
    model?: string;
  };
  whatTheyDontDoWell: {
    glitches: string[];
    userComplaints: string[];
    marketPositioning: string;
    targetAudienceMismatch: string;
  };
  courtLabAdvantage: string[];
  threatLevel: string;
  notes: string;
}

export interface CompetitorsData {
  version: string;
  lastUpdated: string;
  competitors: Competitor[];
  summary: {
    biggestThreats: string[];
    differentiation: string;
    pricingAdvantage: string;
    marketGap: string;
  };
  strategyNotes: Record<string, string>;
}

export interface Coach {
  id: string;
  name: string;
  handle: string;
  platform: string;
  followers: number;
  location: string;
  role: string;
  vibe: string;
  websiteInBio: string;
  sponsoredByMajorBrand: string;
  whyGoodFit: string;
  reachoutAngle: string;
  priority: string;
  status: string;
  tags: string[];
}

export interface CoachesData {
  version: string;
  lastUpdated: string;
  criteria: {
    followerRange: string;
    location: string;
    vibe: string;
    contentType: string;
  };
  prospects: Coach[];
  researchMore: string[];
}
