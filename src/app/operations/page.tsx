'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, FileText, BarChart3, Users, Calendar, Target } from 'lucide-react';

interface DailyOutput {
  title: string;
  time: string;
  icon: React.ReactNode;
  description: string;
  status: 'ready' | 'pending' | 'processing';
  action?: {
    label: string;
    href: string;
  };
}

export default function Operations() {
  const [outputs, setOutputs] = useState<DailyOutput[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch operations data
    fetch('/api/operations')
      .then(res => res.json())
      .then(data => {
        setOutputs(data.outputs || getDefaultOutputs());
        setLoading(false);
      })
      .catch(() => {
        setOutputs(getDefaultOutputs());
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">🚀 Operations Dashboard</h1>
          </div>
          <p className="text-lg text-gray-600">Daily outputs, marketing briefs, research findings, and execution tracking</p>
        </div>

        {/* Daily Cron Jobs Output */}
        <div className="space-y-8">
          {/* Morning Operations (6 AM - 9 AM) */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-8 bg-orange-500 rounded"></div>
              <h2 className="text-2xl font-bold text-gray-900">🌅 Morning Operations (6-9 AM)</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pain Point Research */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">🔍 Pain Point Research</h3>
                    <p className="text-sm text-gray-500">6:00 AM Daily</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Live</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">Scouts Reddit/Twitter for real coach & parent problems. Returns: top 3 pain points with quotes + sources + feature ideas.</p>
                <Link href="/briefings-hub" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium text-sm">
                  View Latest <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Lead Scoring */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">📊 Lead Scoring</h3>
                    <p className="text-sm text-gray-500">6:30 AM Daily</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Live</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">Evaluates pain points for outreach value. Returns: scored leads (1-10) + conversion confidence + segmentation by audience.</p>
                <Link href="/briefings-hub" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium text-sm">
                  View Scores <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Outreach Drafts */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">✉️ Outreach Drafts</h3>
                    <p className="text-sm text-gray-500">7:00 AM Daily (M-F)</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Live</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">Drafts personalized emails for high-value pain points. Tagged by pain angle. Awaits your approval before sending.</p>
                <div className="space-y-2">
                  <Link href="/briefings-hub" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium text-sm">
                    Review Drafts <ArrowUpRight className="w-4 h-4" />
                  </Link>
                  <p className="text-xs text-gray-500 mt-1">Stored: `/courtlab-crm/outreach-drafts/[DATE]/`</p>
                </div>
              </div>

              {/* Morning Ideas */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">💡 Morning Marketing Ideas</h3>
                    <p className="text-sm text-gray-500">8:00 AM Daily</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Live</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">2-3 high-impact execution-ready moves. Competitive positioning, content angles, partnership opportunities.</p>
                <Link href="/briefings-hub" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium text-sm">
                  View Ideas <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>

          {/* Midday Operations */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-8 bg-yellow-500 rounded"></div>
              <h2 className="text-2xl font-bold text-gray-900">☀️ Midday Operations (11:30 AM)</h2>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">🍽️ Midday Marketing Ideas</h3>
                  <p className="text-sm text-gray-500">11:30 AM Daily</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Live</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">Quick-win tactical move ready THIS AFTERNOON + content angle + partnership opportunity. Assumes autonomous execution authority.</p>
              <Link href="/briefings-hub" className="inline-flex items-center gap-2 text-yellow-600 hover:text-yellow-700 font-medium text-sm">
                View Midday Brief <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </section>

          {/* Afternoon Operations */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-8 bg-blue-500 rounded"></div>
              <h2 className="text-2xl font-bold text-gray-900">⚡ Afternoon Operations (1 PM - 5 PM)</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Autonomous Executor */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">✅ Afternoon Executor</h3>
                    <p className="text-sm text-gray-500">1:00 PM Daily (M-F)</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Live</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">Autonomous ops work: kanban updates, lead research, content queuing, git commits. No Michael input needed.</p>
                <p className="text-xs text-gray-500">Check kanban board for task status</p>
              </div>

              {/* Afternoon Ideas */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">⚡ Afternoon Ideas</h3>
                    <p className="text-sm text-gray-500">3:00 PM Daily</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Live</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">2 execution-ready ideas: tactical PR/content wins (2-4h execution) + tool/feature improvements.</p>
                <Link href="/briefings-hub" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm">
                  View Ideas <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Outreach Feedback */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">🔄 Outreach Feedback Loop</h3>
                    <p className="text-sm text-gray-500">6:00 PM Daily (M-F)</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Live</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">Creates kanban tasks for your replies. You answer: Did they reply? Sentiment? Their message? I track conversion by pain angle.</p>
                <p className="text-xs text-gray-500">Kanban: "Feedback Pending" column</p>
              </div>

              {/* Evening Wrap */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">🌙 Evening Wrap</h3>
                    <p className="text-sm text-gray-500">5:00 PM Daily (M-F)</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Live</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">Quick summary: leads added, drafts waiting, content queued, blocked items. Tight briefing, you're busy.</p>
                <p className="text-xs text-gray-500">Delivered via Telegram</p>
              </div>
            </div>
          </section>

          {/* Weekly Operations */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-8 bg-indigo-500 rounded"></div>
              <h2 className="text-2xl font-bold text-gray-900">📊 Weekly Operations</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Weekly Strategy Brief */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">📄 Weekly Strategy Brief</h3>
                    <p className="text-sm text-gray-500">Sunday 7:00 AM</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Live</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">Positioning pillar focus, content playbook, messaging variations, creator targets, paid angles, competitive intel.</p>
                <Link href="/briefings-hub" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                  View Strategy <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

              {/* ASA Weekly Report */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">📱 ASA Weekly Report</h3>
                    <p className="text-sm text-gray-500">Monday 9:00 AM</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Live</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">Apple Search Ads performance: spend, impressions, taps, installs, CPA, top keywords. Data-driven budget allocation.</p>
                <Link href="/briefings-hub" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                  View Report <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Competitor Watch */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">🔍 Founder/Competitor Watch</h3>
                    <p className="text-sm text-gray-500">Monday 9:00 AM</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Live</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">Tracks Hudl, Synergy, Wiza moves. Funding, launches, partnerships, vulnerabilities, our counter-positioning.</p>
                <Link href="/briefings-hub" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                  View Intel <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Weekly Summary */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">📊 Weekly Summary Report</h3>
                    <p className="text-sm text-gray-500">Friday 4:00 PM</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Live</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">Wins this week, pipeline status, content published count, next week priorities. Tight narrative summary.</p>
                <Link href="/briefings-hub" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                  View Summary <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>

          {/* Quick Access */}
          <section className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-6">⚡ Quick Access</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/briefings-hub" className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition">
                <div className="flex items-center gap-2 font-semibold">
                  <FileText className="w-5 h-5" /> All Briefs & Reports
                </div>
              </Link>
              <Link href="/" className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition">
                <div className="flex items-center gap-2 font-semibold">
                  <BarChart3 className="w-5 h-5" /> Kanban Board
                </div>
              </Link>
              <button onClick={() => {
                const query = prompt('Search workspace:');
                if (query) window.location.href = `/briefings-hub?search=${encodeURIComponent(query)}`;
              }} className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition text-left">
                <div className="flex items-center gap-2 font-semibold">
                  <Users className="w-5 h-5" /> Search All
                </div>
              </button>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-600">
          <p className="text-sm">All outputs auto-generated by cron jobs. Data updates hourly. Last refresh: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
}

function getDefaultOutputs(): DailyOutput[] {
  return [
    {
      title: '🔍 Pain Point Research',
      time: '6:00 AM Daily',
      icon: <Target className="w-6 h-6" />,
      description: 'Scouts Reddit/Twitter for real coach problems. Returns top 3 pain points with quotes.',
      status: 'ready',
    },
    {
      title: '📊 Lead Scoring',
      time: '6:30 AM Daily',
      icon: <BarChart3 className="w-6 h-6" />,
      description: 'Scores pain points by conversion likelihood. High/medium/low value segmentation.',
      status: 'ready',
    },
    {
      title: '✉️ Outreach Drafts',
      time: '7:00 AM Daily',
      icon: <FileText className="w-6 h-6" />,
      description: 'Personalized emails for high-value leads. Tagged by pain point. Awaits approval.',
      status: 'ready',
    },
  ];
}
