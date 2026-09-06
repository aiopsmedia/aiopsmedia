'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, ClipboardList, ExternalLink, ListChecks, X, GripVertical } from 'lucide-react';
import { cn, formatDate, slugify } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Modal, ModalContent, ModalHeader, ModalFooter, ModalTitle, ModalDescription } from '@/components/ui/modal';
import {
  createForm,
  updateForm,
  deleteForm,
  toggleForm,
} from '@/actions/forms';

const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'select', label: 'Dropdown' },
  { value: 'number', label: 'Number' },
  { value: 'tel', label: 'Phone' },
  { value: 'date', label: 'Date' },
  { value: 'checkbox', label: 'Checkbox' },
];

const emptyField = { key: '', label: '', type: 'text', required: false, placeholder: '', options: [] };

const emptyForm = {
  name: '',
  slug: '',
  description: '',
  successMessage: 'Thanks! Your submission has been received.',
  redirectUrl: '',
  isActive: true,
  fields: [],
};

export default function FormsManager({ initialForms }) {
  const router = useRouter();
  const [forms, setForms] = React.useState(initialForms);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(null);
  const [form, setForm] = React.useState(emptyForm);
  const [loading, setLoading] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState(null);

  const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const handleNameChange = (value) => {
    setForm((prev) => ({
      ...prev,
      name: value,
      slug: prev.slug && prev.slug !== slugify(prev.name) ? prev.slug : slugify(value),
    }));
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, fields: [{ ...emptyField, key: 'field_1' }] });
    setModalOpen(true);
  };

  const openEdit = (f) => {
    setEditing(f);
    setForm({
      name: f.name,
      slug: f.slug,
      description: f.description || '',
      successMessage: f.successMessage || 'Thanks! Your submission has been received.',
      redirectUrl: f.redirectUrl || '',
      isActive: f.isActive,
      fields: Array.isArray(f.fields) && f.fields.length > 0 ? f.fields.map((x) => ({ ...x })) : [{ ...emptyField }],
    });
    setModalOpen(true);
  };

  const updateField = (index, patch) => {
    setForm((prev) => {
      const fields = prev.fields.map((f, i) => (i === index ? { ...f, ...patch } : f));
      return { ...prev, fields };
    });
  };

  const addField = () => {
    setForm((prev) => ({
      ...prev,
      fields: [...prev.fields, { ...emptyField, key: `field_${prev.fields.length + 1}` }],
    }));
  };

  const removeField = (index) => {
    setForm((prev) => ({ ...prev, fields: prev.fields.filter((_, i) => i !== index) }));
  };

  const moveField = (index, dir) => {
    const target = index + dir;
    setForm((prev) => {
      if (target < 0 || target >= prev.fields.length) return prev;
      const fields = [...prev.fields];
      [fields[index], fields[target]] = [fields[target], fields[index]];
      return { ...prev, fields };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Form name is required');
      return;
    }
    const cleanFields = form.fields
      .filter((f) => f.label?.trim())
      .map((f) => ({
        key: f.key || slugify(f.label),
        label: f.label.trim(),
        type: f.type,
        required: f.required,
        placeholder: f.placeholder || '',
        options: Array.isArray(f.options) ? f.options : [],
      }));

    if (cleanFields.length === 0) {
      toast.error('Add at least one field to the form');
      return;
    }

    setLoading(true);
    try {
      const payload = { ...form, fields: cleanFields };
      const res = editing ? await updateForm(editing.id, payload) : await createForm(payload);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success(editing ? 'Form updated' : 'Form created');
        setModalOpen(false);
        router.refresh();
      }
    } catch (err) {
      console.error('[forms] submit error:', err);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id, checked) => {
    const res = await toggleForm(id, checked);
    if (res?.error) toast.error(res.error);
    else router.refresh();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    try {
      const res = await deleteForm(deleteId);
      if (res?.error) toast.error(res.error);
      else {
        toast.success('Form deleted');
        setDeleteId(null);
        router.refresh();
      }
    } catch {
      toast.error('Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC]">Forms</h1>
          <p className="mt-1 text-sm text-[#94A3B8]">
            Create web forms to collect enquiries, contacts, and leads. Submissions appear under each form.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> Add Form
        </Button>
      </div>

      {forms.length === 0 ? (
        <Card>
          <EmptyState
            icon={ClipboardList}
            title="No forms yet"
            description="Create your first form to collect details from your website visitors."
            action="Add Form"
            onAction={openCreate}
          />
        </Card>
      ) : (
        <Card>
          <div className="divide-y divide-[rgba(148,163,184,0.1)]">
            {forms.map((f) => (
              <div key={f.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#22D3EE]/10">
                  <ClipboardList className="h-5 w-5 text-[#22D3EE]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-[#F8FAFC]">{f.name}</p>
                    <span className="text-xs text-[#94A3B8]">/forms/{f.slug}</span>
                    <Badge variant={f.isActive ? 'success' : 'outline'}>
                      {f.isActive ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                  <p className="mt-0.5 truncate text-sm text-[#94A3B8]">
                    {f.description || 'No description'}
                  </p>
                  <p className="mt-1 text-xs text-[#94A3B8]">
                    {Array.isArray(f.fields) ? f.fields.length : 0} fields ·{' '}
                    {f._count?.submissions ?? 0} submissions
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Link
                    href={`/forms/${f.slug}`}
                    target="_blank"
                    className="rounded-lg p-2 text-[#94A3B8] transition-colors hover:bg-[#111827] hover:text-[#22D3EE]"
                    aria-label="Preview form"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                  <Link
                    href={`/admin/forms/${f.id}`}
                    className="rounded-lg p-2 text-[#94A3B8] transition-colors hover:bg-[#111827] hover:text-[#22D3EE]"
                    aria-label="View submissions"
                  >
                    <ListChecks className="h-4 w-4" />
                  </Link>
                  <Switch checked={f.isActive} onCheckedChange={(c) => handleToggle(f.id, c)} />
                  <Button variant="ghost" size="icon" onClick={() => openEdit(f)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteId(f.id)}
                    className="text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Modal open={modalOpen} onOpenChange={setModalOpen}>
        <ModalContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <ModalHeader>
            <ModalTitle>{editing ? 'Edit Form' : 'Add Form'}</ModalTitle>
            <ModalDescription>
              Define a form, its fields, and what happens after submission.
            </ModalDescription>
          </ModalHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Form name *"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Request a Quote"
              />
              <Input
                label="Slug (URL)"
                value={form.slug}
                onChange={(e) => setField('slug', e.target.value)}
                placeholder="request-a-quote"
              />
            </div>
            <Textarea
              label="Description"
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
              placeholder="Short description shown to users"
              rows={2}
            />

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-[#F8FAFC]">Fields *</label>
                <Button type="button" variant="outline" size="sm" onClick={addField}>
                  <Plus className="h-4 w-4" /> Add Field
                </Button>
              </div>

              <div className="space-y-3">
                {form.fields.map((field, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="grid flex-1 gap-3 sm:grid-cols-2">
                        <Input
                          label="Label"
                          value={field.label}
                          onChange={(e) => {
                            const label = e.target.value;
                            updateField(index, {
                              label,
                              key: field.key && field.key !== slugify(label.slice(0, -1)) ? field.key : slugify(label),
                            });
                          }}
                          placeholder="Full name"
                        />
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-[#F8FAFC]">Type</label>
                          <Select
                            value={field.type}
                            onValueChange={(val) => updateField(index, { type: val })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              {FIELD_TYPES.map((t) => (
                                <SelectItem key={t.value} value={t.value}>
                                  {t.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Input
                          label="Field key"
                          value={field.key}
                          onChange={(e) => updateField(index, { key: e.target.value })}
                          placeholder="full_name"
                        />
                        <Input
                          label="Placeholder"
                          value={field.placeholder || ''}
                          onChange={(e) => updateField(index, { placeholder: e.target.value })}
                          placeholder="e.g. John Doe"
                        />
                        {field.type === 'select' && (
                          <div className="sm:col-span-2">
                            <Textarea
                              label="Options (one per line)"
                              value={Array.isArray(field.options) ? field.options.join('\n') : ''}
                              onChange={(e) =>
                                updateField(index, {
                                  options: e.target.value.split('\n').map((o) => o.trim()).filter(Boolean),
                                })
                              }
                              rows={2}
                              placeholder={'General Enquiry\nProject Quote\nSupport'}
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex shrink-0 items-center gap-1 pt-6">
                        <button
                          type="button"
                          onClick={() => moveField(index, -1)}
                          disabled={index === 0}
                          className="rounded p-1 text-[#94A3B8] hover:text-[#22D3EE] disabled:opacity-30"
                        >
                          <GripVertical className="h-4 w-4" />
                        </button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeField(index)}
                          className="text-red-400"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <Switch
                        checked={Boolean(field.required)}
                        onCheckedChange={(c) => updateField(index, { required: c })}
                      />
                      <span className="text-xs text-[#94A3B8]">Required</span>
                    </div>
                  </div>
                ))}
                {form.fields.length === 0 && (
                  <Button type="button" variant="outline" onClick={addField} className="w-full">
                    <Plus className="h-4 w-4" /> Add your first field
                  </Button>
                )}
              </div>
            </div>

            <Textarea
              label="Success message"
              value={form.successMessage}
              onChange={(e) => setField('successMessage', e.target.value)}
              rows={2}
            />
            <Input
              label="Redirect URL (optional)"
              value={form.redirectUrl || ''}
              onChange={(e) => setField('redirectUrl', e.target.value)}
              placeholder="https://yourdomain.com/thanks"
            />
            <div className="flex items-center gap-2">
              <Switch
                checked={form.isActive}
                onCheckedChange={(c) => setField('isActive', c)}
              />
              <span className="text-sm text-[#94A3B8]">Publish form (allow submissions)</span>
            </div>

            <ModalFooter>
              <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                {editing ? 'Update' : 'Create'}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      <Modal open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Delete Form</ModalTitle>
            <ModalDescription>
              This will permanently delete the form and all of its submissions. This cannot be undone.
            </ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} loading={loading}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}