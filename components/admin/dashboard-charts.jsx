'use client';

import * as React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

const COLORS = ['#22D3EE', '#8B5CF6', '#A78BFA', '#34D399', '#FBBF24', '#F87171', '#60A5FA', '#F472B6'];

const axisTickStyle = { fill: '#94A3B8', fontSize: 12 };
const gridStroke = 'rgba(148,163,184,0.1)';

function ChartTooltip({ active, payload, label, currency = false }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[rgba(148,163,184,0.15)] bg-[#0B1220] px-3 py-2 text-sm shadow-xl">
      {label && <p className="mb-1 font-medium text-[#94A3B8]">{label}</p>}
      {payload.map((entry, i) => (
        <p key={i} className="flex items-center gap-2 text-[#F8FAFC]">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color || entry.payload?.fill }}
          />
          <span>{entry.name}:</span>
          <span className="font-semibold">
            {currency ? `₹${Number(entry.value).toLocaleString('en-IN')}` : entry.value}
          </span>
        </p>
      ))}
    </div>
  );
}

export function RevenueLineChart({ data }) {
  if (!data || data.length === 0) {
    return <EmptyChart label="No revenue data available" />;
  }
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={gridStroke} vertical={false} />
        <XAxis dataKey="month" tick={axisTickStyle} axisLine={{ stroke: gridStroke }} tickLine={false} />
        <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} width={60} />
        <Tooltip content={<ChartTooltip currency />} />
        <Legend wrapperStyle={{ color: '#94A3B8', fontSize: 12 }} />
        <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#22D3EE" strokeWidth={2.5} dot={{ r: 3, fill: '#22D3EE' }} activeDot={{ r: 5 }} />
        <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#F87171" strokeWidth={2.5} dot={{ r: 3, fill: '#F87171' }} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function LeadFunnelChart({ data }) {
  if (!data || data.length === 0) {
    return <EmptyChart label="No lead data available" />;
  }
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
        <CartesianGrid stroke={gridStroke} horizontal={false} />
        <XAxis type="number" tick={axisTickStyle} axisLine={{ stroke: gridStroke }} tickLine={false} allowDecimals={false} />
        <YAxis type="category" dataKey="name" width={90} tick={axisTickStyle} axisLine={false} tickLine={false} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(148,163,184,0.05)' }} />
        <Bar dataKey="count" name="Leads" radius={[0, 6, 6, 0]} fill="#22D3EE">
          {data.map((entry, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ProjectStatusChart({ data }) {
  if (!data || data.length === 0) {
    return <EmptyChart label="No project data available" />;
  }
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={90}
          innerRadius={55}
          paddingAngle={3}
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltip />} />
        <Legend wrapperStyle={{ color: '#94A3B8', fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function RevenueByServiceChart({ data }) {
  if (!data || data.length === 0) {
    return <EmptyChart label="No service revenue data" />;
  }
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={gridStroke} vertical={false} />
        <XAxis dataKey="name" tick={axisTickStyle} axisLine={{ stroke: gridStroke }} tickLine={false} />
        <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} width={60} />
        <Tooltip content={<ChartTooltip currency />} cursor={{ fill: 'rgba(148,163,184,0.05)' }} />
        <Bar dataKey="revenue" name="Revenue" radius={[6, 6, 0, 0]} fill="#8B5CF6">
          {data.map((entry, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ExpenseByCategoryChart({ data }) {
  if (!data || data.length === 0) {
    return <EmptyChart label="No expense data available" />;
  }
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="amount"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={90}
          innerRadius={55}
          paddingAngle={3}
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltip currency />} />
        <Legend wrapperStyle={{ color: '#94A3B8', fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

function EmptyChart({ label }) {
  return (
    <div className="flex h-[280px] items-center justify-center rounded-lg border border-dashed border-[rgba(148,163,184,0.15)]">
      <p className="text-sm text-[#94A3B8]">{label}</p>
    </div>
  );
}

export function ChartCard({ title, description, children, className }) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
