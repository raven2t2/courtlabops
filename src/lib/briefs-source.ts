import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const FILE_PATTERN = /^[a-z0-9-]+-\d{4}-\d{2}-\d{2}\.json$/i;

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

function getBriefingDirectories() {
  const cwd = process.cwd();
  return [join(cwd, '..', 'courtlab-briefings'), cwd];
}

function coerceBriefDocument(file: string, parsed: unknown): BriefDocument | null {
  if (!parsed || typeof parsed !== 'object') {
    return null;
  }

  const data = parsed as Record<string, unknown>;
  const title = typeof data.title === 'string' ? data.title : file;
  const date = typeof data.date === 'string' ? data.date : '';
  const type = typeof data.type === 'string' ? data.type : 'uncategorized';
  const timestamp =
    typeof data.timestamp === 'string' ? data.timestamp : `${date}T00:00:00.000Z`;
  const content = typeof data.content === 'string' ? data.content : '';

  if (!date) {
    return null;
  }

  return {
    title,
    file,
    date,
    type,
    timestamp,
    content,
  };
}

function safeDateValue(input: string) {
  const value = new Date(input).getTime();
  return Number.isFinite(value) ? value : 0;
}

export function listBriefMetadata(): BriefMetadata[] {
  const docs = loadBriefDocuments();
  return docs.map((brief) => ({
    title: brief.title,
    file: brief.file,
    date: brief.date,
    type: brief.type,
    timestamp: brief.timestamp,
    path: `/api/briefs/view?file=${encodeURIComponent(brief.file)}`,
  }));
}

export function loadBriefDocuments(): BriefDocument[] {
  const docs: BriefDocument[] = [];
  const seen = new Set<string>();

  for (const dir of getBriefingDirectories()) {
    try {
      const files = readdirSync(dir).filter((file) => FILE_PATTERN.test(file));

      for (const file of files) {
        if (seen.has(file)) {
          continue;
        }

        try {
          const raw = readFileSync(join(dir, file), 'utf-8');
          const parsed = JSON.parse(raw);
          const doc = coerceBriefDocument(file, parsed);
          if (!doc) {
            continue;
          }

          seen.add(file);
          docs.push(doc);
        } catch (error) {
          console.error(`Error parsing briefing file ${file}:`, error);
        }
      }
    } catch (error) {
      // Directory can be absent in some environments; continue to fallback dirs.
      const nodeError = error as NodeJS.ErrnoException;
      if (nodeError.code !== 'ENOENT') {
        console.error(`Error reading briefings from ${dir}:`, error);
      }
    }
  }

  return docs.sort((a, b) => safeDateValue(b.timestamp || b.date) - safeDateValue(a.timestamp || a.date));
}

export function getBriefDocumentByFile(file: string): BriefDocument | null {
  if (!FILE_PATTERN.test(file) || file.includes('..') || file.includes('/')) {
    return null;
  }

  for (const dir of getBriefingDirectories()) {
    try {
      const fullPath = join(dir, file);
      const raw = readFileSync(fullPath, 'utf-8');
      const parsed = JSON.parse(raw);
      const doc = coerceBriefDocument(file, parsed);
      if (doc) {
        return doc;
      }
    } catch {
      // Try the next directory location.
    }
  }

  return null;
}
