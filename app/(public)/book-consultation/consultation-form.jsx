'use client';
import { useState, useTransition } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createEnquiry } from '@/actions/enquiry';

export default function ConsultationForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({ name: '', email: '', company: '', country: '', project: '', date: '', time: '', timezone: '', website: '' });
  function update(k, v) { setForm((s) => ({ ...s, [k]: v })); if (errors[k]) setErrors((e) => { const n = { ...e }; delete n[k]; return n; }); }
  function validate() {
    const e = {}; if (!form.name.trim()) e.name='Required'; if (!form.email.trim()) e.email='Required'; else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email='Invalid'; if (!form.project.trim()) e.project='Required'; setErrors(e); return Object.keys(e).length===0;
  }
  function handleSubmit(e){ e.preventDefault(); if(!validate()) return; const fd=new FormData(); Object.entries(form).forEach(([k,v])=>fd.append(k,v)); fd.append('formType','consultation'); startTransition(async()=>{ const res=await createEnquiry(fd); if(res.success) setResult('success'); else { if(res.errors) setErrors(res.errors); else setResult('error'); } }); }
  if(result==='success') return <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-8 text-center"><CheckCircle className="mx-auto h-12 w-12 text-emerald-400"/><h3 className="mt-4 text-xl font-bold text-[#F8FAFC]">Request received</h3><p className="mt-2 text-sm text-[#94A3B8]">We will confirm your slot within 1 business day.</p><button onClick={()=>setResult(null)} className="mt-6 text-sm text-[#22D3EE] hover:underline">Submit another</button></div>;
  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e)=>update('website',e.target.value)} className="hidden" />
      <div className="grid gap-5 sm:grid-cols-2"><Input id="name" label="Name *" value={form.name} onChange={(e)=>update('name',e.target.value)} error={errors.name} disabled={isPending} /><Input id="email" type="email" label="Work Email *" value={form.email} onChange={(e)=>update('email',e.target.value)} error={errors.email} disabled={isPending} /></div>
      <div className="grid gap-5 sm:grid-cols-2"><Input id="company" label="Company" value={form.company} onChange={(e)=>update('company',e.target.value)} disabled={isPending} /><div className="w-full"><label className="mb-1.5 block text-sm font-medium text-[#F8FAFC]">Country</label><select value={form.country} onChange={(e)=>update('country',e.target.value)} className="flex h-10 w-full rounded-lg border border-[rgba(148,163,184,0.15)] bg-[#0B1220] px-3 py-2 text-sm text-[#F8FAFC]"><option value="">Select</option><option>United States</option><option>United Kingdom</option><option>United Arab Emirates</option><option>India</option><option>Other</option></select></div></div>
      <Textarea id="project" label="What are you trying to build? *" rows={4} placeholder="Goals, workflows, pain points..." value={form.project} onChange={(e)=>update('project',e.target.value)} error={errors.project} disabled={isPending} />
      <div className="grid gap-5 sm:grid-cols-3"><Input id="date" type="date" label="Preferred date" value={form.date} onChange={(e)=>update('date',e.target.value)} disabled={isPending} /><Input id="time" type="time" label="Preferred time" value={form.time} onChange={(e)=>update('time',e.target.value)} disabled={isPending} /><Input id="timezone" label="Timezone" placeholder="e.g., EST, GMT, GST" value={form.timezone} onChange={(e)=>update('timezone',e.target.value)} disabled={isPending} /></div>
      {result==='error' && <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400"><AlertCircle className="h-4 w-4"/> Something went wrong.</div>}
      <Button type="submit" size="lg" className="w-full" loading={isPending} disabled={isPending}><Send className="h-4 w-4"/> {isPending?'Sending...':'Request a Consultation'}</Button>
    </form>
  );
}
