import nlp from 'compromise';
import type { BriefDocument } from './briefs-source';

const TAG_KEYWORDS: Record<string, string[]> = {
  'Social Media': ['social', 'instagram', 'tiktok', 'twitter', 'x.com', 'reel', 'ugc', 'creator'],
  Email: ['email', 'newsletter', 'subject line', 'open rate', 'send time', 'inbox'],
  PPC: ['ppc', 'google ads', 'meta ads', 'cpc', 'cpm', 'paid', 'ad spend', 'retargeting'],
  SEO: ['seo', 'organic', 'keyword', 'search ranking', 'backlink', 'content cluster'],
  Retention: ['retention', 'churn', 'lifecycle', 're-engagement', 'activation'],
  Conversion: ['conversion', 'cvr', 'funnel', 'landing page', 'cta', 'checkout'],
  Analytics: ['attribution', 'dashboard', 'tracking', 'kpi', 'metric', 'cohort', 'insight'],
  Creative: ['creative', 'copy', 'hook', 'headline', 'ad angle', 'thumbnail'],
};

const STOP_WORDS = new Set([
  'about', 'after', 'again', 'against', 'all', 'also', 'and', 'another', 'any', 'are', 'around',
  'because', 'been', 'before', 'being', 'between', 'both', 'briefing', 'briefings', 'but', 'can',
  'could', 'daily', 'did', 'does', 'doing', 'done', 'during', 'each', 'even', 'every', 'from',
  'further', 'have', 'having', 'here', 'into', 'its', 'just', 'like', 'made', 'make', 'many',
  'more', 'most', 'much', 'must', 'need', 'next', 'only', 'other', 'our', 'out', 'over', 'same',
  'should', 'since', 'some', 'such', 'than', 'that', 'the', 'their', 'them', 'then', 'there',
  'these', 'they', 'this', 'those', 'through', 'today', 'update', 'updates', 'very', 'want', 'was',
  'were', 'what', 'when', 'where', 'which', 'while', 'with', 'would', 'your',
]);

export interface BriefKpis {
  adSpend: number[];
  ctr: number[];
  roi: number[];
  roas: number[];
  cac: number[];
  cpc: number[];
  cpm: number[];
  conversionRate: number[];
  targetRoiMentions: number;
}

export interface BriefRecord extends BriefDocument {
  id: string;
  snippet: string;
  tags: string[];
  termHits: string[];
  kpis: BriefKpis;
}

export interface WordCloudTerm {
  term: string;
  count: number;
  weight: number;
  briefIds: string[];
}

export interface TimelinePoint {
  bucket: string;
  label: string;
  briefCount: number;
  dominantTag: string;
  tags: Record<string, number>;
  avgCtr: number;
  avgRoi: number;
}

export interface AnalyticsSummary {
  totalBriefs: number;
  totalTags: number;
  totalTermMentions: number;
  totalAdSpend: number;
  avgCtr: number;
  avgRoi: number;
  avgRoaS: number;
  targetRoiMentions: number;
}

export interface BriefingsAnalyticsPayload {
  generatedAt: string;
  summary: AnalyticsSummary;
  tags: Array<{ tag: string; count: number }>;
  terms: WordCloudTerm[];
  timeline: TimelinePoint[];
  briefs: BriefRecord[];
}

function toSentence(text: string) {
  return text.replace(/\s+/g, ' ').trim();
}

function toSnippet(content: string) {
  const compact = toSentence(content);
  if (compact.length <= 240) {
    return compact;
  }
  return `${compact.slice(0, 237)}...`;
}

function parseNumber(raw: string) {
  const clean = raw.replace(/,/g, '').trim();
  const match = clean.match(/^(-?\d+(?:\.\d+)?)([kKmM])?$/);
  if (!match) {
    return NaN;
  }

  const base = Number(match[1]);
  const suffix = match[2]?.toLowerCase();
  if (suffix === 'k') {
    return base * 1000;
  }
  if (suffix === 'm') {
    return base * 1000000;
  }

  return base;
}

function extractCurrency(line: string): number[] {
  const results: number[] = [];
  const regex = /\$(-?\d[\d,]*(?:\.\d+)?(?:[kKmM])?)/g;

  let match = regex.exec(line);
  while (match) {
    const value = parseNumber(match[1]);
    if (!Number.isNaN(value)) {
      results.push(value);
    }
    match = regex.exec(line);
  }

  return results;
}

function extractPercent(line: string): number[] {
  const results: number[] = [];
  const regex = /(-?\d+(?:\.\d+)?)\s?%/g;

  let match = regex.exec(line);
  while (match) {
    const value = Number(match[1]);
    if (!Number.isNaN(value)) {
      results.push(value);
    }
    match = regex.exec(line);
  }

  return results;
}

function extractRatio(line: string): number[] {
  const results: number[] = [];
  const regex = /(-?\d+(?:\.\d+)?)\s?x/gi;

  let match = regex.exec(line);
  while (match) {
    const value = Number(match[1]);
    if (!Number.isNaN(value)) {
      results.push(value);
    }
    match = regex.exec(line);
  }

  return results;
}

function dedupeAndRound(values: number[], precision = 2) {
  const factor = 10 ** precision;
  return Array.from(
    new Set(
      values
        .map((value) => Math.round(value * factor) / factor)
        .filter((value) => Number.isFinite(value))
    )
  );
}

function extractBriefKpis(content: string): BriefKpis {
  const lines = content.split(/\r?\n/);
  const kpis: BriefKpis = {
    adSpend: [],
    ctr: [],
    roi: [],
    roas: [],
    cac: [],
    cpc: [],
    cpm: [],
    conversionRate: [],
    targetRoiMentions: 0,
  };

  for (const line of lines) {
    const normalized = line.toLowerCase();
    if (!normalized.trim()) {
      continue;
    }

    const currencies = extractCurrency(line);
    const percents = extractPercent(line);
    const ratios = extractRatio(line);

    if (/(ad spend|media spend|budget|paid spend|spend)/.test(normalized)) {
      kpis.adSpend.push(...currencies);
    }
    if (/\bctr\b|click[-\s]?through/.test(normalized)) {
      kpis.ctr.push(...percents);
    }
    if (/\broi\b|return on investment/.test(normalized)) {
      kpis.roi.push(...percents, ...ratios);
      if (/target roi/.test(normalized)) {
        kpis.targetRoiMentions += 1;
      }
    }
    if (/\broas\b/.test(normalized)) {
      kpis.roas.push(...ratios, ...percents);
    }
    if (/\bcac\b|customer acquisition cost/.test(normalized)) {
      kpis.cac.push(...currencies);
    }
    if (/\bcpc\b|cost per click/.test(normalized)) {
      kpis.cpc.push(...currencies);
    }
    if (/\bcpm\b|cost per mille|cost per thousand/.test(normalized)) {
      kpis.cpm.push(...currencies);
    }
    if (/\bcvr\b|conversion rate/.test(normalized)) {
      kpis.conversionRate.push(...percents);
    }
  }

  return {
    adSpend: dedupeAndRound(kpis.adSpend),
    ctr: dedupeAndRound(kpis.ctr),
    roi: dedupeAndRound(kpis.roi),
    roas: dedupeAndRound(kpis.roas),
    cac: dedupeAndRound(kpis.cac),
    cpc: dedupeAndRound(kpis.cpc),
    cpm: dedupeAndRound(kpis.cpm),
    conversionRate: dedupeAndRound(kpis.conversionRate),
    targetRoiMentions: kpis.targetRoiMentions,
  };
}

function countOccurrences(content: string, keyword: string) {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
  const hits = content.match(regex);
  return hits ? hits.length : 0;
}

function inferTags(content: string) {
  const normalized = content.toLowerCase();
  const scored = Object.entries(TAG_KEYWORDS)
    .map(([tag, keywords]) => {
      const score = keywords.reduce((total, keyword) => total + countOccurrences(normalized, keyword), 0);
      return { tag, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  if (!scored.length) {
    return ['General'];
  }

  return scored.slice(0, 3).map((entry) => entry.tag);
}

function normalizeToken(raw: string) {
  const value = raw.trim().replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '');
  if (!value) {
    return '';
  }

  const isAcronym = /^[A-Z0-9]{2,8}$/.test(value);
  const normalized = isAcronym ? value : value.toLowerCase();
  if (!isAcronym && (normalized.length < 3 || STOP_WORDS.has(normalized))) {
    return '';
  }
  return normalized;
}

function getCandidateTerms(content: string) {
  const candidates = new Set<string>();
  const words = content.match(/[A-Za-z][A-Za-z0-9-]{1,}/g) || [];
  for (const word of words) {
    const token = normalizeToken(word);
    if (token) {
      candidates.add(token);
    }
  }

  const nouns = nlp(content).nouns().out('array');
  for (const noun of nouns) {
    const token = normalizeToken(noun);
    if (token) {
      candidates.add(token);
    }
  }

  return Array.from(candidates);
}

function average(values: number[]) {
  if (!values.length) {
    return 0;
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function formatMonthLabel(bucket: string) {
  const date = new Date(`${bucket}-01T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    return bucket;
  }
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function buildBriefingsAnalytics(input: BriefDocument[]): BriefingsAnalyticsPayload {
  const termMap = new Map<string, { count: number; briefIds: Set<string> }>();
  const tagMap = new Map<string, number>();

  const briefs = input.map((brief) => {
    const id = brief.file;
    const tags = inferTags(brief.content);
    const kpis = extractBriefKpis(brief.content);
    const terms = getCandidateTerms(brief.content);

    for (const tag of tags) {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    }

    for (const term of terms) {
      const existing = termMap.get(term) || { count: 0, briefIds: new Set<string>() };
      existing.count += 1;
      existing.briefIds.add(id);
      termMap.set(term, existing);
    }

    return {
      ...brief,
      id,
      snippet: toSnippet(brief.content),
      tags,
      termHits: terms.slice(0, 25),
      kpis,
    };
  });

  const sortedTerms = Array.from(termMap.entries())
    .map(([term, meta]) => ({
      term,
      count: meta.count,
      briefIds: Array.from(meta.briefIds),
      weight: 0,
    }))
    .filter((entry) => entry.count > 1)
    .sort((a, b) => b.count - a.count)
    .slice(0, 55);

  const maxTermCount = sortedTerms.length ? sortedTerms[0].count : 1;
  const terms = sortedTerms.map((term) => ({
    ...term,
    weight: Number((term.count / maxTermCount).toFixed(3)),
  }));

  const tags = Array.from(tagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);

  const timelineByBucket = new Map<string, BriefRecord[]>();
  for (const brief of briefs) {
    const bucket = brief.date.slice(0, 7);
    if (!timelineByBucket.has(bucket)) {
      timelineByBucket.set(bucket, []);
    }
    timelineByBucket.get(bucket)!.push(brief);
  }

  const timeline: TimelinePoint[] = Array.from(timelineByBucket.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([bucket, bucketBriefs]) => {
      const localTagCount = new Map<string, number>();
      const ctrValues: number[] = [];
      const roiValues: number[] = [];

      for (const brief of bucketBriefs) {
        for (const tag of brief.tags) {
          localTagCount.set(tag, (localTagCount.get(tag) || 0) + 1);
        }
        ctrValues.push(...brief.kpis.ctr);
        roiValues.push(...brief.kpis.roi);
      }

      const dominantTag =
        Array.from(localTagCount.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || 'General';

      return {
        bucket,
        label: formatMonthLabel(bucket),
        briefCount: bucketBriefs.length,
        dominantTag,
        tags: Object.fromEntries(localTagCount.entries()),
        avgCtr: Number(average(ctrValues).toFixed(2)),
        avgRoi: Number(average(roiValues).toFixed(2)),
      };
    });

  const allAdSpend = briefs.flatMap((brief) => brief.kpis.adSpend);
  const allCtr = briefs.flatMap((brief) => brief.kpis.ctr);
  const allRoi = briefs.flatMap((brief) => brief.kpis.roi);
  const allRoaS = briefs.flatMap((brief) => brief.kpis.roas);

  const summary: AnalyticsSummary = {
    totalBriefs: briefs.length,
    totalTags: tags.length,
    totalTermMentions: terms.reduce((total, term) => total + term.count, 0),
    totalAdSpend: Number(allAdSpend.reduce((sum, value) => sum + value, 0).toFixed(2)),
    avgCtr: Number(average(allCtr).toFixed(2)),
    avgRoi: Number(average(allRoi).toFixed(2)),
    avgRoaS: Number(average(allRoaS).toFixed(2)),
    targetRoiMentions: briefs.reduce((total, brief) => total + brief.kpis.targetRoiMentions, 0),
  };

  return {
    generatedAt: new Date().toISOString(),
    summary,
    tags,
    terms,
    timeline,
    briefs,
  };
}
