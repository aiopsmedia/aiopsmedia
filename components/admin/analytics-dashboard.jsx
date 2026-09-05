'use client';

import * as React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { StatCard } from '@/components/ui/stat-card';
import { Badge } from '@/components/ui/badge';
import { Eye, MousePointerClick, MessageSquare, BarChart3, ExternalLink, AlertTriangle } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

const axisTickStyle = { fill: '#94A3B8', fontSize: 12 };
const gridStroke = 'rgba(148,163,184,0.1)';

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[rgba(148,163,184,0.15)] bg-[#0B1220] px-3 py-2 text-sm shadow-xl">
      {label && <p className="mb-1 font-medium text-[#94A3B8]">{label}</p>}
      {payload.map((entry, i) => (
        <p key={i} className="flex items-center gap-2 text-[#F8FAFC]">
          <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span>{entry.name}:</span>
          <span className="font-semibold">{entry.value}</span>
        </p>
      ))}
    </div>
  );
}

export default function AnalyticsDashboard({ gaId, totals, dailySeries, topPaths, recentPageViews }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#F8FAFC]">Analytics</h1>
        <p className="mt-1 text-sm text-[#94A3B8]">Track visitor engagement and conversion metrics.</p>
      </div>

      {/* GA Status */}
      {!gaId && (
        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardContent className="flex items-center gap-3 py-4">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            <div>
              <p className="text-sm font-medium text-amber-300">Google Analytics not configured</p>
              <p className="text-xs text-[#94A3B8]">
                Set <code className="rounded bg-[#111827] px-1 py-0.5 text-[#22D3EE]">GOOGLE_ANALYTICS_ID</code> in your environment to enable GA tracking.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {gaId && (
        <Card className="border-emerald-500/20 bg-emerald-500/5">
          <CardContent className="flex items-center gap-3 py-4">
            <div className="h-2 w-2 rounded-full bg-emerald-400" />
            <p className="text-sm text-emerald-300">
              Google Analytics is active (ID: {gaId})
            </p>
          </CardContent>
        </Card>
      )}

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Page Views" value={totals.pageViews} icon={Eye} />
        <StatCard label="CTA Clicks" value={totals.ctaClicks} icon={MousePointerClick} />
        <StatCard label="Contact Submissions" value={totals.contactSubmissions} icon={MessageSquare} />
        <StatCard
          label="Conversion Rate"
          value={
            totals.pageViews > 0
              ? `${((totals.contactSubmissions / totals.pageViews) * 100).toFixed(1)}%`
              : '0%'
          }
          icon={BarChart3}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Daily Traffic (Last 30 Days)</CardTitle>
            <CardDescription>Page views and CTA clicks per day</CardDescription>
          </CardHeader>
          <CardContent>
            {dailySeries.length === 0 ? (
              <div className="flex h-[280px] items-center justify-center rounded-lg border border-dashed border-[rgba(148,163,184,0.15)]">
                <p className="text-sm text-[#94A3B8]">No traffic data available</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={dailySeries} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke={gridStroke} vertical={false} />
                  <XAxis dataKey="date" tick={axisTickStyle} axisLine={{ stroke: gridStroke }} tickLine={false} />
                  <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend wrapperStyle={{ color: '#94A3B8', fontSize: 12 }} />
                  <Area type="monotone" dataKey="pageViews" name="Page Views" stroke="#22D3EE" fill="rgba(34,211,238,0.1)" strokeWidth={2} />
                  <Area type="monotone" dataKey="ctaClicks" name="CTA Clicks" stroke="#8B5CF6" fill="rgba(139,92,246,0.1)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Pages</CardTitle>
            <CardDescription>Most visited paths</CardDescription>
          </CardHeader>
          <CardContent>
            {topPaths.length === 0 ? (
              <div className="flex h-[280px] items-center justify-center rounded-lg border border-dashed border-[rgba(148,163,184,0.15)]">
                <p className="text-sm text-[#94A3B8]">No page data available</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={topPaths} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
                  <CartesianGrid stroke={gridStroke} horizontal={false} />
                  <XAxis type="number" tick={axisTickStyle} axisLine={{ stroke: gridStroke }} tickLine={false} allowDecimals={false} />
                  <YAxis type="category" dataKey="path" width={140} tick={axisTickStyle} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(148,163,184,0.05)' }} />
                  <Bar dataKey="count" name="Views" radius={[0, 6, 6, 0]} fill="#22D3EE" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent page views */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Page Views</CardTitle>
          <CardDescription>Last 20 page view events</CardDescription>
        </CardHeader>
        <CardContent>
          {recentPageViews.length === 0 ? (
            <p className="text-sm text-[#94A3B8]">No recent events.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[rgba(148,163,184,0.1)] text-left text-[#94A3B8]">
                    <th className="pb-2 font-medium">Path</th>
                    <th className="pb-2 font-medium">IP</th>
                    <th className="pb-2 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPageViews.map((e) => (
                    <tr key={e.id} className="border-b border-[rgba(148,163,184,0.05)]">
                      <td className="py-2 text-[#F8FAFC]">{e.path || '—'}</td>
                      <td className="py-2 text-[#94A3B8]">{e.ip || '—'}</td>
                      <td className="py-2 text-[#94A3B8]">{formatRelativeTime(e.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
