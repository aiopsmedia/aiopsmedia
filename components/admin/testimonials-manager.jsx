'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Star, ChevronUp, ChevronDown, Quote } from 'lucide-react';
import { cn, getInitials } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Modal, ModalContent, ModalHeader, ModalFooter, ModalTitle, ModalDescription } from '@/components/ui/modal';
import { createTestimonial, updateTestimonial, deleteTestimonial, toggleTestimonial, reorderTestimonials } from '@/actions/cms';

const emptyForm = {
  clientName: '',
  company: '',
  designation: '',
  content: '',
  rating: '',
  order: 0,
};

export default function TestimonialsManager({ initialTestimonials }) {
  const router = useRouter();
  const [testimonials, setTestimonials] = React.useState(initialTestimonials);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(null);
  const [form, setForm] = React.useState(emptyForm);
  const [loading, setLoading] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState(null);
  const [orderLoading, setOrderLoading] = React.useState(false);

  const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, order: testimonials.length });
    setModalOpen(true);
  };

  const openEdit = (t) => {
    setEditing(t);
    setForm({
      clientName: t.clientName,
      company: t.company || '',
      designation: t.designation || '',
      content: t.content,
      rating: t.rating != null ? String(t.rating) : '',
      order: t.order,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.clientName.trim() || !form.content.trim()) {
      toast.error('Client name and content are required');
      return;
    }
    setLoading(true);
    try {
      const res = editing
        ? await updateTestimonial(editing.id, form)
        : await createTestimonial(form);
      if (res?.error) toast.error(res.error);
      else {
        toast.success(editing ? 'Testimonial updated' : 'Testimonial created');
        setModalOpen(false);
        router.refresh();
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id, field, value) => {
    const res = await toggleTestimonial(id, field, value);
    if (res?.error) toast.error(res.error);
    else router.refresh();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    try {
      const res = await deleteTestimonial(deleteId);
      if (res?.error) toast.error(res.error);
      else {
        toast.success('Testimonial deleted');
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
    if (target < 0 || target >= testimonials.length) return;
    const reordered = [...testimonials];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setTestimonials(reordered);
    setOrderLoading(true);
    try {
      const res = await reorderTestimonials(reordered.map((t) => t.id));
      if (res?.error) {
        toast.error(res.error);
        setTestimonials(initialTestimonials);
      } else router.refresh();
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC]">Testimonials</h1>
          <p className="mt-1 text-sm text-[#94A3B8]">Manage customer reviews and testimonials.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> Add Testimonial
        </Button>
      </div>

      {testimonials.length === 0 ? (
        <Card>
          <EmptyState icon={Quote} title="No testimonials" description="Add your first testimonial." action="Add Testimonial" onAction={openCreate} />
        </Card>
      ) : (
        <Card>
          <div className="divide-y divide-[rgba(148,163,184,0.1)]">
            {testimonials.map((t, index) => (
              <div key={t.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <div className="flex flex-col items-center gap-0.5">
                  <button type="button" onClick={() => move(index, -1)} disabled={index === 0 || orderLoading} className="rounded p-0.5 text-[#94A3B8] hover:text-[#22D3EE] disabled:opacity-30">
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => move(index, 1)} disabled={index === testimonials.length - 1 || orderLoading} className="rounded p-0.5 text-[#94A3B8] hover:text-[#22D3EE] disabled:opacity-30">
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#22D3EE]/20 to-[#8B5CF6]/20">
                  <span className="text-sm font-semibold text-[#22D3EE]">{getInitials(t.clientName)}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-[#F8FAFC]">{t.clientName}</p>
                    <span className="text-sm text-[#94A3B8]">{t.company}{t.designation ? ` · ${t.designation}` : ''}</span>
                    {t.rating && (
                      <span className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={cn('h-3 w-3', i < t.rating ? 'fill-current' : 'text-[#94A3B8]')} />
                        ))}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-[#94A3B8]">{t.content}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant={t.isActive ? 'success' : 'outline'}>{t.isActive ? 'Active' : 'Inactive'}</Badge>
                    {t.isFeatured && <Badge variant="default">Featured</Badge>}
                    {t.isDemo && <Badge variant="info">Demo</Badge>}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 sm:justify-end">
                  <Switch checked={t.isActive} onCheckedChange={(c) => handleToggle(t.id, 'isActive', c)} aria-label="Active" />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#94A3B8]">Featured</span>
                    <Switch checked={t.isFeatured} onCheckedChange={(c) => handleToggle(t.id, 'isFeatured', c)} />
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(t)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400" onClick={() => setDeleteId(t.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Modal open={modalOpen} onOpenChange={setModalOpen}>
        <ModalContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <ModalHeader>
            <ModalTitle>{editing ? 'Edit Testimonial' : 'Add Testimonial'}</ModalTitle>
            <ModalDescription>Fill in the testimonial details.</ModalDescription>
          </ModalHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Client Name *" value={form.clientName} onChange={(e) => setField('clientName', e.target.value)} />
              <Input label="Company" value={form.company} onChange={(e) => setField('company', e.target.value)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Designation" value={form.designation} onChange={(e) => setField('designation', e.target.value)} />
              <Input label="Rating (1-5)" type="number" min="1" max="5" value={form.rating} onChange={(e) => setField('rating', e.target.value)} />
            </div>
            <Textarea label="Content *" value={form.content} onChange={(e) => setField('content', e.target.value)} />
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
            <ModalTitle>Delete Testimonial</ModalTitle>
            <ModalDescription>Are you sure? This cannot be undone.</ModalDescription>
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
