'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Search, Calendar } from 'lucide-react';

interface Brief {
  title: string;
  file: string;
  date: string;
  type: string;
  timestamp: string;
  path: string;
}

export default function BriefingsHub() {
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [selectedBrief, setSelectedBrief] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBriefs, setFilteredBriefs] = useState<Brief[]>([]);

  useEffect(() => {
    fetchBriefs();
  }, []);

  const fetchBriefs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/briefs');
      const data = await response.json();
      setBriefs(data.briefs || []);
      setFilteredBriefs(data.briefs || []);
    } catch (error) {
      console.error('Error loading briefs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewBrief = async (brief: Brief) => {
    try {
      const response = await fetch(brief.path);
      const data = await response.json();
      setSelectedBrief(data);
    } catch (error) {
      console.error('Error loading brief:', error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredBriefs(briefs);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = briefs.filter(
      brief =>
        brief.title.toLowerCase().includes(lowerQuery) ||
        brief.type.toLowerCase().includes(lowerQuery) ||
        brief.date.includes(query)
    );
    setFilteredBriefs(filtered);
  };

  const groupedBriefs = filteredBriefs.reduce((acc, brief) => {
    if (!acc[brief.type]) {
      acc[brief.type] = [];
    }
    acc[brief.type].push(brief);
    return acc;
  }, {} as Record<string, Brief[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📋 Briefings & Reports</h1>
          <p className="text-lg text-gray-600">All daily and weekly briefings, strategy documents, and performance reports</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search briefings by title, type, or date..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredBriefs.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <p className="text-gray-500 text-lg">
              {searchQuery
                ? 'No briefings match your search'
                : 'No briefings available yet. Check back when cron jobs run.'}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedBriefs).map(([type, typeBriefs]) => (
              <div key={type}>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-500">
                  {type}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {typeBriefs.map((brief) => (
                    <button
                      key={brief.file}
                      onClick={() => handleViewBrief(brief)}
                      className="text-left bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-6 border-l-4 border-blue-500 hover:border-blue-600"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{brief.title}</h3>
                        <ArrowRight className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {brief.date}
                        </div>
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                          {brief.type}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detailed View Modal */}
        {selectedBrief && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{selectedBrief.title}</h2>
                  <p className="text-blue-100 mt-1">{selectedBrief.date}</p>
                </div>
                <button
                  onClick={() => setSelectedBrief(null)}
                  className="text-2xl font-bold hover:text-blue-100"
                >
                  ×
                </button>
              </div>

              <div className="p-8">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 whitespace-pre-wrap font-mono text-sm text-gray-800">
                  {selectedBrief.content}
                </div>

                <div className="mt-6 text-sm text-gray-500">
                  <p>Generated: {new Date(selectedBrief.timestamp).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
