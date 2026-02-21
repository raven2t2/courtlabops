'use client';

import { Fragment, useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import {
  BarChart3,
  CalendarDays,
  DollarSign,
  Filter,
  RefreshCw,
  Search,
  Target,
  TrendingUp,
  X,
} from 'lucide-react';
import type { BriefRecord, BriefingsAnalyticsPayload, TimelinePoint, WordCloudTerm } from '@/lib/briefs-analytics';

const REFRESH_INTERVAL_MS = 180000;

const TAG_COLORS: Record<string, string> = {
  'Social Media': 'bg-sky-500/15 text-sky-300 border-sky-500/40',
  Email: 'bg-orange-500/15 text-orange-300 border-orange-500/40',
  PPC: 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/40',
  SEO: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
  Retention: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40',
  Conversion: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
  Analytics: 'bg-blue-500/15 text-blue-300 border-blue-500/40',
  Creative: 'bg-pink-500/15 text-pink-300 border-pink-500/40',
  General: 'bg-slate-500/15 text-slate-300 border-slate-500/40',
};

function getTagClass(tag: string) {
  return TAG_COLORS[tag] || TAG_COLORS.General;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function average(values: number[]) {
  if (!values.length) {
    return 0;
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function buildTimeline(briefs: BriefRecord[]): TimelinePoint[] {
  const byBucket = new Map<string, BriefRecord[]>();
  for (const brief of briefs) {
    const bucket = brief.date.slice(0, 7);
    if (!byBucket.has(bucket)) {
      byBucket.set(bucket, []);
    }
    byBucket.get(bucket)!.push(brief);
  }

  return Array.from(byBucket.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([bucket, bucketBriefs]) => {
      const tags = new Map<string, number>();
      const ctrValues: number[] = [];
      const roiValues: number[] = [];

      for (const brief of bucketBriefs) {
        for (const tag of brief.tags) {
          tags.set(tag, (tags.get(tag) || 0) + 1);
        }
        ctrValues.push(...brief.kpis.ctr);
        roiValues.push(...brief.kpis.roi);
      }

      const dominantTag = Array.from(tags.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || 'General';
      const date = new Date(`${bucket}-01T00:00:00.000Z`);
      const label = Number.isNaN(date.getTime())
        ? bucket
        : date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

      return {
        bucket,
        label,
        briefCount: bucketBriefs.length,
        dominantTag,
        tags: Object.fromEntries(tags.entries()),
        avgCtr: Number(average(ctrValues).toFixed(2)),
        avgRoi: Number(average(roiValues).toFixed(2)),
      };
    });
}

function buildSummary(briefs: BriefRecord[]) {
  const adSpend = briefs.flatMap((brief) => brief.kpis.adSpend);
  const ctr = briefs.flatMap((brief) => brief.kpis.ctr);
  const roi = briefs.flatMap((brief) => brief.kpis.roi);
  const roas = briefs.flatMap((brief) => brief.kpis.roas);
  const targetRoiMentions = briefs.reduce((total, brief) => total + brief.kpis.targetRoiMentions, 0);

  return {
    totalBriefs: briefs.length,
    totalAdSpend: adSpend.reduce((sum, value) => sum + value, 0),
    avgCtr: average(ctr),
    avgRoi: average(roi),
    avgRoaS: average(roas),
    targetRoiMentions,
  };
}

function metricBadges(brief: BriefRecord) {
  const items: string[] = [];

  if (brief.kpis.adSpend.length) {
    const total = brief.kpis.adSpend.reduce((sum, value) => sum + value, 0);
    items.push(`Spend ${formatCurrency(total)}`);
  }
  if (brief.kpis.ctr.length) {
    items.push(`CTR ${brief.kpis.ctr[0]}%`);
  }
  if (brief.kpis.roi.length) {
    items.push(`ROI ${brief.kpis.roi[0]}${brief.kpis.roi[0] > 10 ? '%' : 'x'}`);
  }
  if (brief.kpis.cac.length) {
    items.push(`CAC ${formatCurrency(brief.kpis.cac[0])}`);
  }

  return items.slice(0, 3);
}

const URL_TOKEN_PATTERN = /(https?:\/\/[^\s<>"']+|www\.[^\s<>"']+)/gi;

function normalizeUrl(url: string) {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function renderContentWithLinks(content: string) {
  const lines = content.split('\n');

  return lines.map((line, lineIndex) => {
    const parts = line.split(URL_TOKEN_PATTERN);
    return (
      <Fragment key={`line-${lineIndex}`}>
        {parts.map((part, partIndex) => {
          if (!part) {
            return null;
          }
          if (!/^(https?:\/\/|www\.)/i.test(part)) {
            return <Fragment key={`text-${lineIndex}-${partIndex}`}>{part}</Fragment>;
          }

          const href = normalizeUrl(part);
          return (
            <a
              key={`url-${lineIndex}-${partIndex}`}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-hyper-blue underline decoration-hyper-blue/60 underline-offset-2 hover:text-blue-300"
              onClick={(event) => event.stopPropagation()}
            >
              {part}
            </a>
          );
        })}
        {lineIndex < lines.length - 1 ? '\n' : null}
      </Fragment>
    );
  });
}

export default function BriefingsHubDashboard() {
  const [data, setData] = useState<BriefingsAnalyticsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null);
  const [selectedBrief, setSelectedBrief] = useState<BriefRecord | null>(null);
  const [isPending, startTransition] = useTransition();

  const fetchAnalytics = useCallback(async (background = false) => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    try {
      if (background) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch('/api/briefs/analytics', { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const payload = (await response.json()) as BriefingsAnalyticsPayload;
      if (requestId !== requestIdRef.current) {
        return;
      }

      setData(payload);
      setError(null);
    } catch (fetchError) {
      if (requestId !== requestIdRef.current) {
        return;
      }

      const message = fetchError instanceof Error ? fetchError.message : 'Unable to load briefings';
      setError(message);
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      void fetchAnalytics(true);
    }, REFRESH_INTERVAL_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, [fetchAnalytics]);

  const filteredBriefs = useMemo(() => {
    if (!data) {
      return [];
    }

    const search = searchQuery.trim().toLowerCase();
    const searchableById = new Map(
      data.briefs.map((brief) => [
        brief.id,
        `${brief.title} ${brief.type} ${brief.date} ${brief.snippet} ${brief.content}`.toLowerCase(),
      ])
    );
    const selectedTermBriefIds = selectedTerm
      ? new Set(data.terms.find((term) => term.term === selectedTerm)?.briefIds || [])
      : null;

    return data.briefs.filter((brief) => {
      if (selectedBucket && !brief.date.startsWith(selectedBucket)) {
        return false;
      }

      if (selectedTags.length && !brief.tags.some((tag) => selectedTags.includes(tag))) {
        return false;
      }

      if (selectedTermBriefIds && !selectedTermBriefIds.has(brief.id)) {
        return false;
      }

      if (!search) {
        return true;
      }

      return (searchableById.get(brief.id) || '').includes(search);
    });
  }, [data, searchQuery, selectedBucket, selectedTags, selectedTerm]);

  const filteredSummary = useMemo(() => buildSummary(filteredBriefs), [filteredBriefs]);
  const filteredTimeline = useMemo(() => buildTimeline(filteredBriefs), [filteredBriefs]);

  const filteredTerms = useMemo(() => {
    if (!data) {
      return [] as WordCloudTerm[];
    }

    const filteredIds = new Set(filteredBriefs.map((brief) => brief.id));

    return data.terms
      .map((term) => {
        const matchingIds = term.briefIds.filter((id) => filteredIds.has(id));
        return {
          ...term,
          count: matchingIds.length,
          briefIds: matchingIds,
        };
      })
      .filter((term) => term.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 45)
      .map((term, _index, arr) => {
        const max = arr[0]?.count || 1;
        return {
          ...term,
          weight: Number((term.count / max).toFixed(3)),
        };
      });
  }, [data, filteredBriefs]);

  const toggleTag = (tag: string) => {
    setSelectedTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]
    );
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSelectedTerm(null);
    setSelectedBucket(null);
    setSearchQuery('');
  };

  const topTag = useMemo(() => {
    if (!filteredBriefs.length) {
      return 'General';
    }

    const counts = new Map<string, number>();
    for (const brief of filteredBriefs) {
      for (const tag of brief.tags) {
        counts.set(tag, (counts.get(tag) || 0) + 1);
      }
    }

    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || 'General';
  }, [filteredBriefs]);

  if (loading && !data) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-7xl items-center justify-center px-6 py-10">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-border-default border-t-hyper-blue" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto mt-8 w-full max-w-3xl rounded-2xl border border-accent-red/40 bg-accent-red-muted p-6 text-text-primary">
        <h1 className="font-display text-2xl font-bold">Briefings Dashboard Unavailable</h1>
        <p className="mt-2 text-sm text-text-secondary">{error || 'No data returned from analytics API.'}</p>
        <button
          onClick={() => fetchAnalytics()}
          className="mt-4 rounded-xl border border-border-default bg-bg-secondary px-4 py-2 text-sm font-semibold hover:border-border-hover"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(47,122,255,0.2),_transparent_45%),_radial-gradient(circle_at_80%_20%,_rgba(14,165,233,0.18),_transparent_35%)]">
      <div className="mx-auto w-full max-w-[1700px] px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border-default bg-bg-secondary/70 p-5 backdrop-blur-xl sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">
                Marketing Briefings Dashboard
              </h1>
              <p className="mt-1 text-sm text-text-secondary sm:text-base">
                Interactive trend tracking across strategy updates, KPI mentions, and channel signals.
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.16em] text-text-muted">
                Last synced {new Date(data.generatedAt).toLocaleString('en-US')}
              </p>
            </div>
            <button
              onClick={() => fetchAnalytics(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-border-default bg-bg-primary px-4 py-2 text-sm font-semibold text-text-primary transition-colors hover:border-border-hover"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing || isPending ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-accent-amber/40 bg-accent-amber-muted px-4 py-2 text-sm text-text-primary">
              Refresh failed: {error}. Showing last successful snapshot.
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <div className="rounded-2xl border border-border-default bg-bg-primary p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-text-muted">Briefings</p>
              <p className="mt-2 text-2xl font-bold text-text-primary">{filteredSummary.totalBriefs}</p>
            </div>
            <div className="rounded-2xl border border-border-default bg-bg-primary p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-text-muted">Ad Spend Mentions</p>
              <p className="mt-2 text-2xl font-bold text-text-primary">{formatCurrency(filteredSummary.totalAdSpend)}</p>
            </div>
            <div className="rounded-2xl border border-border-default bg-bg-primary p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-text-muted">Avg CTR</p>
              <p className="mt-2 text-2xl font-bold text-text-primary">
                {filteredSummary.avgCtr ? `${filteredSummary.avgCtr.toFixed(2)}%` : 'N/A'}
              </p>
            </div>
            <div className="rounded-2xl border border-border-default bg-bg-primary p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-text-muted">Avg ROI / ROAS</p>
              <p className="mt-2 text-2xl font-bold text-text-primary">
                {filteredSummary.avgRoi ? `${filteredSummary.avgRoi.toFixed(2)}` : 'N/A'}
                <span className="ml-2 text-base text-text-secondary">
                  {filteredSummary.avgRoaS ? `| ${filteredSummary.avgRoaS.toFixed(2)}x` : ''}
                </span>
              </p>
            </div>
            <div className="rounded-2xl border border-border-default bg-bg-primary p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-text-muted">Target ROI Mentions</p>
              <p className="mt-2 text-2xl font-bold text-text-primary">{filteredSummary.targetRoiMentions}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <div className="rounded-2xl border border-border-default bg-bg-secondary/80 p-4">
              <label className="text-xs uppercase tracking-[0.16em] text-text-muted">Search Briefings</label>
              <div className="relative mt-2">
                <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Title, type, KPI, or snippet"
                  className="w-full rounded-xl border border-border-default bg-bg-primary py-2 pl-9 pr-3 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-border-hover"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-border-default bg-bg-secondary/80 p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.16em] text-text-muted">Filters</p>
                <button
                  onClick={clearFilters}
                  className="text-xs font-semibold text-text-secondary hover:text-text-primary"
                >
                  Clear
                </button>
              </div>

              <div className="mt-3 space-y-2">
                <div className="rounded-xl border border-border-default bg-bg-primary px-3 py-2">
                  <p className="text-xs text-text-muted">Active term</p>
                  <p className="mt-1 text-sm font-semibold text-text-primary">{selectedTerm || 'None'}</p>
                </div>
                <div className="rounded-xl border border-border-default bg-bg-primary px-3 py-2">
                  <p className="text-xs text-text-muted">Active timeline bucket</p>
                  <p className="mt-1 text-sm font-semibold text-text-primary">{selectedBucket || 'All months'}</p>
                </div>
                <div className="rounded-xl border border-border-default bg-bg-primary px-3 py-2">
                  <p className="text-xs text-text-muted">Dominant tag</p>
                  <p className="mt-1 text-sm font-semibold text-text-primary">{topTag}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border-default bg-bg-secondary/80 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-text-primary">
                <Filter className="h-4 w-4" />
                Channel Tags
              </div>
              <div className="space-y-2">
                {data.tags.map(({ tag, count }) => {
                  const active = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
                        active
                          ? 'border-hyper-blue bg-hyper-blue-muted text-text-primary'
                          : 'border-border-default bg-bg-primary text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      <span>{tag}</span>
                      <span className="rounded-md bg-bg-secondary px-2 py-0.5 text-xs font-semibold text-text-muted">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          <div className="space-y-6">
            <section className="rounded-2xl border border-border-default bg-bg-secondary/80 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold text-text-primary">Clickable Word Cloud</h2>
                  <p className="text-sm text-text-secondary">Click a term to instantly filter all briefings and timeline points.</p>
                </div>
                {selectedTerm && (
                  <button
                    onClick={() =>
                      startTransition(() => {
                        setSelectedTerm(null);
                      })
                    }
                    className="inline-flex items-center gap-1 rounded-lg border border-border-default bg-bg-primary px-3 py-1.5 text-xs font-semibold hover:border-border-hover"
                  >
                    <X className="h-3.5 w-3.5" />
                    Reset term
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {filteredTerms.map((term) => {
                  const isActive = selectedTerm === term.term;
                  const fontSize = `${0.75 + term.weight * 1.5}rem`;

                  return (
                    <button
                      key={term.term}
                      onClick={() =>
                        startTransition(() => {
                          setSelectedTerm(isActive ? null : term.term);
                        })
                      }
                      className={`rounded-xl border px-2.5 py-1 text-left font-semibold transition-colors ${
                        isActive
                          ? 'border-hyper-blue bg-hyper-blue text-white'
                          : 'border-border-default bg-bg-primary text-text-secondary hover:border-border-hover hover:text-text-primary'
                      }`}
                      style={{ fontSize, lineHeight: 1.1 }}
                    >
                      {term.term} <span className="text-[10px] opacity-70">{term.count}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="rounded-2xl border border-border-default bg-bg-secondary/80 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold text-text-primary">Strategic Timeline</h2>
                  <p className="text-sm text-text-secondary">Month-over-month strategy movement, color-coded by dominant topic.</p>
                </div>
                <button
                  onClick={() => setSelectedBucket(null)}
                  className="rounded-lg border border-border-default bg-bg-primary px-3 py-1.5 text-xs font-semibold hover:border-border-hover"
                >
                  View all months
                </button>
              </div>

              <div className="overflow-x-auto pb-2">
                <div className="flex min-w-max items-stretch gap-3">
                  {filteredTimeline.map((point) => {
                    const active = selectedBucket === point.bucket;
                    return (
                      <button
                        key={point.bucket}
                        onClick={() => setSelectedBucket(active ? null : point.bucket)}
                        className={`min-w-[180px] rounded-2xl border p-4 text-left transition-all ${
                          active
                            ? 'border-hyper-blue bg-hyper-blue-muted'
                            : 'border-border-default bg-bg-primary hover:border-border-hover'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-text-primary">{point.label}</p>
                          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${getTagClass(point.dominantTag)}`}>
                            {point.dominantTag}
                          </span>
                        </div>
                        <p className="mt-3 text-2xl font-bold text-text-primary">{point.briefCount}</p>
                        <p className="text-xs uppercase tracking-[0.14em] text-text-muted">Briefings</p>
                        <div className="mt-3 flex gap-3 text-xs text-text-secondary">
                          <span className="inline-flex items-center gap-1"><TrendingUp className="h-3 w-3" />CTR {point.avgCtr || 'N/A'}</span>
                          <span className="inline-flex items-center gap-1"><Target className="h-3 w-3" />ROI {point.avgRoi || 'N/A'}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-border-default bg-bg-secondary/80 p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="font-display text-xl font-bold text-text-primary">Briefing Feed</h2>
                  <p className="text-sm text-text-secondary">Masonry digest of marketing notes with tags, snippets, and extracted KPIs.</p>
                </div>
                <p className="text-sm font-semibold text-text-secondary">{filteredBriefs.length} cards</p>
              </div>

              {filteredBriefs.length === 0 ? (
                <div className="rounded-xl border border-border-default bg-bg-primary p-8 text-center text-text-secondary">
                  No briefings match the active filters.
                </div>
              ) : (
                <div className="columns-1 gap-4 md:columns-2 2xl:columns-3">
                  {filteredBriefs.map((brief) => (
                    <button
                      key={brief.id}
                      onClick={() => setSelectedBrief(brief)}
                      className="mb-4 w-full break-inside-avoid rounded-2xl border border-border-default bg-bg-primary p-4 text-left transition-colors hover:border-border-hover"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="line-clamp-2 font-display text-lg font-bold text-text-primary">{brief.title}</p>
                        <span className="rounded-lg border border-border-default px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-text-muted">
                          {brief.type}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center gap-3 text-xs text-text-secondary">
                        <span className="inline-flex items-center gap-1"><CalendarDays className="h-3 w-3" />{brief.date}</span>
                        <span className="inline-flex items-center gap-1"><BarChart3 className="h-3 w-3" />{new Date(brief.timestamp).toLocaleTimeString('en-US')}</span>
                      </div>

                      <p className="mt-3 text-sm text-text-secondary">{brief.snippet}</p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {brief.tags.map((tag) => (
                          <span key={tag} className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${getTagClass(tag)}`}>
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {metricBadges(brief).map((label) => (
                          <span key={label} className="rounded-lg border border-border-default bg-bg-secondary px-2 py-1 text-[10px] font-semibold text-text-secondary">
                            {label}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      {selectedBrief && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-border-default bg-bg-primary">
            <div className="sticky top-0 z-10 border-b border-border-default bg-bg-primary/95 p-5 backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl font-bold text-text-primary">{selectedBrief.title}</h3>
                  <p className="mt-1 text-sm text-text-secondary">
                    {selectedBrief.date} · {new Date(selectedBrief.timestamp).toLocaleString('en-US')}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedBrief(null)}
                  className="rounded-xl border border-border-default bg-bg-secondary p-2 text-text-secondary hover:border-border-hover hover:text-text-primary"
                  aria-label="Close details"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4 p-6">
              <div className="flex flex-wrap gap-2">
                {selectedBrief.tags.map((tag) => (
                  <span key={tag} className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${getTagClass(tag)}`}>
                    {tag}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <div className="rounded-xl border border-border-default bg-bg-secondary p-3">
                  <p className="text-xs uppercase tracking-[0.12em] text-text-muted">Ad Spend</p>
                  <p className="mt-1 text-lg font-bold text-text-primary">
                    {selectedBrief.kpis.adSpend.length
                      ? formatCurrency(selectedBrief.kpis.adSpend.reduce((sum, value) => sum + value, 0))
                      : 'N/A'}
                  </p>
                </div>
                <div className="rounded-xl border border-border-default bg-bg-secondary p-3">
                  <p className="text-xs uppercase tracking-[0.12em] text-text-muted">CTR</p>
                  <p className="mt-1 text-lg font-bold text-text-primary">{selectedBrief.kpis.ctr[0] ? `${selectedBrief.kpis.ctr[0]}%` : 'N/A'}</p>
                </div>
                <div className="rounded-xl border border-border-default bg-bg-secondary p-3">
                  <p className="text-xs uppercase tracking-[0.12em] text-text-muted">ROI</p>
                  <p className="mt-1 text-lg font-bold text-text-primary">{selectedBrief.kpis.roi[0] || 'N/A'}</p>
                </div>
                <div className="rounded-xl border border-border-default bg-bg-secondary p-3">
                  <p className="text-xs uppercase tracking-[0.12em] text-text-muted">CAC</p>
                  <p className="mt-1 text-lg font-bold text-text-primary">
                    {selectedBrief.kpis.cac[0] ? formatCurrency(selectedBrief.kpis.cac[0]) : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-border-default bg-bg-secondary p-5">
                <p className="mb-3 text-xs uppercase tracking-[0.16em] text-text-muted">Raw Briefing</p>
                <div className="whitespace-pre-wrap break-words font-mono text-sm text-text-primary">
                  {renderContentWithLinks(selectedBrief.content)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-4 right-4 hidden gap-2 rounded-full border border-border-default bg-bg-secondary px-3 py-2 text-xs text-text-secondary shadow-lg sm:inline-flex">
        <DollarSign className="h-3.5 w-3.5" />
        KPI extraction live
      </div>
    </div>
  );
}
