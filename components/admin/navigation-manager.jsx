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
import { Switch } from '@/components/ui/switch';
import {
  Plus,
  GripVertical,
  Pencil,
  Trash2,
  ExternalLink,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import {
  createNavigationItem,
  updateNavigationItem,
  deleteNavigationItem,
  reorderNavigationItems,
  toggleNavigationItem,
} from '@/actions/navigation';

const emptyForm = { label: '', url: '', location: 'header', isExternal: false, order: 0, parentId: '' };

export default function NavigationManager({ initialItems }) {
  const [items, setItems] = React.useState(initialItems);
  const [showModal, setShowModal] = React.useState(false);
  const [editing, setEditing] = React.useState(null);
  const [form, setForm] = React.useState(emptyForm);
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState(null);

  const headerItems = items.filter((i) => i.location === 'header').sort((a, b) => a.order - b.order);
  const footerItems = items.filter((i) => i.location === 'footer').sort((a, b) => a.order - b.order);

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  }

  function openEdit(item) {
    setEditing(item);
    setForm({
      label: item.label,
      url: item.url || '',
      location: item.location,
      isExternal: item.isExternal,
      order: item.order,
      parentId: item.parentId || '',
    });
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.label.trim()) {
      toast.error('Label is required');
      return;
    }
    setSaving(true);
    const data = {
      ...form,
      url: form.url || null,
      parentId: form.parentId || null,
    };

    const result = editing
      ? await updateNavigationItem(editing.id, data)
      : await createNavigationItem(data);

    setSaving(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success(editing ? 'Item updated' : 'Item created');
    setShowModal(false);

    // Refetch items
    const { getNavigationItems } = await import('@/actions/navigation');
    const fresh = await getNavigationItems();
    setItems(fresh);
  }

  async function handleDelete(id) {
    if (!confirm('Delete this navigation item?')) return;
    setDeleting(id);
    const result = await deleteNavigationItem(id);
    setDeleting(null);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.success('Item deleted');
  }

  async function handleToggle(id, isActive) {
    const result = await toggleNavigationItem(id, isActive);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, isActive } : i)));
  }

  async function handleReorder(locationItems, direction, index) {
    const arr = [...locationItems];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= arr.length) return;
    [arr[index], arr[swapIndex]] = [arr[swapIndex], arr[index]];

    const ids = arr.map((i) => i.id);
    const result = await reorderNavigationItems(ids);
    if (result.error) {
      toast.error(result.error);
      return;
    }

    setItems((prev) => {
      const others = prev.filter((i) => i.location !== locationItems[0]?.location);
      return [...others, ...arr.map((item, idx) => ({ ...item, order: idx }))];
    });
  }

  function renderList(locationItems, locationLabel) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">{locationLabel}</CardTitle>
          </div>
          <Button size="sm" onClick={() => { setForm({ ...emptyForm, location: locationItems[0]?.location || 'header' }); setEditing(null); setShowModal(true); }}>
            <Plus className="mr-1 h-4 w-4" /> Add
          </Button>
        </CardHeader>
        <CardContent>
          {locationItems.length === 0 ? (
            <EmptyState title="No items" description="Add navigation items for this location." />
          ) : (
            <div className="space-y-2">
              {locationItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-lg border border-[rgba(148,163,184,0.1)] bg-[#111827]/40 p-3"
                >
                  <GripVertical className="h-4 w-4 shrink-0 text-[#94A3B8]" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[#F8FAFC]">{item.label}</p>
                    <p className="text-xs text-[#94A3B8]">
                      {item.url || '—'}
                      {item.isExternal && <ExternalLink className="ml-1 inline h-3 w-3" />}
                    </p>
                  </div>
                  <Switch
                    checked={item.isActive}
                    onCheckedChange={(v) => handleToggle(item.id, v)}
                  />
                  <Button variant="ghost" size="sm" onClick={() => handleReorder(locationItems, 'up', idx)} disabled={idx === 0}>
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleReorder(locationItems, 'down', idx)} disabled={idx === locationItems.length - 1}>
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} disabled={deleting === item.id}>
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC]">Navigation Manager</h1>
          <p className="mt-1 text-sm text-[#94A3B8]">Manage header and footer navigation items.</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Item
        </Button>
      </div>

      {renderList(headerItems, 'Header Navigation')}
      {renderList(footerItems, 'Footer Navigation')}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="space-y-4 p-6">
          <h2 className="text-lg font-semibold text-[#F8FAFC]">
            {editing ? 'Edit Navigation Item' : 'Add Navigation Item'}
          </h2>

          <div className="space-y-2">
            <Label>Label *</Label>
            <Input
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              placeholder="e.g. About Us"
            />
          </div>

          <div className="space-y-2">
            <Label>URL</Label>
            <Input
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="/about"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Location</Label>
              <select
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full rounded-lg border border-[rgba(148,163,184,0.15)] bg-[#111827] px-3 py-2 text-sm text-[#F8FAFC]"
              >
                <option value="header">Header</option>
                <option value="footer">Footer</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Order</Label>
              <Input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                min="0"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              checked={form.isExternal}
              onCheckedChange={(v) => setForm({ ...form, isExternal: v })}
            />
            <Label>External link</Label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
