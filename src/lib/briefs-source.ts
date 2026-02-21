import { readFileSync } from 'fs';
import { join } from 'path';

export interface BriefMetadata {
  title: string;
  file: string;
  date: string;
  type: string;
  timestamp: string;
  path: string;
}

export interface BriefDocument {
  title: string;
  file: string;
  date: string;
  type: string;
  timestamp: string;
  content: string;
}

// Categorize briefing by filename
function categorizeBrief(filename: string): string {
  if (filename.includes('morning')) return 'Morning Ideas';
  if (filename.includes('midday')) return 'Midday Ideas';
  if (filename.includes('afternoon')) return 'Afternoon Ideas';
  if (filename.includes('evening')) return 'Evening Wrap';
  if (filename.includes('strategy') || filename.includes('weekly')) return 'Strategy';
  if (filename.includes('pain-point') || filename.includes('research')) return 'Research';
  if (filename.includes('outreach')) return 'Outreach';
  if (filename.includes('lead') || filename.includes('scoring')) return 'Lead Scoring';
  if (filename.includes('sales')) return 'Sales';
  return 'Other';
}

// Extract date from filename
function extractDate(filename: string): string {
  const match = filename.match(/(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : '';
}

function safeDateValue(input: string) {
  const value = new Date(input).getTime();
  return Number.isFinite(value) ? value : 0;
}

export function listBriefMetadata(): BriefMetadata[] {
  try {
    const indexPath = join(process.cwd(), 'public', 'data', 'briefings-index.json');
    const indexData = readFileSync(indexPath, 'utf-8');
    const index = JSON.parse(indexData);

    return (index.briefings || [])
      .map((filename: string): BriefMetadata | null => {
        const date = extractDate(filename);
        if (!date) return null; // Skip if no date found

        return {
          title: filename.replace(/\.(md|json)$/, '').replace(/-/g, ' '),
          file: filename,
          date,
          type: categorizeBrief(filename),
          timestamp: `${date}T00:00:00.000Z`,
          path: `/api/briefs/view?file=${encodeURIComponent(filename)}`,
        };
      })
      .filter((brief: BriefMetadata | null): brief is BriefMetadata => brief !== null)
      .sort((a: BriefMetadata, b: BriefMetadata) => safeDateValue(b.timestamp) - safeDateValue(a.timestamp));
  } catch (error) {
    console.error('Error reading briefings index:', error);
    return [];
  }
}

export function loadBriefDocuments(): BriefDocument[] {
  const metadata = listBriefMetadata();
  return metadata.map((m) => {
    // Try to load actual file content
    let content = '';
    try {
      const briefPath = join(process.cwd(), 'public', 'data', 'briefings', m.file);
      content = readFileSync(briefPath, 'utf-8');
    } catch (error) {
      // Content is optional, just leave empty if file can't be read
    }

    return {
      title: m.title,
      file: m.file,
      date: m.date,
      type: m.type,
      timestamp: m.timestamp,
      content,
    };
  });
}

export function getBriefDocumentByFile(file: string): BriefDocument | null {
  // Prevent path traversal
  if (file.includes('..') || file.includes('/')) {
    return null;
  }

  try {
    const indexPath = join(process.cwd(), 'public', 'data', 'briefings-index.json');
    const indexData = readFileSync(indexPath, 'utf-8');
    const index = JSON.parse(indexData);

    const exists = (index.briefings || []).includes(file);
    if (!exists) return null;

    const date = extractDate(file);
    if (!date) return null;

    // Try to read the actual file content
    let content = '';
    try {
      const briefPath = join(process.cwd(), 'public', 'data', 'briefings', file);
      content = readFileSync(briefPath, 'utf-8');
    } catch {
      // Content is optional
    }

    return {
      title: file.replace(/\.(md|json)$/, '').replace(/-/g, ' '),
      file,
      date,
      type: categorizeBrief(file),
      timestamp: `${date}T00:00:00.000Z`,
      content,
    };
  } catch (error) {
    console.error('Error reading brief:', error);
    return null;
  }
}
