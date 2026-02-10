import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    const briefsDir = join(process.cwd(), 'courtlab-crm');
    let briefs: any[] = [];

    // Collect all brief types
    const briefTypes = [
      { dir: 'pain-points', prefix: 'pain-points-', title: '🔍 Pain Point Research' },
      { dir: 'scores', prefix: 'scored-pain-points-', title: '📊 Lead Scoring' },
      { dir: 'outreach-responses', prefix: 'outreach-responses-', title: '✉️ Outreach Feedback' },
      { dir: 'reports', prefix: 'asa-weekly-', title: '📱 ASA Weekly Report' },
      { dir: 'reports', prefix: 'weekly-', title: '📊 Weekly Summary' },
    ];

    briefTypes.forEach(({ dir, prefix, title }) => {
      const fullPath = join(briefsDir, dir);
      try {
        const files = readdirSync(fullPath)
          .filter(f => f.startsWith(prefix) && (f.endsWith('.json') || f.endsWith('.md')))
          .sort()
          .reverse()
          .slice(0, 5); // Last 5 of each type

        files.forEach(file => {
          const filePath = join(fullPath, file);
          const date = file.match(/\d{4}-\d{2}-\d{2}/)?.[0] || 'unknown';
          
          briefs.push({
            title,
            file,
            date,
            type: prefix.replace(/-$/, ''),
            path: `/api/briefs/view?file=${encodeURIComponent(filePath)}`
          });
        });
      } catch (e) {
        // Directory doesn't exist yet, skip
      }
    });

    // Sort by date (newest first)
    briefs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return Response.json({ briefs, total: briefs.length });
  } catch (error) {
    console.error('Error fetching briefs:', error);
    return Response.json({ error: 'Failed to fetch briefs' }, { status: 500 });
  }
}
