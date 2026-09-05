'use client';

import { useState, useTransition } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { createEnquiry } from '@/actions/enquiry';

const serviceOptions = [
  'AI & Automation',
  'Custom Software Development',
  'Web Development',
  'Mobile App Development',
  'Cloud Solutions',
  'Cybersecurity',
  'RealEstate ERP',
  'School ERP',
  'Other',
];

const budgetOptions = [
  'Under ₹50,000',
  '₹50,000 - ₹2,00,000',
  '₹2,00,000 - ₹5,00,000',
  '₹5,00,000 - ₹10,00,000',
  'Above ₹10,00,000',
  'Not Sure Yet',
];

export function ContactForm({ preselectedService = '' }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});

  const initialService = serviceOptions.includes(preselectedService)
    ? preselectedService
    : preselectedService
      ? 'Other'
      : '';

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: initialService,
    budget: '',
    message: '',
    preferredContact: 'email',
    website: '',
  });

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.message.trim()) errs.message = 'Message is required';
    else if (form.message.trim().length < 10) errs.message = 'Message must be at least 10 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('email', form.email);
    fd.append('phone', form.phone);
    fd.append('company', form.company);
    fd.append('service', form.service);
    fd.append('budget', form.budget);
    fd.append('message', form.message);
    fd.append('preferredContact', form.preferredContact);
    fd.append('website', form.website);

    startTransition(async () => {
      const res = await createEnquiry(fd);
      if (res.success) {
        setResult('success');
        setForm({
          name: '', email: '', phone: '', company: '', service: initialService,
          budget: '', message: '', preferredContact: 'email', website: '',
        });
      } else {
        if (res.errors) setErrors(res.errors);
        else setResult('error');
      }
    });
  }

  if (result === 'success') {
    return (
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-8 text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-emerald-400" />
        <h3 className="mt-4 text-xl font-bold text-[#F8FAFC]">Message Sent!</h3>
        <p className="mt-2 text-sm text-[#94A3B8]">
          Thank you for reaching out. We&apos;ll get back to you within 2 business hours.
        </p>
        <button
          onClick={() => setResult(null)}
          className="mt-6 text-sm font-medium text-[#22D3EE] hover:underline"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="relative hidden" aria-hidden="true">
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(e) => update('website', e.target.value)}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          id="name"
          label="Full Name *"
          placeholder="John Doe"
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          error={errors.name}
          disabled={isPending}
        />
        <Input
          id="email"
          type="email"
          label="Email Address *"
          placeholder="john@company.com"
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
          error={errors.email}
          disabled={isPending}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          id="phone"
          type="tel"
          label="Phone Number"
          placeholder="+91 98765 43210"
          value={form.phone}
          onChange={(e) => update('phone', e.target.value)}
          error={errors.phone}
          disabled={isPending}
        />
        <Input
          id="company"
          label="Company Name"
          placeholder="Your Company"
          value={form.company}
          onChange={(e) => update('company', e.target.value)}
          error={errors.company}
          disabled={isPending}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="w-full">
          <label htmlFor="service" className="mb-1.5 block text-sm font-medium text-[#F8FAFC]">
            Service Interested In
          </label>
          <select
            id="service"
            value={form.service}
            onChange={(e) => update('service', e.target.value)}
            disabled={isPending}
            className="flex h-10 w-full rounded-lg border border-[rgba(148,163,184,0.15)] bg-[#0B1220] px-3 py-2 text-sm text-[#F8FAFC] shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/50 focus:border-[#22D3EE]/50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select a service</option>
            {serviceOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="w-full">
          <label htmlFor="budget" className="mb-1.5 block text-sm font-medium text-[#F8FAFC]">
            Budget Range
          </label>
          <select
            id="budget"
            value={form.budget}
            onChange={(e) => update('budget', e.target.value)}
            disabled={isPending}
            className="flex h-10 w-full rounded-lg border border-[rgba(148,163,184,0.15)] bg-[#0B1220] px-3 py-2 text-sm text-[#F8FAFC] shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/50 focus:border-[#22D3EE]/50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select budget range</option>
            {budgetOptions.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="w-full">
        <label className="mb-1.5 block text-sm font-medium text-[#F8FAFC]">
          Preferred Contact Method
        </label>
        <div className="flex gap-4">
          {[
            { value: 'email', label: 'Email' },
            { value: 'phone', label: 'Phone' },
            { value: 'whatsapp', label: 'WhatsApp' },
          ].map((opt) => (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors ${
                form.preferredContact === opt.value
                  ? 'border-[#22D3EE]/50 bg-[#22D3EE]/10 text-[#22D3EE]'
                  : 'border-[rgba(148,163,184,0.15)] text-[#94A3B8] hover:border-[#22D3EE]/20'
              }`}
            >
              <input
                type="radio"
                name="preferredContact"
                value={opt.value}
                checked={form.preferredContact === opt.value}
                onChange={(e) => update('preferredContact', e.target.value)}
                className="sr-only"
                disabled={isPending}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <Textarea
        id="message"
        label="Project Description *"
        placeholder="Tell us about your project, goals, timeline, and any specific requirements..."
        rows={5}
        value={form.message}
        onChange={(e) => update('message', e.target.value)}
        error={errors.message}
        disabled={isPending}
      />

      {result === 'error' && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Something went wrong. Please try again or contact us directly.
        </div>
      )}

      <Button type="submit" size="lg" className="w-full" loading={isPending} disabled={isPending}>
        <Send className="h-4 w-4" />
        {isPending ? 'Sending...' : 'Send Message'}
      </Button>

      <p className="text-center text-xs text-[#94A3B8]">
        By submitting this form, you agree to our privacy policy. We&apos;ll never share your data with third parties.
      </p>
    </form>
  );
}
