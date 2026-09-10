'use client';
import { useState, useTransition } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createEnquiry } from '@/actions/enquiry';

export default function EstimateForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '', country: '', service: '', industry: '', users: '', integrations: '', timeline: '', budget: '', message: '', website: '',
  });
  function update(k, v) { setForm((s) => ({ ...s, [k]: v })); if (errors[k]) setErrors((e) => { const n = { ...e }; delete n[k]; return n; }); }
  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.email.trim()) e.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.message.trim()) e.message = 'Project description required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append('formType', 'estimate');
    startTransition(async () => {
      const res = await createEnquiry(fd);
      if (res.success) { setResult('success'); } else { if (res.errors) setErrors(res.errors); else setResult('error'); }
    });
  }
  if (result === 'success') {
    return (
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-8 text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-emerald-400" />
        <h3 className="mt-4 text-xl font-bold text-[#F8FAFC]">Thanks. We will review your requirements and contact you.</h3>
        <p className="mt-2 text-sm text-[#94A3B8]">Expect a response within 1 business day.</p>
        <button onClick={() => setResult(null)} className="mt-6 text-sm font-medium text-[#22D3EE] hover:underline">Submit another estimate</button>
      </div>
    );
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => update('website', e.target.value)} className="hidden" aria-hidden="true" />
      <div className="grid gap-5 sm:grid-cols-2">
        <Input id="name" label="Name *" value={form.name} onChange={(e) => update('name', e.target.value)} error={errors.name} disabled={isPending} />
        <Input id="email" type="email" label="Work Email *" value={form.email} onChange={(e) => update('email', e.target.value)} error={errors.email} disabled={isPending} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Input id="company" label="Business Name" value={form.company} onChange={(e) => update('company', e.target.value)} disabled={isPending} />
        <div className="w-full">
          <label className="mb-1.5 block text-sm font-medium text-[#F8FAFC]">Country</label>
          <select value={form.country} onChange={(e) => update('country', e.target.value)} className="flex h-10 w-full rounded-lg border border-[rgba(148,163,184,0.15)] bg-[#0B1220] px-3 py-2 text-sm text-[#F8FAFC]" disabled={isPending}>
            <option value="">Select country</option>
            <option>United States</option>
            <option>United Kingdom</option>
            <option>United Arab Emirates</option>
            <option>India</option>
            <option>Other</option>
          </select>
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Input id="phone" label="Phone" value={form.phone} onChange={(e) => update('phone', e.target.value)} disabled={isPending} />
        <div className="w-full">
          <label className="mb-1.5 block text-sm font-medium text-[#F8FAFC]">Service</label>
          <select value={form.service} onChange={(e) => update('service', e.target.value)} className="flex h-10 w-full rounded-lg border border-[rgba(148,163,184,0.15)] bg-[#0B1220] px-3 py-2 text-sm text-[#F8FAFC]" disabled={isPending}>
            <option value="">Select</option>
            <option>AI Development</option>
            <option>AI Agents</option>
            <option>AI Automation</option>
            <option>CRM</option>
            <option>ERP</option>
            <option>Web Development</option>
            <option>E-commerce</option>
            <option>SEO</option>
            <option>Digital Marketing</option>
            <option>Other</option>
          </select>
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="w-full">
          <label className="mb-1.5 block text-sm font-medium text-[#F8FAFC]">Industry</label>
          <select value={form.industry} onChange={(e) => update('industry', e.target.value)} className="flex h-10 w-full rounded-lg border border-[rgba(148,163,184,0.15)] bg-[#0B1220] px-3 py-2 text-sm text-[#F8FAFC]" disabled={isPending}>
            <option value="">Select</option>
            <option>Real Estate</option>
            <option>Education</option>
            <option>Healthcare</option>
            <option>E-commerce</option>
            <option>Hospitality</option>
            <option>Professional Services</option>
            <option>Startups</option>
            <option>SME</option>
            <option>Other</option>
          </select>
        </div>
        <Input id="users" label="Expected users" placeholder="e.g., 50" value={form.users} onChange={(e) => update('users', e.target.value)} disabled={isPending} />
      </div>
      <Input id="integrations" label="Required integrations" placeholder="e.g., HubSpot, Stripe, WhatsApp" value={form.integrations} onChange={(e) => update('integrations', e.target.value)} disabled={isPending} />
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="w-full">
          <label className="mb-1.5 block text-sm font-medium text-[#F8FAFC]">Timeline</label>
          <select value={form.timeline} onChange={(e) => update('timeline', e.target.value)} className="flex h-10 w-full rounded-lg border border-[rgba(148,163,184,0.15)] bg-[#0B1220] px-3 py-2 text-sm text-[#F8FAFC]" disabled={isPending}>
            <option value="">Select</option>
            <option>ASAP</option>
            <option>1 month</option>
            <option>2-3 months</option>
            <option>3-6 months</option>
            <option>6+ months</option>
            <option>Not sure</option>
          </select>
        </div>
        <div className="w-full">
          <label className="mb-1.5 block text-sm font-medium text-[#F8FAFC]">Budget</label>
          <select value={form.budget} onChange={(e) => update('budget', e.target.value)} className="flex h-10 w-full rounded-lg border border-[rgba(148,163,184,0.15)] bg-[#0B1220] px-3 py-2 text-sm text-[#F8FAFC]" disabled={isPending}>
            <option value="">Select</option>
            <option>Under $5k / ₹50k</option>
            <option>$5k-$20k / ₹50k-2L</option>
            <option>$20k-$50k / ₹2L-5L</option>
            <option>$50k-$100k / ₹5L-10L</option>
            <option>Above $100k / ₹10L</option>
            <option>Not sure</option>
          </select>
        </div>
      </div>
      <Textarea id="message" label="Project Description *" rows={5} placeholder="What are you trying to build, improve or automate?" value={form.message} onChange={(e) => update('message', e.target.value)} error={errors.message} disabled={isPending} />
      {result === 'error' && <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400"><AlertCircle className="h-4 w-4" /> Something went wrong. Try again or contact directly.</div>}
      <Button type="submit" size="lg" className="w-full" loading={isPending} disabled={isPending}><Send className="h-4 w-4" /> {isPending ? 'Sending...' : 'Request Estimate'}</Button>
    </form>
  );
}
