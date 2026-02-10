'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Brief {
  title: string;
  file: string;
  date: string;
  type: string;
  path: string;
}

export default function BriefingsHub() {
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [selectedBrief, setSelectedBrief] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetch('/api/briefs')
      .then(res => res.json())
      .then(data => {
        setBriefs(data.briefs || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading briefs:', err);
        setLoading(false);
      });
  }, []);

  const handleViewBrief = async (brief: Brief) => {
    try {
      const response = await fetch(brief.path);
      const data = await response.json();
      setSelectedBrief({ ...brief, content: data.content });
    } catch (error) {
      console.error('Error loading brief:', error);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
    }
    setSearching(false);
  };

  const groupedBriefs = briefs.reduce((acc, brief) => {
    if (!acc[brief.type]) {
      acc[brief.type] = [];
    }
    acc[brief.type].push(brief);
    return acc;
  }, {} as Record<string, Brief[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📋 Briefings & Reports Hub</h1>
          <p className="text-lg text-gray-600">Strategy insights, market trends, and performance metrics</p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-6">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search all briefs and reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <button
                type="submit"
                disabled={searching}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {searching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>
        </div>

        {searchResults && (
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">🔍 Search Results</h2>
            {searchResults.count === 0 ? (
              <p className="text-gray-500">No results found for "{searchQuery}"</p>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 mb-3">Found {searchResults.count} files containing "{searchQuery}":</p>
                <ul className="space-y-1">
                  {searchResults.results.slice(0, 10).map((file: string, idx: number) => (
                    <li key={idx} className="text-sm text-gray-700">
                      📄 {file}
                    </li>
                  ))}
                </ul>
                {searchResults.count > 10 && (
                  <p className="text-xs text-gray-500 mt-2">...and {searchResults.count - 10} more results</p>
                )}
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading briefs...</p>
          </div>
        ) : briefs.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 mb-4">No briefs generated yet</p>
            <p className="text-sm text-gray-400">Briefs will appear here as cron jobs generate them</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Briefs List */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {Object.entries(groupedBriefs).map(([type, typeBriefs]) => (
                  <div key={type} className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-3 border-b">
                      {typeBriefs[0].title}
                    </h2>
                    <div className="space-y-2">
                      {typeBriefs.map((brief, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleViewBrief(brief)}
                          className={`w-full text-left p-3 rounded transition ${
                            selectedBrief?.file === brief.file
                              ? 'bg-indigo-50 border-l-4 border-indigo-600'
                              : 'hover:bg-gray-50 border-l-4 border-transparent'
                          }`}
                        >
                          <div className="font-medium text-gray-900">{brief.file}</div>
                          <div className="text-sm text-gray-500">{brief.date}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Brief Content Viewer */}
            {selectedBrief ? (
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow p-6 sticky top-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{selectedBrief.title}</h3>
                  <div className="text-sm text-gray-600 mb-4 pb-4 border-b">
                    <div>{selectedBrief.file}</div>
                    <div className="text-xs text-gray-400">{selectedBrief.date}</div>
                  </div>
                  
                  <div className="prose prose-sm max-w-none">
                    {typeof selectedBrief.content === 'string' ? (
                      <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto max-h-96 whitespace-pre-wrap">
                        {selectedBrief.content}
                      </pre>
                    ) : (
                      <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto max-h-96 whitespace-pre-wrap">
                        {JSON.stringify(selectedBrief.content, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow p-6">
                  <p className="text-gray-500 text-center py-12">Select a brief to view details</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
