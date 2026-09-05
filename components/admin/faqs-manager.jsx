'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, HelpCircle, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Modal, ModalContent, ModalHeader, ModalFooter, ModalTitle, ModalDescription } from '@/components/ui/modal';
import { createFaq, updateFaq, deleteFaq, toggleFaq, reorderFaqs } from '@/actions/cms';

const emptyForm = {
  question: '',
  answer: '',
  category: 'General',
  order: 0,
};

export default function FaqsManager({ initialFaqs }) {
  const router = useRouter();
  const [faqs, setFaqs] = React.useState(initialFaqs);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(null);
  const [form, setForm] = React.useState(emptyForm);
  const [loading, setLoading] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState(null);
  const [orderLoading, setOrderLoading] = React.useState(false);

  const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const categories = ['General', ...Array.from(new Set(faqs.map((f) => f.category).filter(Boolean)))];

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, order: faqs.length });
    setModalOpen(true);
  };

  const openEdit = (f) => {
    setEditing(f);
    setForm({
      question: f.question,
      answer: f.answer,
      category: f.category || 'General',
      order: f.order,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.question.trim() || !form.answer.trim()) {
      toast.error('Question and answer are required');
      return;
    }
    setLoading(true);
    try {
      const res = editing ? await updateFaq(editing.id, form) : await createFaq(form);
      if (res?.error) toast.error(res.error);
      else {
        toast.success(editing ? 'FAQ updated' : 'FAQ created');
        setModalOpen(false);
        router.refresh();
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    try {
      const res = await deleteFaq(deleteId);
      if (res?.error) toast.error(res.error);
      else {
        toast.success('FAQ deleted');
        setDeleteId(null);
        router.refresh();
      }
    } catch {
      toast.error('Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id, isActive) => {
    const res = await toggleFaq(id, isActive);
    if (res?.error) toast.error(res.error);
    else router.refresh();
  };

  const move = async (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= faqs.length) return;
    const reordered = [...faqs];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setFaqs(reordered);
    setOrderLoading(true);
    try {
      const res = await reorderFaqs(reordered.map((f) => f.id));
      if (res?.error) {
        toast.error(res.error);
        setFaqs(initialFaqs);
      } else router.refresh();
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC]">FAQs</h1>
          <p className="mt-1 text-sm text-[#94A3B8]">Manage frequently asked questions.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> Add FAQ
        </Button>
      </div>

      {faqs.length === 0 ? (
        <Card>
          <EmptyState icon={HelpCircle} title="No FAQs" description="Add your first FAQ." action="Add FAQ" onAction={openCreate} />
        </Card>
      ) : (
        <Card>
          <div className="divide-y divide-[rgba(148,163,184,0.1)]">
            {faqs.map((f, index) => (
              <div key={f.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <div className="flex flex-col items-center gap-0.5">
                  <button type="button" onClick={() => move(index, -1)} disabled={index === 0 || orderLoading} className="rounded p-0.5 text-[#94A3B8] hover:text-[#22D3EE] disabled:opacity-30">
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => move(index, 1)} disabled={index === faqs.length - 1 || orderLoading} className="rounded p-0.5 text-[#94A3B8] hover:text-[#22D3EE] disabled:opacity-30">
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-[#F8FAFC]">{f.question}</p>
                    {f.category && <Badge variant="outline">{f.category}</Badge>}
                    <Badge variant={f.isActive ? 'success' : 'outline'}>{f.isActive ? 'Active' : 'Inactive'}</Badge>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-[#94A3B8]">{f.answer}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={f.isActive} onCheckedChange={(c) => handleToggle(f.id, c)} />
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(f)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400" onClick={() => setDeleteId(f.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Modal open={modalOpen} onOpenChange={setModalOpen}>
        <ModalContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <ModalHeader>
            <ModalTitle>{editing ? 'Edit FAQ' : 'Add FAQ'}</ModalTitle>
            <ModalDescription>Fill in the FAQ details.</ModalDescription>
          </ModalHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Question *" value={form.question} onChange={(e) => setField('question', e.target.value)} />
            <Textarea label="Answer *" value={form.answer} onChange={(e) => setField('answer', e.target.value)} />
            <Input label="Category" value={form.category} onChange={(e) => setField('category', e.target.value)} />
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
            <ModalTitle>Delete FAQ</ModalTitle>
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
