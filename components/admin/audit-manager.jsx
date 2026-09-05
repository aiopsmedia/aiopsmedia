'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { formatDateTime } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Pagination } from '@/components/ui/pagination';
import { Activity, Shield } from 'lucide-react';

const actionVariant = {
  create: 'success',
  update: 'info',
  delete: 'danger',
  login: 'default',
  logout: 'outline',
};

export default function AuditManager({
  initialLogs,
  initialTotal,
  currentPage,
  currentAction,
  currentResource,
  resources,
  pageSize,
}) {
  const router = useRouter();
  const [logs, setLogs] = React.useState(initialLogs);
  const [search, setSearch] = React.useState('');

  const updateQuery = (params) => router.push(`/admin/audit?${params.toString()}`);

  const handleAction = (value) => {
    const params = new URLSearchParams();
    if (value !== 'all') params.set('action', value);
    if (currentResource !== 'all') params.set('resource', currentResource);
    updateQuery(params);
  };

  const handleResource = (value) => {
    const params = new URLSearchParams();
    if (currentAction !== 'all') params.set('action', currentAction);
    if (value !== 'all') params.set('resource', value);
    updateQuery(params);
  };

  const filtered = search.trim()
    ? logs.filter(
        (l) =>
          l.resource?.toLowerCase().includes(search.toLowerCase()) ||
          l.action?.toLowerCase().includes(search.toLowerCase()) ||
          l.user?.name?.toLowerCase().includes(search.toLowerCase())
      )
    : logs;

  const totalPages = Math.max(1, Math.ceil(initialTotal / pageSize));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC]">Audit Logs</h1>
          <p className="mt-1 text-sm text-[#94A3B8]">Track all administrative actions.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div>
            <label className="mb-1 block text-xs text-[#94A3B8]">Action</label>
            <select
              value={currentAction}
              onChange={(e) => handleAction(e.target.value)}
              className="h-9 rounded-lg border border-[rgba(148,163,184,0.15)] bg-[#0B1220] px-3 text-sm text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/50"
            >
              <option value="all">All actions</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
              <option value="login">Login</option>
              <option value="logout">Logout</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-[#94A3B8]">Resource</label>
            <select
              value={currentResource}
              onChange={(e) => handleResource(e.target.value)}
              className="h-9 rounded-lg border border-[rgba(148,163,184,0.15)] bg-[#0B1220] px-3 text-sm text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/50"
            >
              <option value="all">All resources</option>
              {resources.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {logs.length === 0 ? (
        <Card>
          <EmptyState icon={Shield} title="No audit logs" description="No activity has been recorded yet." />
        </Card>
      ) : (
        <Card>
          <div className="divide-y divide-[rgba(148,163,184,0.1)]">
            {filtered.map((log) => (
              <div key={log.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#111827]">
                  <Activity className="h-4 w-4 text-[#22D3EE]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={actionVariant[log.action] || 'outline'}>{log.action}</Badge>
                    <span className="font-medium text-[#F8FAFC]">{log.resource}</span>
                    {log.resourceId && <span className="text-xs text-[#94A3B8]">#{log.resourceId}</span>}
                  </div>
                  <p className="mt-0.5 text-xs text-[#94A3B8]">
                    by {log.user?.name || log.user?.email || 'Unknown'} · {formatDateTime(log.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="p-8 text-center text-sm text-[#94A3B8]">No logs match your filter.</div>
          )}
        </Card>
      )}

      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={(page) => {
            const params = new URLSearchParams();
            if (currentAction !== 'all') params.set('action', currentAction);
            if (currentResource !== 'all') params.set('resource', currentResource);
            params.set('page', String(page));
            updateQuery(params);
          }}
        />
      )}
    </div>
  );
}
