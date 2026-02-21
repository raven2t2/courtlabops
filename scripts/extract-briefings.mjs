#!/usr/bin/env node

/**
 * Extract briefings from a CourtLab deployment into a single JSON file.
 *
 * Usage:
 *   node scripts/extract-briefings.mjs
 *   node scripts/extract-briefings.mjs --base https://courtlabops.vercel.app --out .context/briefings-export.json
 */

import fs from 'fs';
import path from 'path';

function parseArgs(argv) {
  const options = {
    base: process.env.BRIEFINGS_BASE_URL || 'https://courtlabops.vercel.app',
    out: process.env.BRIEFINGS_OUT || '.context/briefings-export.json',
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--base' && argv[i + 1]) {
      options.base = argv[i + 1];
      i += 1;
    } else if (arg === '--out' && argv[i + 1]) {
      options.out = argv[i + 1];
      i += 1;
    }
  }

  return options;
}

async function fetchJson(url) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}) for ${url}`);
  }
  return response.json();
}

function normalizeBriefEntry(meta, detail) {
  return {
    id: meta.file,
    file: meta.file,
    title: detail.title || meta.title || meta.file,
    type: detail.type || meta.type || 'uncategorized',
    date: detail.date || meta.date || '',
    timestamp: detail.timestamp || meta.timestamp || '',
    path: meta.path,
    content: detail.content || '',
  };
}

async function main() {
  const { base, out } = parseArgs(process.argv.slice(2));
  const normalizedBase = base.replace(/\/+$/, '');
  const listUrl = `${normalizedBase}/api/briefs`;

  console.log(`Fetching briefing index from ${listUrl}`);
  const payload = await fetchJson(listUrl);
  const briefs = Array.isArray(payload.briefs) ? payload.briefs : [];

  if (!briefs.length) {
    throw new Error('No briefing metadata returned by /api/briefs');
  }

  const detailed = await Promise.all(
    briefs.map(async (brief) => {
      const detailUrl = `${normalizedBase}${brief.path}`;
      const detail = await fetchJson(detailUrl);
      return normalizeBriefEntry(brief, detail);
    })
  );

  const exportPayload = {
    generatedAt: new Date().toISOString(),
    source: normalizedBase,
    total: detailed.length,
    briefs: detailed,
  };

  const outputPath = path.resolve(process.cwd(), out);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(exportPayload, null, 2));

  console.log(`Export complete: ${detailed.length} briefings -> ${outputPath}`);
}

main().catch((error) => {
  console.error('Extraction failed:', error.message);
  process.exit(1);
});
