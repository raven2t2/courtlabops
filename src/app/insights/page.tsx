import Link from 'next/link';

export default function InsightsPage() {
  const insights = [
    {
      id: 'au-keyword-research',
      title: 'Australian Basketball App Keywords',
      description: 'Research on 30 high-intent keywords for Australian basketball coaches',
      date: '2026-02-09',
      category: 'ASA & ASO Strategy',
      tags: ['keyword-research', 'australia', 'apple-search-ads', 'basketball'],
      summary: 'Market analysis identifying combine timer, stats, and player development keywords with conversion intent. Competitor positioning vs HomeCourt, Sideline, and Coach\'s Eye.'
    },
    {
      id: 'au-asa-strategy',
      title: 'AU Apple Search Ads Campaign Strategy',
      description: 'Complete ASA campaign structure with keyword grouping, bid recommendations, and 90-day roadmap',
      date: '2026-02-09',
      category: 'ASA Strategy',
      tags: ['apple-search-ads', 'paid-ads', 'australia', 'campaign'],
      summary: 'How to fix 0.91% CTR with high-intent keywords. Recommended daily budget allocation (70/20/10 split), ad messaging, and App Store listing optimizations.'
    },
    {
      id: 'aso-strategy-2026',
      title: 'App Store Optimization Strategy 2026',
      description: 'Comprehensive ASO guide covering keywords, metadata, creative, and A/B testing',
      date: '2026-02-08',
      category: 'ASO Strategy',
      tags: ['app-store-optimization', 'aso', 'organic-growth'],
      summary: 'How CourtLab wins organic traffic. Title, subtitle, description, screenshot, and review strategy. Integration with paid ads.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Marketing & Growth Insights</h1>
          <p className="text-xl text-gray-600">
            Research, keyword strategies, and growth playbooks for CourtLab's market expansion
          </p>
        </div>

        {/* Insights Grid */}
        <div className="grid gap-8">
          {insights.map((insight) => (
            <div key={insight.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200">
              <div className="p-6">
                {/* Category Badge */}
                <div className="mb-3">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                    {insight.category}
                  </span>
                </div>

                {/* Title & Description */}
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{insight.title}</h2>
                <p className="text-gray-600 mb-4">{insight.description}</p>

                {/* Summary */}
                <p className="text-gray-700 mb-4 leading-relaxed">{insight.summary}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {insight.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Published {new Date(insight.date).toLocaleDateString('en-AU')}</span>
                  <Link href={`/insights/${insight.id}`} className="text-blue-600 hover:text-blue-800 font-semibold">
                    Read Full Report →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Navigation */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">🎯 For Specific Needs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/insights/au-keyword-research" className="text-blue-600 hover:text-blue-800 font-semibold block">
              ↓ Keyword research for ASA campaigns
            </Link>
            <Link href="/insights/au-asa-strategy" className="text-blue-600 hover:text-blue-800 font-semibold block">
              ↓ Campaign structure & bidding strategy
            </Link>
            <Link href="/insights/aso-strategy-2026" className="text-blue-600 hover:text-blue-800 font-semibold block">
              ↓ App Store optimization playbook
            </Link>
            <Link href="/reports" className="text-blue-600 hover:text-blue-800 font-semibold block">
              ↓ Performance reports & analytics
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
