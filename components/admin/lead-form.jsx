'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import z from 'zod';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
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
import {
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
  LEAD_PRIORITIES,
  LEAD_PRIORITY_LABELS,
  LEAD_SOURCES,
  LEAD_SOURCE_LABELS,
} from '@/config/constants';
import { createLead, updateLead } from '@/actions/leads';

const resolver = async (data, context) => {
  const result = z.safeParse(data);
  if (!result.success) {
    const errors = {};
    result.error.issues.forEach((issue) => {
      errors[issue.path[0]] = { message: issue.message, type: 'custom' };
    });
    return { errors, values: {} };
  }
  return { errors: {}, values: result.data };
};

export default function LeadForm({ lead = null, services = [], onClose }) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState({});

  const [form, setForm] = React.useState({
    name: lead?.name || '',
    company: lead?.company || '',
    email: lead?.email || '',
    phone: lead?.phone || '',
    whatsapp: lead?.whatsapp || '',
    website: lead?.website || '',
    industry: lead?.industry || '',
    location: lead?.location || '',
    service: lead?.service || '',
    source: lead?.source || 'OTHER',
    budget: lead?.budget || '',
    status: lead?.status || 'NEW',
    priority: lead?.priority || 'MEDIUM',
    notes: lead?.notes || '',
    followUpDate: lead?.followUpDate ? new Date(lead.followUpDate).toISOString().slice(0, 10) : '',
    assignedToId: lead?.assignedToId || '',
  });

  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormErrors({});

    const result = await resolver(form);
    if (Object.keys(result.errors).length > 0) {
      setFormErrors(result.errors);
      setLoading(false);
      return;
    }

    try {
      const data = { ...form };
      if (data.followUpDate) data.followUpDate = new Date(data.followUpDate).toISOString();

      const res = lead
        ? await updateLead(lead.id, data)
        : await createLead(data);

      if (res?.error) {
        toast.error(res.error);
        setLoading(false);
        return;
      }

      toast.success(lead ? 'Lead updated successfully' : 'Lead created successfully');
      router.refresh();
      onClose?.();
    } catch (err) {
      toast.error('Something went wrong');
      setLoading(false);
    }
  };

  const fieldError = (name) => formErrors[name]?.message;

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Full Name *"
            value={form.name}
            onChange={(e) => setField('name', e.target.value)}
            placeholder="John Doe"
            error={fieldError('name')}
          />
          <Input
            label="Company"
            value={form.company}
            onChange={(e) => setField('company', e.target.value)}
            placeholder="Acme Inc."
            error={fieldError('company')}
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setField('email', e.target.value)}
            placeholder="john@company.com"
            error={fieldError('email')}
          />
          <Input
            label="Phone"
            value={form.phone}
            onChange={(e) => setField('phone', e.target.value)}
            placeholder="+91 98765 43210"
            error={fieldError('phone')}
          />
          <Input
            label="WhatsApp"
            value={form.whatsapp}
            onChange={(e) => setField('whatsapp', e.target.value)}
            placeholder="+91 98765 43210"
            error={fieldError('whatsapp')}
          />
          <Input
            label="Website"
            value={form.website}
            onChange={(e) => setField('website', e.target.value)}
            placeholder="https://example.com"
            error={fieldError('website')}
          />
          <Input
            label="Industry"
            value={form.industry}
            onChange={(e) => setField('industry', e.target.value)}
            placeholder="Technology"
            error={fieldError('industry')}
          />
          <Input
            label="Location"
            value={form.location}
            onChange={(e) => setField('location', e.target.value)}
            placeholder="Mumbai, India"
            error={fieldError('location')}
          />
        </div>

        <div>
          <Label>Service</Label>
          <Select value={form.service || 'none'} onValueChange={(v) => setField('service', v === 'none' ? '' : v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a service (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {services.map((service) => (
                <SelectItem key={service.id} value={service.title}>
                  {service.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Source</Label>
            <Select value={form.source} onValueChange={(v) => setField('source', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LEAD_SOURCES.map((s) => (
                  <SelectItem key={s} value={s}>{LEAD_SOURCE_LABELS[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Input
            label="Budget"
            value={form.budget}
            onChange={(e) => setField('budget', e.target.value)}
            placeholder="₹50,000 - ₹1,00,000"
            error={fieldError('budget')}
          />
          <div>
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => setField('status', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LEAD_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>{LEAD_STATUS_LABELS[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Priority</Label>
            <Select value={form.priority} onValueChange={(v) => setField('priority', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LEAD_PRIORITIES.map((p) => (
                  <SelectItem key={p} value={p}>{LEAD_PRIORITY_LABELS[p]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Input
          label="Follow-up Date"
          type="date"
          value={form.followUpDate}
          onChange={(e) => setField('followUpDate', e.target.value)}
          error={fieldError('followUpDate')}
        />

        <Textarea
          label="Notes"
          value={form.notes}
          onChange={(e) => setField('notes', e.target.value)}
          placeholder="Additional notes about this lead..."
          error={fieldError('notes')}
        />

        <ModalFooter>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {lead ? 'Update Lead' : 'Create Lead'}
          </Button>
        </ModalFooter>
      </form>
    </div>
  );
}
