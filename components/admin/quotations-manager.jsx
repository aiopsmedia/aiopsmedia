'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Pagination } from '@/components/ui/pagination';
import { Search, Plus, Filter, FileSpreadsheet, Printer, ExternalLink } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { QUOTATION_STATUSES, QUOTATION_STATUS_LABELS } from '@/config/constants';

const statusVariant = {
  DRAFT: 'outline',
  SENT: 'info',
  ACCEPTED: 'success',
  REJECTED: 'danger',
  EXPIRED: 'warning',
};

export default function QuotationsManager({ initialQuotations, total, initialFilters }) {
  const router = useRouter();
  const [filters, setFilters] = React.useState(initialFilters);

  const updateUrl = (next) => {
    const params = new URLSearchParams();
    Object.entries(next).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    router.push(`/admin/quotations?${params.toString()}`);
  };

  const handleFilterChange = (key, value) => {
    const next = { ...filters, [key]: value, page: 1 };
    setFilters(next);
    updateUrl(next);
  };

  const handlePageChange = (page) => {
    const next = { ...filters, page };
    setFilters(next);
    updateUrl(next);
  };

  const totalPages = Math.max(1, Math.ceil(total / filters.pageSize));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC]">Quotations</h1>
          <p className="mt-1 text-sm text-[#94A3B8]">Manage your sales quotations and proposals.</p>
        </div>
        <Button>
          <Plus className="h-4 w-4" /> Create Quotation
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
              <Input
                className="pl-10"
                placeholder="Search quotations..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={filters.status || 'all'} onValueChange={(v) => handleFilterChange('status', v === 'all' ? '' : v)}>
                <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {QUOTATION_STATUSES.map((s) => <SelectItem key={s} value={s}>{QUOTATION_STATUS_LABELS[s]}</SelectItem>)}
                </SelectContent>
              </Select>
              {(filters.search || filters.status) && (
                <Button variant="ghost" size="sm" onClick={() => router.push('/admin/quotations')}>
                  <Filter className="h-4 w-4" /> Clear
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {initialQuotations.length === 0 ? (
        <Card>
          <EmptyState
            icon={FileSpreadsheet}
            title="No quotations found"
            description="Create your first quotation to get started."
            action="Create Quotation"
            onAction={() => {}}
          />
        </Card>
      ) : (
        <>
          <Card className="hidden overflow-hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[rgba(148,163,184,0.15)]">
                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-[#94A3B8]">Quotation #</th>
                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-[#94A3B8]">Client</th>
                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-[#94A3B8]">Amount</th>
                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-[#94A3B8]">Status</th>
                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-[#94A3B8]">Valid Until</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {initialQuotations.map((quotation) => (
                    <tr key={quotation.id} className="border-b border-[rgba(148,163,184,0.05)] transition-colors hover:bg-[#111827]/50">
                      <td className="px-4 py-3 font-medium text-[#F8FAFC]">{quotation.quotationNumber}</td>
                      <td className="px-4 py-3 text-[#94A3B8]">{quotation.client?.companyName || '—'}</td>
                      <td className="px-4 py-3 text-[#F8FAFC]">{formatCurrency(quotation.total)}</td>
                      <td className="px-4 py-3">
                        <Badge variant={statusVariant[quotation.status]}>{QUOTATION_STATUS_LABELS[quotation.status]}</Badge>
                      </td>
                      <td className="px-4 py-3 text-[#94A3B8]">{quotation.validUntil ? formatDate(quotation.validUntil) : '—'}</td>
                      <td className="px-4 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">•••</Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem><ExternalLink className="h-4 w-4" /> Preview</DropdownMenuItem>
                            <DropdownMenuItem><Printer className="h-4 w-4" /> Print</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4">
              <Pagination currentPage={filters.page} totalPages={totalPages} onPageChange={handlePageChange} totalItems={total} pageSize={filters.pageSize} />
            </div>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 md:hidden">
            {initialQuotations.map((quotation) => (
              <Card key={quotation.id} className="p-4">
                <div className="flex items-start justify-between">
                  <span className="font-medium text-[#F8FAFC]">{quotation.quotationNumber}</span>
                  <Badge variant={statusVariant[quotation.status]}>{QUOTATION_STATUS_LABELS[quotation.status]}</Badge>
                </div>
                <p className="mt-1 text-sm text-[#94A3B8]">{quotation.client?.companyName || '—'}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-semibold text-[#F8FAFC]">{formatCurrency(quotation.total)}</span>
                  <span className="text-xs text-[#94A3B8]">{quotation.validUntil ? formatDate(quotation.validUntil) : ''}</span>
                </div>
              </Card>
            ))}
          </div>
          {initialQuotations.length > 0 && (
            <Pagination currentPage={filters.page} totalPages={totalPages} onPageChange={handlePageChange} totalItems={total} pageSize={filters.pageSize} />
          )}
        </>
      )}
    </div>
  );
}
