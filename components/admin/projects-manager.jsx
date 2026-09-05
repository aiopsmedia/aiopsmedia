'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Pagination } from '@/components/ui/pagination';
import { Search, Plus, Filter, ChevronUp, ChevronDown, ArrowUpDown, FolderKanban, ArrowUpRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PROJECT_STATUS_LABELS, LEAD_PRIORITY_LABELS as PROJECT_PRIORITIES_LABELS } from '@/config/constants';

const statusVariant = {
  PLANNING: 'info',
  IN_PROGRESS: 'warning',
  ON_HOLD: 'outline',
  REVIEW: 'default',
  COMPLETED: 'success',
  CANCELLED: 'danger',
};

const priorityVariant = {
  LOW: 'outline',
  MEDIUM: 'info',
  HIGH: 'warning',
  URGENT: 'danger',
};

const columns = [
  { key: 'name', label: 'Project', sortable: true },
  { key: 'client', label: 'Client', sortable: false },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'priority', label: 'Priority', sortable: true },
  { key: 'manager', label: 'Manager', sortable: false },
  { key: 'progress', label: 'Progress', sortable: true },
  { key: 'budget', label: 'Budget', sortable: true },
  { key: 'deadline', label: 'Deadline', sortable: true },
];

export default function ProjectsManager({ initialProjects, total, initialFilters, clients, managers, statuses, priorities }) {
  const router = useRouter();
  const [filters, setFilters] = React.useState(initialFilters);

  const updateUrl = (next) => {
    const params = new URLSearchParams();
    Object.entries(next).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    router.push(`/admin/projects?${params.toString()}`);
  };

  const handleFilterChange = (key, value) => {
    const next = { ...filters, [key]: value, page: 1 };
    setFilters(next);
    updateUrl(next);
  };

  const handleSort = (key) => {
    const effectiveKey = key === 'manager' ? 'managerId' : key === 'client' ? 'clientId' : key;
    const next = {
      ...filters,
      sortBy: effectiveKey,
      sortDir: filters.sortBy === effectiveKey && filters.sortDir === 'asc' ? 'desc' : 'asc',
      page: 1,
    };
    setFilters(next);
    updateUrl(next);
  };

  const handlePageChange = (page) => {
    const next = { ...filters, page };
    setFilters(next);
    updateUrl(next);
  };

  const handlePageSizeChange = (pageSize) => {
    const next = { ...filters, pageSize, page: 1 };
    setFilters(next);
    updateUrl(next);
  };

  const totalPages = Math.max(1, Math.ceil(total / filters.pageSize));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC]">Projects</h1>
          <p className="mt-1 text-sm text-[#94A3B8]">Manage all your client projects, tasks, and milestones.</p>
        </div>
        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus className="h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
              <Input
                className="pl-10"
                placeholder="Search projects..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={filters.status || 'all'} onValueChange={(v) => handleFilterChange('status', v === 'all' ? '' : v)}>
                <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {statuses.map((s) => <SelectItem key={s} value={s}>{PROJECT_STATUS_LABELS[s]}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filters.priority || 'all'} onValueChange={(v) => handleFilterChange('priority', v === 'all' ? '' : v)}>
                <SelectTrigger className="w-36"><SelectValue placeholder="Priority" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  {priorities.map((p) => <SelectItem key={p} value={p}>{PROJECT_PRIORITIES_LABELS[p]}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filters.client || 'all'} onValueChange={(v) => handleFilterChange('client', v === 'all' ? '' : v)}>
                <SelectTrigger className="w-36"><SelectValue placeholder="Client" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  {clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.companyName}</SelectItem>)}
                </SelectContent>
              </Select>
              {(filters.status || filters.priority || filters.client || filters.search) && (
                <Button variant="ghost" size="sm" onClick={() => router.push('/admin/projects')}>
                  <Filter className="h-4 w-4" /> Clear
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {initialProjects.length === 0 ? (
        <Card>
          <EmptyState
            icon={FolderKanban}
            title="No projects found"
            description="Create your first project to start tracking work."
            action="New Project"
            onAction={() => {}}
          />
        </Card>
      ) : (
        <>
          <Card className="hidden overflow-hidden lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[rgba(148,163,184,0.15)]">
                    {columns.map((col) => (
                      <th key={col.key} className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-[#94A3B8]">
                        {col.sortable ? (
                          <button type="button" onClick={() => handleSort(col.key)} className="flex items-center gap-1 hover:text-[#F8FAFC]">
                            {col.label}
                            {filters.sortBy === (col.key === 'manager' ? 'managerId' : col.key === 'client' ? 'clientId' : col.key) ? (
                              filters.sortDir === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                            ) : (
                              <ArrowUpDown className="h-3 w-3 opacity-40" />
                            )}
                          </button>
                        ) : col.label}
                      </th>
                    ))}
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {initialProjects.map((project) => (
                    <tr key={project.id} className="group border-b border-[rgba(148,163,184,0.05)] transition-colors hover:bg-[#111827]/50">
                      <td className="px-4 py-3">
                        <Link href={`/admin/projects/${project.id}`} className="font-medium text-[#F8FAFC] hover:text-[#22D3EE]">
                          {project.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-[#94A3B8]">{project.client?.companyName || '—'}</td>
                      <td className="px-4 py-3">
                        <Badge variant={statusVariant[project.status]}>{PROJECT_STATUS_LABELS[project.status]}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={priorityVariant[project.priority]}>{PROJECT_PRIORITIES_LABELS[project.priority]}</Badge>
                      </td>
                      <td className="px-4 py-3 text-[#94A3B8]">{project.manager?.name || '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Progress value={project.progress} className="h-2 w-24" />
                          <span className="text-xs text-[#94A3B8]">{project.progress}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[#F8FAFC]">{formatCurrency(project.budget || 0)}</td>
                      <td className="px-4 py-3 text-[#94A3B8]">{project.deadline ? formatDate(project.deadline) : '—'}</td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <Link href={`/admin/projects/${project.id}`}><ArrowUpRight className="h-4 w-4" /></Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4">
              <Pagination
                currentPage={filters.page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={total}
                pageSize={filters.pageSize}
                onPageSizeChange={handlePageSizeChange}
              />
            </div>
          </Card>

          {/* Mobile cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
            {initialProjects.map((project) => (
              <Card key={project.id} className="p-4">
                <div className="flex items-start justify-between">
                  <Link href={`/admin/projects/${project.id}`} className="font-medium text-[#F8FAFC] hover:text-[#22D3EE]">
                    {project.name}
                  </Link>
                  <Badge variant={statusVariant[project.status]}>{PROJECT_STATUS_LABELS[project.status]}</Badge>
                </div>
                <p className="mt-1 text-sm text-[#94A3B8]">{project.client?.companyName || 'No client'}</p>
                <div className="mt-3">
                  <div className="mb-1 flex justify-between text-xs text-[#94A3B8]">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-[#F8FAFC]">{formatCurrency(project.budget || 0)}</span>
                  <span className="text-[#94A3B8]">{project.deadline ? formatDate(project.deadline) : 'No deadline'}</span>
                </div>
              </Card>
            ))}
          </div>
          {initialProjects.length > 0 && (
            <Pagination
              currentPage={filters.page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={total}
              pageSize={filters.pageSize}
            />
          )}
        </>
      )}
    </div>
  );
}
