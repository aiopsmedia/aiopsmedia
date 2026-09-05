'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { GripVertical, Plus, Pencil, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { cn, formatDate, slugify } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Modal, ModalContent, ModalHeader, ModalFooter, ModalTitle, ModalDescription } from '@/components/ui/modal';
import { Layers } from 'lucide-react';
import { createService, updateService, deleteService, reorderServices, toggleService } from '@/actions/cms';

const emptyForm = {
  title: '',
  slug: '',
  icon: '',
  description: '',
  ctaText: 'Get a Free Consultation',
  order: 0,
};

export default function ServicesManager({ initialServices }) {
  const router = useRouter();
  const [services, setServices] = React.useState(initialServices);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(null);
  const [form, setForm] = React.useState(emptyForm);
  const [loading, setLoading] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState(null);
  const [orderLoading, setOrderLoading] = React.useState(false);

  const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const handleTitleChange = (value) => {
    setForm((prev) => ({ ...prev, title: value, slug: prev.slug ? prev.slug : slugify(value) }));
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, order: services.length });
    setModalOpen(true);
  };

  const openEdit = (service) => {
    setEditing(service);
    setForm({
      title: service.title,
      slug: service.slug,
      icon: service.icon || '',
      description: service.description || '',
      ctaText: service.ctaText || 'Get a Free Consultation',
      order: service.order,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }
    setLoading(true);
    try {
      const payload = { ...form, slug: form.slug || slugify(form.title) };
      const res = editing
        ? await updateService(editing.id, payload)
        : await createService(payload);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success(editing ? 'Service updated' : 'Service created');
        setModalOpen(false);
        router.refresh();
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id, checked) => {
    const res = await toggleService(id, checked);
    if (res?.error) toast.error(res.error);
    else router.refresh();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    try {
      const res = await deleteService(deleteId);
      if (res?.error) toast.error(res.error);
      else {
        toast.success('Service deleted');
        setDeleteId(null);
        router.refresh();
      }
    } catch {
      toast.error('Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  const move = async (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= services.length) return;
    const reordered = [...services];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setServices(reordered);
    setOrderLoading(true);
    try {
      const res = await reorderServices(reordered.map((s) => s.id));
      if (res?.error) {
        toast.error(res.error);
        setServices(initialServices);
      } else {
        router.refresh();
      }
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC]">Services</h1>
          <p className="mt-1 text-sm text-[#94A3B8]">Manage your services and their ordering.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> Add Service
        </Button>
      </div>

      {services.length === 0 ? (
        <Card>
          <EmptyState icon={Layers} title="No services" description="Add your first service to get started." action="Add Service" onAction={openCreate} />
        </Card>
      ) : (
        <Card>
          <div className="divide-y divide-[rgba(148,163,184,0.1)]">
            {services.map((service, index) => (
              <div key={service.id} className="flex items-center gap-4 p-4">
                <div className="flex flex-col items-center gap-0.5">
                  <button type="button" onClick={() => move(index, -1)} disabled={index === 0 || orderLoading} className="rounded p-0.5 text-[#94A3B8] hover:text-[#22D3EE] disabled:opacity-30">
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <GripVertical className="h-4 w-4 text-[#94A3B8]" />
                  <button type="button" onClick={() => move(index, 1)} disabled={index === services.length - 1 || orderLoading} className="rounded p-0.5 text-[#94A3B8] hover:text-[#22D3EE] disabled:opacity-30">
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#22D3EE]/10">
                  <Layers className="h-5 w-5 text-[#22D3EE]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-[#F8FAFC]">{service.title}</p>
                    <span className="text-xs text-[#94A3B8]">/{service.slug}</span>
                    <Badge variant={service.isActive ? 'success' : 'outline'}>{service.isActive ? 'Active' : 'Inactive'}</Badge>
                  </div>
                  <p className="mt-0.5 truncate text-sm text-[#94A3B8]">{service.description || 'No description'}</p>
                  <p className="mt-1 text-xs text-[#94A3B8]">
                    {service._count.products} products · {service._count.blogs} posts
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={service.isActive} onCheckedChange={(c) => handleToggle(service.id, c)} />
                  <Button variant="ghost" size="icon" onClick={() => openEdit(service)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteId(service.id)} className="text-red-400"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Modal open={modalOpen} onOpenChange={setModalOpen}>
        <ModalContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <ModalHeader>
            <ModalTitle>{editing ? 'Edit Service' : 'Add Service'}</ModalTitle>
            <ModalDescription>Fill in the service details below.</ModalDescription>
          </ModalHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Title *" value={form.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Service name" />
              <Input label="Slug" value={form.slug} onChange={(e) => setField('slug', e.target.value)} placeholder="service-slug" />
            </div>
            <Input label="Icon" value={form.icon} onChange={(e) => setField('icon', e.target.value)} placeholder="Icon name" />
            <Textarea label="Description" value={form.description} onChange={(e) => setField('description', e.target.value)} placeholder="Short description" />
            <Input label="CTA Text" value={form.ctaText} onChange={(e) => setField('ctaText', e.target.value)} />
            <ModalFooter>
              <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit" loading={loading}>{editing ? 'Update' : 'Create'}</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      <Modal open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Delete Service</ModalTitle>
            <ModalDescription>Are you sure you want to delete this service? This cannot be undone.</ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} loading={loading}>Delete</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
