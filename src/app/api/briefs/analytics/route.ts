import { buildBriefingsAnalytics } from '@/lib/briefs-analytics';
import { loadBriefDocuments } from '@/lib/briefs-source';

export async function GET() {
  try {
    const docs = loadBriefDocuments();
    const analytics = buildBriefingsAnalytics(docs);
    return Response.json(analytics);
  } catch (error) {
    console.error('Error building briefs analytics:', error);
    return Response.json(
      {
        error: 'Failed to build analytics payload',
        generatedAt: new Date().toISOString(),
        summary: {
          totalBriefs: 0,
          totalTags: 0,
          totalTermMentions: 0,
          totalAdSpend: 0,
          avgCtr: 0,
          avgRoi: 0,
          avgRoaS: 0,
          targetRoiMentions: 0,
        },
        tags: [],
        terms: [],
        timeline: [],
        briefs: [],
      },
      { status: 500 }
    );
  }
}
