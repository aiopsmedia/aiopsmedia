'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Pagination } from '@/components/ui/pagination';
import { Search, Download, Plus, Pencil, Trash2, Eye, Filter, ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-react';
import LeadForm from '@/components/admin/lead-form';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalDescription,
} from '@/components/ui/modal';
import { LEAD_STATUS_LABELS, LEAD_PRIORITY_LABELS, LEAD_SOURCE_LABELS } from '@/config/constants';
import { bulkUpdateLeads, deleteLead } from '@/actions/leads';

const statusVariant = {
  NEW: 'info',
  CONTACTED: 'warning',
  QUALIFIED: 'default',
  PROPOSAL: 'info',
  NEGOTIATION: 'warning',
  WON: 'success',
  LOST: 'danger',
  CLOSED: 'outline',
};

const priorityVariant = {
  LOW: 'outline',
  MEDIUM: 'info',
  HIGH: 'warning',
  URGENT: 'danger',
};

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'company', label: 'Company', sortable: true },
  { key: 'email', label: 'Email', sortable: false },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'priority', label: 'Priority', sortable: true },
  { key: 'source', label: 'Source', sortable: true },
  { key: 'assignedTo', label: 'Assigned', sortable: false },
  { key: 'createdAt', label: 'Created', sortable: true },
];

export default function LeadsManager({ initialLeads, total, initialFilters, users, services, statuses, priorities, sources }) {
  const router = useRouter();

  const [leads, setLeads] = React.useState(initialLeads);
  const [filters, setFilters] = React.useState(initialFilters);
  const [selected, setSelected] = React.useState([]);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingLead, setEditingLead] = React.useState(null);
  const [deleteModal, setDeleteModal] = React.useState(null);
  const [viewLead, setViewLead] = React.useState(null);
  const [bulkAction, setBulkAction] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const updateUrl = (newFilters) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    router.push(`/admin/leads?${params.toString()}`);
  };

  const handleFilterChange = (key, value) => {
    const next = { ...filters, [key]: value, page: 1 };
    setFilters(next);
    setSelected([]);
    updateUrl(next);
  };

  const handleSort = (key) => {
    const next = {
      ...filters,
      sortBy: key,
      sortDir: filters.sortBy === key && filters.sortDir === 'asc' ? 'desc' : 'asc',
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

  const exportCsv = () => {
    const headers = ['Name', 'Company', 'Email', 'Phone', 'WhatsApp', 'Website', 'Industry', 'Location', 'Service', 'Source', 'Budget', 'Status', 'Priority', 'Notes', 'Follow Up Date', 'Created At'];
    const rows = leads.map((lead) => [
      lead.name,
      lead.company || '',
      lead.email || '',
      lead.phone || '',
      lead.whatsapp || '',
      lead.website || '',
      lead.industry || '',
      lead.location || '',
      lead.service || '',
      LEAD_SOURCE_LABELS[lead.source] || lead.source,
      lead.budget || '',
      LEAD_STATUS_LABELS[lead.status] || lead.status,
      LEAD_PRIORITY_LABELS[lead.priority] || lead.priority,
      (lead.notes || '').replace(/\n/g, ' '),
      lead.followUpDate ? formatDate(lead.followUpDate) : '',
      formatDate(lead.createdAt),
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleBulk = async () => {
    if (!bulkAction || selected.length === 0) return;
    setLoading(true);
    try {
      const res = await bulkUpdateLeads(selected, bulkAction);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success(`Updated ${res.count} lead(s)`);
        setBulkAction(null);
        setSelected([]);
        router.refresh();
      }
    } catch {
      toast.error('Failed to update leads');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal) return;
    setLoading(true);
    try {
      const res = await deleteLead(deleteModal.id);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success('Lead deleted');
        setDeleteModal(null);
        router.refresh();
      }
    } catch {
      toast.error('Failed to delete lead');
    } finally {
      setLoading(false);
    }
  };

  const allSelected = leads.length > 0 && selected.length === leads.length;
  const totalPages = Math.max(1, Math.ceil(total / filters.pageSize));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC]">Leads</h1>
          <p className="mt-1 text-sm text-[#94A3B8]">Manage, track, and convert your leads.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={exportCsv}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={() => { setEditingLead(null); setModalOpen(true); }}>
            <Plus className="h-4 w-4" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
              <Input
                className="pl-10"
                placeholder="Search leads..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={filters.status || 'all'} onValueChange={(v) => handleFilterChange('status', v === 'all' ? '' : v)}>
                <SelectTrigger className="w-32"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {statuses.map((s) => <SelectItem key={s} value={s}>{LEAD_STATUS_LABELS[s]}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filters.priority || 'all'} onValueChange={(v) => handleFilterChange('priority', v === 'all' ? '' : v)}>
                <SelectTrigger className="w-32"><SelectValue placeholder="Priority" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  {priorities.map((p) => <SelectItem key={p} value={p}>{LEAD_PRIORITY_LABELS[p]}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filters.source || 'all'} onValueChange={(v) => handleFilterChange('source', v === 'all' ? '' : v)}>
                <SelectTrigger className="w-32"><SelectValue placeholder="Source" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {sources.map((s) => <SelectItem key={s} value={s}>{LEAD_SOURCE_LABELS[s]}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filters.assigned || 'all'} onValueChange={(v) => handleFilterChange('assigned', v === 'all' ? '' : v)}>
                <SelectTrigger className="w-32"><SelectValue placeholder="Assigned" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assignees</SelectItem>
                  {users.map((u) => <SelectItem key={u.id} value={u.id}>{u.name || u.email}</SelectItem>)}
                </SelectContent>
              </Select>
              {(filters.status || filters.priority || filters.source || filters.assigned || filters.search) && (
                <Button variant="ghost" size="sm" onClick={() => router.push('/admin/leads')}>
                  <Filter className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk actions */}
      {selected.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-[#22D3EE]/30 bg-[#22D3EE]/5 p-3">
          <span className="text-sm text-[#94A3B8]">{selected.length} selected</span>
          <Select value={bulkAction?.status || 'bulk-status'} onValueChange={(v) => setBulkAction({ status: v === 'bulk-status' ? '' : v })}>
            <SelectTrigger className="w-40 h-9 text-xs"><SelectValue placeholder="Change status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="bulk-status">Change status...</SelectItem>
              {statuses.map((s) => <SelectItem key={s} value={s}>{LEAD_STATUS_LABELS[s]}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={bulkAction?.priority || 'bulk-priority'} onValueChange={(v) => setBulkAction({ priority: v === 'bulk-priority' ? '' : v })}>
            <SelectTrigger className="w-40 h-9 text-xs"><SelectValue placeholder="Change priority" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="bulk-priority">Change priority...</SelectItem>
              {priorities.map((p) => <SelectItem key={p} value={p}>{LEAD_PRIORITY_LABELS[p]}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={bulkAction?.assignedToId || 'bulk-assign'} onValueChange={(v) => setBulkAction({ assignedToId: v === 'bulk-assign' ? '' : v })}>
            <SelectTrigger className="w-40 h-9 text-xs"><SelectValue placeholder="Assign to" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="bulk-assign">Assign to...</SelectItem>
              {users.map((u) => <SelectItem key={u.id} value={u.id}>{u.name || u.email}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button size="sm" onClick={handleBulk} loading={loading}>
            Apply
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setSelected([])}>Clear</Button>
        </div>
      )}

      {/* Table */}
      {leads.length === 0 ? (
        <Card>
          <EmptyState
            title="No leads found"
            description="Try adjusting your filters or add a new lead."
            action="Add Lead"
            onAction={() => { setEditingLead(null); setModalOpen(true); }}
          />
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b border-[rgba(148,163,184,0.15)]">
                  <th className="px-4 py-3">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={(checked) => setSelected(checked ? leads.map((l) => l.id) : [])}
                    />
                  </th>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-[#94A3B8]"
                    >
                      {col.sortable ? (
                        <button
                          type="button"
                          onClick={() => handleSort(col.key === 'assignedTo' ? 'assignedToId' : col.key)}
                          className="flex items-center gap-1 hover:text-[#F8FAFC]"
                        >
                          {col.label}
                          {filters.sortBy === col.key ? (
                            filters.sortDir === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ArrowUpDown className="h-3 w-3 opacity-40" />
                          )}
                        </button>
                      ) : (
                        col.label
                      )}
                    </th>
                  ))}
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="group border-b border-[rgba(148,163,184,0.05)] transition-colors hover:bg-[#111827]/50">
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={selected.includes(lead.id)}
                        onCheckedChange={(checked) =>
                          setSelected((prev) => checked ? [...prev, lead.id] : prev.filter((id) => id !== lead.id))
                        }
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button type="button" onClick={() => setViewLead(lead)} className="font-medium text-[#F8FAFC] hover:text-[#22D3EE]">
                        {lead.name}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-[#94A3B8]">{lead.company || '—'}</td>
                    <td className="px-4 py-3 text-[#94A3B8]">{lead.email || lead.phone || '—'}</td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant[lead.status]}>{LEAD_STATUS_LABELS[lead.status]}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={priorityVariant[lead.priority]}>{LEAD_PRIORITY_LABELS[lead.priority]}</Badge>
                    </td>
                    <td className="px-4 py-3 text-[#94A3B8]">{LEAD_SOURCE_LABELS[lead.source]}</td>
                    <td className="px-4 py-3 text-[#94A3B8]">{lead.assignedTo?.name || 'Unassigned'}</td>
                    <td className="px-4 py-3 text-[#94A3B8]">{formatDate(lead.createdAt)}</td>
                    <td className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">•••</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setViewLead(lead)}>
                            <Eye className="h-4 w-4" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setEditingLead(lead); setModalOpen(true); }}>
                            <Pencil className="h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setDeleteModal(lead)} className="text-red-400 focus:text-red-400">
                            <Trash2 className="h-4 w-4" /> Delete
                          </DropdownMenuItem>
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
      )}

      {/* Mobile card layout */}
      <div className="space-y-3 lg:hidden">
        {leads.map((lead) => (
          <Card key={lead.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <p className="font-medium text-[#F8FAFC]">{lead.name}</p>
                <p className="truncate text-sm text-[#94A3B8]">{lead.company || lead.email || '—'}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge variant={statusVariant[lead.status]}>{LEAD_STATUS_LABELS[lead.status]}</Badge>
                <span className="text-xs text-[#94A3B8]">{formatDate(lead.createdAt)}</span>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant={priorityVariant[lead.priority]}>{LEAD_PRIORITY_LABELS[lead.priority]}</Badge>
              <Badge variant="outline">{LEAD_SOURCE_LABELS[lead.source]}</Badge>
            </div>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setViewLead(lead)} className="flex-1">
                <Eye className="h-4 w-4" /> View
              </Button>
              <Button size="sm" variant="outline" onClick={() => { setEditingLead(lead); setModalOpen(true); }} className="flex-1">
                <Pencil className="h-4 w-4" /> Edit
              </Button>
            </div>
          </Card>
        ))}
        {leads.length > 0 && (
          <Pagination
            currentPage={filters.page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={total}
            pageSize={filters.pageSize}
          />
        )}
      </div>

      {/* Add/Edit Lead Modal */}
      <Modal open={modalOpen} onOpenChange={setModalOpen}>
        <ModalContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <ModalHeader>
            <ModalTitle>{editingLead ? 'Edit Lead' : 'Add New Lead'}</ModalTitle>
            <ModalDescription>
              {editingLead ? 'Update the lead details below.' : 'Fill in the details to create a new lead.'}
            </ModalDescription>
          </ModalHeader>
          <LeadForm
            lead={editingLead}
            services={services}
            onClose={() => setModalOpen(false)}
          />
        </ModalContent>
      </Modal>

      {/* View Lead Modal */}
      {viewLead && (
        <Modal open={true} onOpenChange={() => setViewLead(null)}>
          <ModalContent className="sm:max-w-2xl">
            <ModalHeader>
              <div className="flex items-center justify-between pr-8">
                <ModalTitle>{viewLead.name}</ModalTitle>
                <Badge variant={statusVariant[viewLead.status]}>{LEAD_STATUS_LABELS[viewLead.status]}</Badge>
              </div>
              <div className="flex gap-2">
                <Badge variant={priorityVariant[viewLead.priority]}>{LEAD_PRIORITY_LABELS[viewLead.priority]}</Badge>
                <Badge variant="outline">{LEAD_SOURCE_LABELS[viewLead.source]}</Badge>
              </div>
            </ModalHeader>
            <div className="grid gap-4 sm:grid-cols-2 mt-4">
              {[
                ['Company', viewLead.company],
                ['Email', viewLead.email],
                ['Phone', viewLead.phone],
                ['WhatsApp', viewLead.whatsapp],
                ['Website', viewLead.website],
                ['Industry', viewLead.industry],
                ['Location', viewLead.location],
                ['Service', viewLead.service],
                ['Budget', viewLead.budget],
                ['Assigned to', viewLead.assignedTo?.name],
                ['Follow-up', viewLead.followUpDate ? formatDate(viewLead.followUpDate) : ''],
                ['Created', formatDate(viewLead.createdAt)],
              ].filter(([, v]) => v).map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs font-medium uppercase tracking-wider text-[#94A3B8]">{label}</p>
                  <p className="mt-0.5 text-sm text-[#F8FAFC]">{value}</p>
                </div>
              ))}
            </div>
            {viewLead.notes && (
              <div className="mt-4">
                <p className="text-xs font-medium uppercase tracking-wider text-[#94A3B8]">Notes</p>
                <p className="mt-0.5 text-sm text-[#F8FAFC]">{viewLead.notes}</p>
              </div>
            )}
            <ModalFooter>
              <Button variant="outline" onClick={() => { setViewLead(null); setEditingLead(viewLead); setModalOpen(true); }}>
                <Pencil className="h-4 w-4" /> Edit
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {/* Delete Confirm Modal */}
      {deleteModal && (
        <Modal open={true} onOpenChange={() => setDeleteModal(null)}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Delete Lead</ModalTitle>
              <ModalDescription>
                Are you sure you want to delete <span className="font-medium text-[#F8FAFC]">{deleteModal.name}</span>? This action cannot be undone.
              </ModalDescription>
            </ModalHeader>
            <ModalFooter>
              <Button variant="ghost" onClick={() => setDeleteModal(null)}>Cancel</Button>
              <Button variant="destructive" onClick={confirmDelete} loading={loading}>Delete</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
