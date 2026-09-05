'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createProject, updateProject } from '@/actions/projects';
import { slugify } from '@/lib/utils';
import {
  PROJECT_STATUSES,
  PROJECT_STATUS_LABELS,
  PROJECT_PRIORITIES,
  LEAD_PRIORITY_LABELS,
  PAYMENT_STATUSES,
  PAYMENT_STATUS_LABELS,
} from '@/config/constants';

export default function ProjectForm({ project, clients, managers }) {
  const router = useRouter();
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({
    name: project?.name || '',
    slug: project?.slug || '',
    description: project?.description || '',
    clientId: project?.clientId || '',
    managerId: project?.managerId || '',
    startDate: project?.startDate ? new Date(project.startDate).toISOString().slice(0, 10) : '',
    deadline: project?.deadline ? new Date(project.deadline).toISOString().slice(0, 10) : '',
    status: project?.status || 'PLANNING',
    priority: project?.priority || 'MEDIUM',
    budget: project?.budget?.toString() || '',
    revenue: project?.revenue?.toString() || '',
    paymentStatus: project?.paymentStatus || 'PENDING',
    progress: project?.progress?.toString() || '0',
  });

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleNameChange = (e) => {
    const name = e.target.value;
    setForm((prev) => ({
      ...prev,
      name,
      slug: prev.slug || slugify(name),
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error('Project name is required');
      return;
    }

    const payload = {
      ...form,
      budget: form.budget ? Number(form.budget) : undefined,
      revenue: form.revenue ? Number(form.revenue) : undefined,
      progress: Number(form.progress) || 0,
    };

    setSaving(true);
    try {
      const res = project
        ? await updateProject(project.id, payload)
        : await createProject(payload);

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(project ? 'Project updated' : 'Project created');
        router.push(`/admin/projects/${res.id}`);
      }
    } catch {
      toast.error('Failed to save project');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 text-base font-semibold text-[#F8FAFC]">Basic Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Project Name *</Label>
                <Input value={form.name} onChange={handleNameChange} placeholder="e.g. E-commerce Website Redesign" />
              </div>
              <div>
                <Label>Slug</Label>
                <Input value={form.slug} onChange={(e) => setField('slug', slugify(e.target.value))} placeholder="auto-generated" />
              </div>
              <div className="sm:col-span-2">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setField('description', e.target.value)} rows={4} placeholder="Describe the project scope, goals, and deliverables..." />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 text-base font-semibold text-[#F8FAFC]">Assignment</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Client</Label>
                <Select value={form.clientId} onValueChange={(v) => setField('clientId', v)}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Select client" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No client</SelectItem>
                    {clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.companyName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Project Manager</Label>
                <Select value={form.managerId} onValueChange={(v) => setField('managerId', v)}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Select manager" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No manager</SelectItem>
                    {managers.map((m) => <SelectItem key={m.id} value={m.id}>{m.name || m.email}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Start Date</Label>
                <Input type="date" value={form.startDate} onChange={(e) => setField('startDate', e.target.value)} />
              </div>
              <div>
                <Label>Deadline</Label>
                <Input type="date" value={form.deadline} onChange={(e) => setField('deadline', e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 text-base font-semibold text-[#F8FAFC]">Status &amp; Tracking</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setField('status', v)}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PROJECT_STATUSES.map((s) => <SelectItem key={s} value={s}>{PROJECT_STATUS_LABELS[s]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priority</Label>
                <Select value={form.priority} onValueChange={(v) => setField('priority', v)}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PROJECT_PRIORITIES.map((p) => <SelectItem key={p} value={p}>{LEAD_PRIORITY_LABELS[p]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Payment Status</Label>
                <Select value={form.paymentStatus} onValueChange={(v) => setField('paymentStatus', v)}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PAYMENT_STATUSES.map((s) => <SelectItem key={s} value={s}>{PAYMENT_STATUS_LABELS[s]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Budget (₹)</Label>
                <Input type="number" min="0" step="0.01" value={form.budget} onChange={(e) => setField('budget', e.target.value)} placeholder="0" />
              </div>
              <div>
                <Label>Revenue (₹)</Label>
                <Input type="number" min="0" step="0.01" value={form.revenue} onChange={(e) => setField('revenue', e.target.value)} placeholder="0" />
              </div>
              <div>
                <Label>Progress (%)</Label>
                <Input type="number" min="0" max="100" value={form.progress} onChange={(e) => setField('progress', e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.push(project ? `/admin/projects/${project.id}` : '/admin/projects')}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving} loading={saving}>
            {saving ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
          </Button>
        </div>
      </div>
    </form>
  );
}