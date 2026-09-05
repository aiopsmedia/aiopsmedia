'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { EmptyState } from '@/components/ui/empty-state';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Plus, Pencil, Trash2, Search, Eye, Building2 } from 'lucide-react';
import { clientSchema } from '@/lib/validations';

const emptyForm = {
  companyName: '',
  contactPerson: '',
  email: '',
  phone: '',
  address: '',
  website: '',
  industry: '',
  notes: '',
};

export default function ClientsManager({ initialClients }) {
  const [clients, setClients] = React.useState(initialClients);
  const [search, setSearch] = React.useState('');
  const [showModal, setShowModal] = React.useState(false);
  const [editing, setEditing] = React.useState(null);
  const [form, setForm] = React.useState(emptyForm);
  const [saving, setSaving] = React.useState(false);
  const [detailClient, setDetailClient] = React.useState(null);
  const [detailData, setDetailData] = React.useState(null);
  const [loadingDetail, setLoadingDetail] = React.useState(false);

  const filtered = clients.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.companyName.toLowerCase().includes(q) ||
      (c.contactPerson && c.contactPerson.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q))
    );
  });

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  }

  function openEdit(client) {
    setEditing(client);
    setForm({
      companyName: client.companyName,
      contactPerson: client.contactPerson || '',
      email: client.email || '',
      phone: client.phone || '',
      address: client.address || '',
      website: client.website || '',
      industry: client.industry || '',
      notes: client.notes || '',
    });
    setShowModal(true);
  }

  async function handleSave() {
    const parsed = clientSchema.safeParse(form);
    if (!parsed.success) {
      toast.error('Please check form fields');
      return;
    }
    setSaving(true);

    try {
      if (editing) {
        const res = await fetch(`/api/clients/${editing.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error();
        toast.success('Client updated');
      } else {
        const res = await fetch('/api/clients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error();
        toast.success('Client created');
      }
      setShowModal(false);
      // Refetch
      const { getDashboardData } = await import('@/actions/dashboard');
      window.location.reload();
    } catch {
      toast.error('Failed to save client');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this client?')) return;
    try {
      const res = await fetch(`/api/clients/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setClients((prev) => prev.filter((c) => c.id !== id));
      toast.success('Client deleted');
    } catch {
      toast.error('Failed to delete client');
    }
  }

  async function viewDetail(client) {
    setDetailClient(client);
    setLoadingDetail(true);
    try {
      const res = await fetch(`/api/clients/${client.id}/detail`);
      if (res.ok) {
        const data = await res.json();
        setDetailData(data);
      }
    } catch {}
    setLoadingDetail(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC]">Clients</h1>
          <p className="mt-1 text-sm text-[#94A3B8]">{clients.length} total clients</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Client
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
        <Input
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="p-8">
              <EmptyState title="No clients" description="Add your first client to get started." />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[rgba(148,163,184,0.1)] text-left text-[#94A3B8]">
                    <th className="p-4 font-medium">Company</th>
                    <th className="p-4 font-medium">Contact</th>
                    <th className="p-4 font-medium">Email</th>
                    <th className="p-4 font-medium">Phone</th>
                    <th className="p-4 font-medium">Industry</th>
                    <th className="p-4 font-medium">Projects</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((client) => (
                    <tr key={client.id} className="border-b border-[rgba(148,163,184,0.05)] transition-colors hover:bg-[#22D3EE]/[0.02]">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-[#22D3EE]" />
                          <span className="font-medium text-[#F8FAFC]">{client.companyName}</span>
                        </div>
                      </td>
                      <td className="p-4 text-[#94A3B8]">{client.contactPerson || '—'}</td>
                      <td className="p-4 text-[#94A3B8]">{client.email || '—'}</td>
                      <td className="p-4 text-[#94A3B8]">{client.phone || '—'}</td>
                      <td className="p-4 text-[#94A3B8]">{client.industry || '—'}</td>
                      <td className="p-4 text-[#94A3B8]">{client._count?.projects || 0}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => viewDetail(client)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openEdit(client)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(client.id)}>
                            <Trash2 className="h-4 w-4 text-red-400" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="space-y-4 p-6">
          <h2 className="text-lg font-semibold text-[#F8FAFC]">
            {editing ? 'Edit Client' : 'Add Client'}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Company Name *</Label>
              <Input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Contact Person</Label>
              <Input value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Website</Label>
              <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Industry</Label>
              <Input value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={!!detailClient} onClose={() => { setDetailClient(null); setDetailData(null); }}>
        {detailClient && (
          <div className="space-y-4 p-6">
            <h2 className="text-lg font-semibold text-[#F8FAFC]">{detailClient.companyName}</h2>
            {loadingDetail ? (
              <p className="text-sm text-[#94A3B8]">Loading details...</p>
            ) : detailData ? (
              <div className="space-y-4">
                {detailData.projects?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-[#94A3B8] mb-2">Projects</h3>
                    {detailData.projects.map((p) => (
                      <div key={p.id} className="flex items-center justify-between border-b border-[rgba(148,163,184,0.05)] py-2">
                        <span className="text-sm text-[#F8FAFC]">{p.name}</span>
                        <Badge>{p.status}</Badge>
                      </div>
                    ))}
                  </div>
                )}
                {detailData.invoices?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-[#94A3B8] mb-2">Invoices</h3>
                    {detailData.invoices.map((inv) => (
                      <div key={inv.id} className="flex items-center justify-between border-b border-[rgba(148,163,184,0.05)] py-2">
                        <span className="text-sm text-[#F8FAFC]">{inv.invoiceNumber}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-[#94A3B8]">{formatCurrency(Number(inv.total))}</span>
                          <Badge>{inv.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {(!detailData.projects?.length && !detailData.invoices?.length) && (
                  <p className="text-sm text-[#94A3B8]">No projects or invoices yet.</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-[#94A3B8]">Failed to load details.</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
