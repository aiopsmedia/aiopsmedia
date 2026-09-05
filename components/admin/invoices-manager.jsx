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
import { Search, Plus, Filter, FileText, Printer, ExternalLink } from 'lucide-react';
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
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { PAYMENT_STATUSES, PAYMENT_STATUS_LABELS } from '@/config/constants';

const statusVariant = {
  PENDING: 'warning',
  PARTIAL: 'warning',
  PAID: 'success',
  REFUNDED: 'info',
  CANCELLED: 'outline',
};

export default function InvoicesManager({ initialInvoices, total, initialFilters, clients }) {
  const router = useRouter();
  const [filters, setFilters] = React.useState(initialFilters);

  const updateUrl = (next) => {
    const params = new URLSearchParams();
    Object.entries(next).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    router.push(`/admin/invoices?${params.toString()}`);
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

  const handlePageSizeChange = (pageSize) => {
    const next = { ...filters, pageSize, page: 1 };
    setFilters(next);
    updateUrl(next);
  };

  const totalPages = Math.max(1, Math.ceil(total / filters.pageSize));

  const isOverdue = (invoice) =>
    invoice.status === 'PENDING' && invoice.dueDate && new Date(invoice.dueDate) < new Date();

  const displayStatus = (invoice) => (isOverdue(invoice) ? 'Overdue' : PAYMENT_STATUS_LABELS[invoice.status]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC]">Invoices</h1>
          <p className="mt-1 text-sm text-[#94A3B8]">Create, manage, and track all your invoices.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild><Link href="/admin/invoices/new"><Plus className="h-4 w-4" /> Create Invoice</Link></Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
              <Input
                className="pl-10"
                placeholder="Search invoices..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={filters.status || 'all'} onValueChange={(v) => handleFilterChange('status', v === 'all' ? '' : v)}>
                <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {PAYMENT_STATUSES.map((s) => <SelectItem key={s} value={s}>{PAYMENT_STATUS_LABELS[s]}</SelectItem>)}
                </SelectContent>
              </Select>
              {(filters.search || filters.status) && (
                <Button variant="ghost" size="sm" onClick={() => router.push('/admin/invoices')}>
                  <Filter className="h-4 w-4" /> Clear
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {initialInvoices.length === 0 ? (
        <Card>
          <EmptyState
            icon={FileText}
            title="No invoices found"
            description="Create your first invoice to get started."
            action="Create Invoice"
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
                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-[#94A3B8]">Invoice #</th>
                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-[#94A3B8]">Client</th>
                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-[#94A3B8]">Amount</th>
                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-[#94A3B8]">Status</th>
                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-[#94A3B8]">Due Date</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {initialInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-[rgba(148,163,184,0.05)] transition-colors hover:bg-[#111827]/50">
                      <td className="px-4 py-3">
                        <Link href={`/admin/invoices/${invoice.id}`} className="font-medium text-[#F8FAFC] hover:text-[#22D3EE]">
                          {invoice.invoiceNumber}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-[#94A3B8]">{invoice.client?.companyName || '—'}</td>
                      <td className="px-4 py-3 text-[#F8FAFC]">{formatCurrency(invoice.total)}</td>
                      <td className="px-4 py-3">
                        <Badge variant={isOverdue(invoice) ? 'danger' : statusVariant[invoice.status]}>{displayStatus(invoice)}</Badge>
                      </td>
                      <td className="px-4 py-3 text-[#94A3B8]">{invoice.dueDate ? formatDate(invoice.dueDate) : '—'}</td>
                      <td className="px-4 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">•••</Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild><Link href={`/admin/invoices/${invoice.id}`}><ExternalLink className="h-4 w-4" /> Preview</Link></DropdownMenuItem>
                            <DropdownMenuItem onClick={() => window.print()}><Printer className="h-4 w-4" /> Print</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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

          <div className="grid gap-4 sm:grid-cols-2 md:hidden">
            {initialInvoices.map((invoice) => (
              <Card key={invoice.id} className="p-4">
                <div className="flex items-start justify-between">
                  <Link href={`/admin/invoices/${invoice.id}`} className="font-medium text-[#F8FAFC] hover:text-[#22D3EE]">
                    {invoice.invoiceNumber}
                  </Link>
                  <Badge variant={isOverdue(invoice) ? 'danger' : statusVariant[invoice.status]}>{displayStatus(invoice)}</Badge>
                </div>
                <p className="mt-1 text-sm text-[#94A3B8]">{invoice.client?.companyName || '—'}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-semibold text-[#F8FAFC]">{formatCurrency(invoice.total)}</span>
                  <span className="text-xs text-[#94A3B8]">{invoice.dueDate ? formatDate(invoice.dueDate) : 'No due date'}</span>
                </div>
              </Card>
            ))}
          </div>
          {initialInvoices.length > 0 && (
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
