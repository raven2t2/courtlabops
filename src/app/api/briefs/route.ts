import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    const briefsDir = join(process.cwd(), '..', 'courtlab-briefings');
    let briefs: any[] = [];

    try {
      const files = readdirSync(briefsDir)
        .filter(f => f.endsWith('.json'))
        .sort()
        .reverse();

      files.forEach(file => {
        try {
          const filePath = join(briefsDir, file);
          const content = readFileSync(filePath, 'utf-8');
          const data = JSON.parse(content);

          briefs.push({
            title: data.title,
            file,
            date: data.date,
            type: data.type,
            timestamp: data.timestamp,
            path: `/api/briefs/view?file=${encodeURIComponent(file)}`
          });
        } catch (e) {
          console.error(`Error parsing ${file}:`, e);
        }
      });
    } catch (e) {
      console.error('Error reading briefings directory:', e);
    }

    // Sort by date (newest first)
    briefs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return Response.json({ briefs, total: briefs.length });
  } catch (error) {
    console.error('Error fetching briefs:', error);
    return Response.json({ error: 'Failed to fetch briefs', briefs: [], total: 0 });
  }
}
